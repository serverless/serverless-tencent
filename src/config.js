'use strict';

/*
 * Serverless Components: CLI Handler
 */

const path = require('path');
const http = require('http');
const https = require('https');
const minimist = require('minimist');
const dotenv = require('dotenv');
const semver = require('semver');
const chalk = require('chalk');
const HttpsProxyAgent = require('https-proxy-agent');
const { loadInstanceConfig, fileExistsSync } = require('./utils');

module.exports = () => {
  const args = minimist(process.argv.slice(2));
  const instanceConfig = loadInstanceConfig(process.cwd());
  const stage = args.stage || (instanceConfig && instanceConfig.stage) || 'dev';

  const params = [];
  if (args._[1]) {
    params.push(args._[1]);
  }
  if (args._[2]) {
    params.push(args._[2]);
  }
  if (args._[3]) {
    params.push(args._[3]);
  }
  if (args._[4]) {
    params.push(args._[4]);
  }

  const config = { ...args, params };
  if (config._) {
    delete config._;
  }

  config.platformStage = process.env.SERVERLESS_PLATFORM_STAGE || 'prod';
  config.debug = process.env.SLS_DEBUG || !!args.debug;

  // Add stage environment variable
  if (args.stage && !process.env.SERVERLESS_STAGE) {
    process.env.SERVERLESS_STAGE = args.stage;
  }

  /**
   * Load environment variables from .env files, 2 directories up
   * Nearest to current working directory is preferred
   */
  const defaultEnvFilePath = path.join(process.cwd(), '.env');
  const stageEnvFilePath = path.join(process.cwd(), `.env.${stage}`);
  const firstParentDefaultEnvFilePath = path.join(process.cwd(), '..', '.env');
  const firstParentStageEnvFilePath = path.join(process.cwd(), '..', `.env.${stage}`);
  const secondParentDefaultEnvFilePath = path.join(process.cwd(), '../..', '.env');
  const secondParentStageEnvFilePath = path.join(process.cwd(), '../..', `.env.${stage}`);

  let dotEnvContent;
  if (stage && fileExistsSync(stageEnvFilePath)) {
    dotEnvContent = dotenv.config({ path: path.resolve(stageEnvFilePath) });
  } else if (fileExistsSync(defaultEnvFilePath)) {
    dotEnvContent = dotenv.config({ path: path.resolve(defaultEnvFilePath) });
  } else if (fileExistsSync(firstParentStageEnvFilePath)) {
    dotEnvContent = dotenv.config({
      path: path.resolve(firstParentStageEnvFilePath),
    });
  } else if (fileExistsSync(firstParentDefaultEnvFilePath)) {
    dotEnvContent = dotenv.config({
      path: path.resolve(firstParentDefaultEnvFilePath),
    });
  } else if (fileExistsSync(secondParentStageEnvFilePath)) {
    dotEnvContent = dotenv.config({
      path: path.resolve(secondParentStageEnvFilePath),
    });
  } else if (fileExistsSync(secondParentDefaultEnvFilePath)) {
    dotEnvContent = dotenv.config({
      path: path.resolve(secondParentDefaultEnvFilePath),
    });
  }

  /**
   * Set global proxy agent if it's configured in environment variable
   */
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  if (httpProxy || httpsProxy) {
    if (semver.gte(process.version, 'v11.7.0')) {
      // save default global agent in case we want to restore them
      // and hand proxy handling to other libs
      http.defaultGlobalAgent = http.globalAgent;
      https.defaultGlobalAgent = https.globalAgent;
      http.globalAgent = new HttpsProxyAgent(httpProxy || httpsProxy);
      https.globalAgent = new HttpsProxyAgent(httpsProxy || httpProxy);
    } else {
      process.stdout.write(
        `Serverless: ${chalk.yellow(
          'you need to upgrade the NodeJS in order to use http/https proxy.(Nodejs >= 11.7)'
        )}\n`
      );
    }
  }

  // Check env file whether or not containing an inline comment, which is invalid for the dotenv package's parsing: https://github.com/motdotla/dotenv/issues/484
  if (dotEnvContent && dotEnvContent.parsed) {
    const envKeys = Object.keys(dotEnvContent.parsed);
    envKeys.forEach((key) => {
      const regexForComment = / #+.*$/g;
      const envValue = dotEnvContent.parsed[key];
      if (regexForComment.test(envValue)) {
        console.log(
          chalk.yellow(
            `在dotenv配置中字段${key}发现 #,请确保注释都写在单独由#开头的新一行, 不支持行内注释。详情查看：https://github.com/motdotla/dotenv#rules\n`
          )
        );
      }
    });
  }

  /**
   * Handle interactive onboarding when using the "serverless" command for China-based users
   */

  let command = args._[0];

  // handle "publish" command.
  if (command === 'publish') {
    command = 'registry';
    config.params.unshift('publish');
  }

  // // handle "unpublish" command.
  if (command === 'unpublish') {
    command = 'registry';
    config.params.unshift('unpublish');
  }
  /**
   * Running "serverless --help" is equivalent to "serverless help"
   */
  if (args.help || args.h || args['help-components']) {
    config.originalCommand = command;
    command = 'help';
  }

  const checkingVersion = args._[0] === 'version' || args.version || args.v;
  if (checkingVersion) {
    config.command = 'version';
  }

  config.command = command;

  return config;
};
