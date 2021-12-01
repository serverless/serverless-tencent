'use strict';
const ci = require('ci-info');
const fsp = require('fs').promises;
const path = require('path');
const os = require('os');
const fetch = require('node-fetch');
const fs = require('fs');
const { red } = require('chalk');
const got = require('got');
const semver = require('semver');
const fse = require('fs-extra');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);
const confirm = require('@serverless/utils/inquirer/confirm');

const BINARY_TMP_PATH = path.resolve(os.tmpdir(), 'serverless-binary-tmp');
const BINARY_PATH = `${os.homedir()}/.serverless/bin/serverless-tencent`;

// If this process is called from standalone or npm script
const isStandaloneExecutable = Boolean(
  process.pkg && /^(?:\/snapshot\/|[A-Z]+:\\snapshot\\)/.test(__dirname)
);

const resolveLatestTag = async () => {
  const { body } = await got.get(
    'https://slt-binary-sv-1300963013.cos.accelerate.myqcloud.com/latest-tag'
  );
  return body;
};

const resolveUrl = (tagName) => {
  const platform = (() => {
    switch (process.platform) {
      case 'darwin':
        return 'macos';
      default:
        return process.platform;
    }
  })();
  const arch = (() => {
    switch (process.arch) {
      case 'x32':
        return 'x86';
      case 'arm':
        return 'armv6';
      case 'arm64':
        if (process.platform === 'darwin') {
          // Handle case of M1 Macs that are using x64 binary via Rosetta
          return 'x64';
        }
        return 'armv6';
      default:
        return process.arch;
    }
  })();

  return `https://slt-binary-sv-1300963013.cos.accelerate.myqcloud.com/${tagName}/serverless-tencent-${platform}-${arch}${
    platform === 'win32' ? '.exe' : ''
  }`;
};

const standaloneUpgrade = async (options) => {
  // If this process is called by npm script, we do need to upgrade the standalone
  if (!isStandaloneExecutable) {
    return;
  }

  const ciName = (() => {
    if (process.env.SERVERLESS_CI_CD) {
      return 'Serverless CI/CD';
    }

    if (process.env.SEED_APP_NAME) {
      return 'Seed';
    }

    /* istanbul ignore next */
    if (ci.isCI) {
      if (ci.name) {
        return ci.name;
      }
      return 'unknown';
    }
    return 'untracked';
  })();

  // We hidden notification for CI environment
  if (ciName !== 'untracked') {
    return;
  }

  const latestTag = await resolveLatestTag();
  const latestVersion = latestTag.slice(1);
  const { version } = require('../../package.json');

  if (semver.eq(latestVersion, version)) {
    return;
  }

  if (semver.major(latestVersion) > semver.major(version) && !options.major) {
    console.log(red('有大版本更新，无法自动升级'));
    process.exit();
  }

  // For auto upgrade situation, need users to confirm the upgrade, or it will skip after 5s
  const waitConfirm = async (timeout) =>
    new Promise(async (resolve) => {
      let tid = setTimeout(function () {
        console.log('\n无应答，取消升级');
        process.exit();
      }, timeout);
      const answer = await confirm('监测到serverless-tencent CLI 独立版本有更新，是否需要升级?', {
        name: 'autoUpgradeCLI',
      });
      clearTimeout(tid);
      resolve(answer);
    });
  if (!(await waitConfirm(5000))) {
    return;
  }

  console.log(`正在下载serverless-tencent CLI: ${latestTag}`);
  const downloadUrl = resolveUrl(latestTag);
  const standaloneResponse = await fetch(downloadUrl);
  if (!standaloneResponse.ok) {
    console.log(
      red(`下载最新独立版本 serverless-tencent CLI 失败, 错误码: ${standaloneResponse.status}`)
    );
    process.exit();
  }

  fse.ensureFileSync(BINARY_PATH);
  await fse.remove(BINARY_TMP_PATH);
  await pipeline(standaloneResponse.body, fs.createWriteStream(BINARY_TMP_PATH));
  await fsp.rename(BINARY_TMP_PATH, BINARY_PATH);
  await fsp.chmod(BINARY_PATH, 0o755);

  console.log(`成功升级 serverless-tencent CLI 独立版本为: ${latestTag}`);
};

const uninstall = async () => {
  console.log('正在卸载 serverless-tencent CLI 独立版本');
  await fse.remove(path.dirname(BINARY_PATH));

  console.log('卸载成功');
};

module.exports = {
  standaloneUpgrade,
  uninstall,
};
