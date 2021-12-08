'use strict';

const commands = require('./commands');
const buildConfig = require('./libs/config');
const CLI = require('./libs/cli');
const { standaloneUpgrade } = require('./libs/standalone');
const { isProjectPath, loadTencentGlobalConfig, ServerlessCLIError } = require('./libs/utils');

module.exports = async () => {
  const config = buildConfig();
  const cli = new CLI(config);

  const command = config.command;
  try {
    try {
      loadTencentGlobalConfig(cli, config);
    } catch (e) {
      throw new ServerlessCLIError(e.message, {
        step: '授权登录',
      });
    }

    if (process.argv.length === 2 && !(await isProjectPath(process.cwd()))) {
      return require('./libs/auto')(config, cli);
    }

    if (!config.command) {
      throw new Error(
        '检测到当前目录下已有 serverless 项目，请通过 "sls deploy" 进行部署，或在新路径下完成 serverless 项目初始化'
      );
    }
    if (commands[command]) {
      await commands[command](config, cli, command);
    } else {
      await commands.run(config, cli, command);
    }

    /*
     * 1. Do not check the CLI upgrade for deploy, version commands
     * 2. Skip update with --skip-update option
     * 3. Process standaloneUpgrade function for dev command in the closeHandler callback
     */
    if (!config['skip-update'] && !['deploy', 'dev', 'version'].includes(command)) {
      await standaloneUpgrade(config);
    }
  } catch (error) {
    process.exitCode = 1;
    if (error.isWarning) {
      cli.logWarning(error);
    } else if (error.isTypeError) {
      cli.logTypeError(error.typeErrors);
    } else if (cli.isSessionActive()) {
      cli.sessionStop('error', error, config.realCommand || command);
    } else {
      cli.logError(error, { command: config.realCommand || command });
      cli.log();
    }
  }

  return null;
};
