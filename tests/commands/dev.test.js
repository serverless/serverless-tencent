'use strict';

const fs = require('fs');
const path = require('path');
const overrideCwd = require('process-utils/override-cwd');
const devCmd = require('../../src/commands/dev');
const { writeYamlFile } = require('../testUtils');
const utils = require('../../src/libs/utils');
const chokidar = require('chokidar');

jest.mock('@serverless/platform-client-china', () => {
  return {
    ServerlessSDK: class {
      async deploy() {
        return {};
      }
      async getInstance() {
        return {
          instance: {
            instanceStatus: 'active',
            instanceName: 'test',
            state: {
              lambdaArn: 'test',
              region: 'ap-shanghai',
              function: 'function-demo',
            },
            outputs: {
              scf: 'scf-demo',
              runtime: 'nodejs12.15',
              namespace: 'default',
            },
          },
        };
      }
    },

    utils: {
      startTencentRemoteLogAndDebug: async (info, region, cb) => {
        if (process.env.DEBUG_ERROR && cb) {
          cb('error message', { type: 'error' });
        } else if (cb) {
          cb('startTencentRemoteLogAndDebug message');
        }
        return {};
      },

      stopTencentRemoteLogAndDebug: async (info, region, cb) => {
        if (cb.stdout) {
          cb.stdout.write(region);
        }
        return {};
      },
      getOrgId: async () => 123,
      doesRuntimeSupportDebug: (v) => {
        if (v.startsWith('nodejs')) {
          return true;
        }

        return false;
      },
    },
  };
});

describe('Test dev command', () => {
  let restoreCwd;
  let config = {};
  const cli = {
    logLogo: () => {},
    sessionStatus: () => {},
    logOutputs: (msg) => console.log(msg),
    sessionStop: () => {},
    sessionStart: () => {},
  };

  beforeAll(() => {
    cli.log = jest.fn();
    cli.logError = jest.fn();
    jest.spyOn(chokidar, 'watch').mockImplementation(() => ({
      on: async (_, cb) => {
        await cb();
      },
    }));
    process.exit = jest.fn().mockImplementation(() => {
      return null;
    });
    restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/commands')).restoreCwd;
    jest.spyOn(utils, 'login').mockImplementation(async () => ({}));
  });

  beforeEach(() => {
    config = {};
    jest.clearAllMocks();
  });

  test('can not run dev in a template project', async () => {
    fs.mkdirSync('tmp');
    writeYamlFile('tmp/serverless.yml', { component: 'scf', name: 'test' });
    try {
      await devCmd(config, cli, 'dev');

      expect(console.log.mock.calls[0][0]).toMatch(
        '该命令暂不支持对多组件进行调用, 使用 --target 指定执行目录'
      );
      expect(process.exit).toHaveBeenCalledWith();
      /* eslint-disable-next-line */
    } catch (e) {}
  });

  test('deploy with a node runtime', async () => {
    writeYamlFile('serverless.yml', {
      component: 'scf',
      filter: 'app',
      name: 'test',
      org: 'test',
      inputs: {
        runtime: 'nodejs12.15',
      },
    });
    config.target = './';
    await devCmd(config, cli, 'dev');
  });

  test('get log error', async () => {
    writeYamlFile('serverless.yml', {
      component: 'scf',
      filter: 'app',
      name: 'test',
      org: 'test',
      inputs: {
        runtime: 'nodejs12.15',
      },
    });
    config.target = './';

    await devCmd(config, cli, 'dev');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(cli.log.mock.calls.toString().includes('startTencentRemoteLogAndDebug message')).toBe(
      true
    );

    process.env.DEBUG_ERROR = true;
    await devCmd(config, cli, 'dev');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(cli.logError.mock.calls[0][0].message).toMatch('error message');
    delete process.env.DEBUG_ERROR;
  });

  afterAll(async () => {
    fs.unlinkSync('serverless.yml');
    fs.rmSync('tmp', { force: true, recursive: true });
    jest.restoreAllMocks();
    restoreCwd();
  });
});
