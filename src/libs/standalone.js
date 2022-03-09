/* istanbul ignore file */
'use strict';

const dayjs = require('dayjs');
const ci = require('ci-info');
const fsp = require('fs').promises;
const path = require('path');
const os = require('os');
const fs = require('fs');
const { red } = require('chalk');
const got = require('got');
const semver = require('semver');
const fse = require('fs-extra');
const stream = require('stream');
const { promisify } = require('util');

const pipeline = promisify(stream.pipeline);
const confirm = require('@serverless/utils/inquirer/confirm');
const { readAndParseSync, USER_PERFERENCE_FILE, writePerference } = require('./utils');
const { storeLocally, generatePayload } = require('./telemtry');

const BINARY_TMP_PATH = path.resolve(os.tmpdir(), 'serverless-tencent-binary-tmp');
const BINARY_PATH = `${os.homedir()}/.serverless-tencent/bin/serverless-tencent${
  process.platform === 'win32' ? '.exe' : ''
}`;

// If this process is called from standalone or npm script
const isStandaloneExecutable = Boolean(
  process.pkg && /^(?:\/snapshot\/|[A-Z]+:\\snapshot\\)/.test(__dirname)
);

const resolveLatestTag = async () => {
  const { body } = await got.get('https://slt-binary-sv-1300963013.file.myqcloud.com/latest-tag');
  return body;
};

const resolveUrl = (tagName) => {
  const platform = (() => {
    switch (process.platform) {
      case 'darwin':
        return 'macos';
      case 'win32':
        return 'win';
      default:
        return process.platform;
    }
  })();
  const arch = (() => {
    switch (process.arch) {
      case 'x32':
        return 'x86';
      case 'arm':
      case 'arm64':
        return 'armv6';
      default:
        return process.arch;
    }
  })();

  return `https://slt-binary-sv-1300963013.file.myqcloud.com/${tagName}/serverless-tencent-${platform}-${arch}${
    process.platform === 'win32' ? '.exe' : ''
  }`;
};

const standaloneUpgrade = async (options) => {
  // If this process is called by npm script, we do need to upgrade the standalone
  if (!isStandaloneExecutable) {
    return;
  }

  // Do not remind user to upgrade within 7days since they choose `do not upgrade`
  if (fse.existsSync(USER_PERFERENCE_FILE)) {
    const { standaloneUpgradeExpireDate } = readAndParseSync(USER_PERFERENCE_FILE);
    if (standaloneUpgradeExpireDate) {
      const expireTime = dayjs(Number(standaloneUpgradeExpireDate));
      const currentTime = dayjs(Date.now());
      if (currentTime.diff(expireTime, 'days') < 7) {
        return;
      }
    }
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
    console.log(red('Serverless CLI 有新版本发布，无法自动升级，请手动安装最新版本。'));
    process.exit();
  }

  const getCliProgressFooter = require('cli-progress-footer');
  const cliProgressFooter = getCliProgressFooter();
  cliProgressFooter.shouldAddProgressAnimationPrefix = true;
  cliProgressFooter.progressAnimationPrefixFrames =
    cliProgressFooter.progressAnimationPrefixFrames.map((frame) => `\x1b[93m${frame}\x1b[39m`);

  const standaloneTelemetryPayload = await generatePayload({
    command: 'upgrade',
  });

  try {
    // For auto upgrade situation, need users to confirm the upgrade, or it will skip after 5s
    let answer;
    const tid = setTimeout(async () => {
      if (answer === undefined) {
        await writePerference({ standaloneUpgradeExpireDate: Date.now() }); // record the date that users choose don't upgrade
        console.log('\n超时无响应，已取消升级。');
        process.exit();
      }
    }, 5000);

    answer = await confirm('Serverless CLI 有新版本更新，是否立即升级？', {
      name: 'autoUpgradeCLI',
    });
    clearTimeout(tid);

    if (!answer) {
      await writePerference({ standaloneUpgradeExpireDate: Date.now() }); // record the date that users choose don't upgrade
      return;
    }

    cliProgressFooter.updateProgress(`正在升级 Serverless Tencent CLI ${latestTag}`);
    const downloadUrl = resolveUrl(latestTag);

    await fse.ensureDir(path.dirname(BINARY_PATH));
    await fse.remove(BINARY_TMP_PATH);
    await pipeline(got.stream(downloadUrl), fs.createWriteStream(BINARY_TMP_PATH));
    /*
     * We can not directly overrite a running exe process on windows(but we can do it on linux and mac), so we need to rename it
     * to another specical name: serverless-tencent.old.exe, and then we can name the latest standalone as serverless-tencent.exe
     * Detail: https://stackoverflow.com/questions/55247194/how-to-self-update-application-while-running/55247459#55247459
     */
    if (process.platform === 'win32') {
      const oldWinBinaryPath = `${os.homedir}/.serverless-tencent/bin/serverless-tencent.old.exe`;
      await fsp.rename(BINARY_PATH, oldWinBinaryPath);
    }
    await fsp.rename(BINARY_TMP_PATH, BINARY_PATH);
    await fsp.chmod(BINARY_PATH, 0o755);

    console.log('\n升级成功');
    await storeLocally(standaloneTelemetryPayload);
  } catch (e) {
    console.log(red(`升级失败: ${e.message}`));

    e.source = 'Serverless::CLI';
    e.step = '升级命令行';
    await storeLocally(
      {
        ...standaloneTelemetryPayload,
        outcome: 'failure',
        failure_reason: e.message,
      },
      e
    );

    process.exit(-1);
  } finally {
    cliProgressFooter.updateProgress();
  }
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
