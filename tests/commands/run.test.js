'use strict';

const path = require('path');
const run = require('../../src/commands/run');
const buildConfig = require('../../src/libs/config');
const utils = require('../../src/libs/utils');
const fse = require('fs-extra');
const CLI = require('../../src/libs/cli');
const overrideCwd = require('process-utils/override-cwd');
const inquirer = require('@serverless/utils/inquirer');

jest.mock('../../src/commands/runAll.js', () => async () => 'isTemplate');
jest.mock('../../src/libs/notifications/request', () => async () => {
  return [];
});
jest.mock('../../src/libs/telemtry', () => {
  return {
    storeLocally: async () => {},
    send: async () => {},
    generatePayload: async () => ({}),
  };
});
jest.mock('@serverless/platform-client-china', () => {
  return {
    ServerlessSDK: class {
      async deploy(yaml, cred, options) {
        if (options.statusReceiver) {
          options.statusReceiver('test');
          options.statusReceiver();
        }
        return {
          outputs: { vendorMessage: 'vendor' },
          typeErrors: [],
          instanceStatus: 'error',
          deploymentError: 'deploymentError',
        };
      }
      async connect() {
        return {};
      }
      disconnect() {
        return {};
      }
      async remove() {
        return {};
      }
      async bindRole() {
        return {};
      }
      async run() {
        return { outputs: {}, actionStatus: 'error', actionError: 'action error' };
      }
    },

    utils: {
      getOrgId: async () => 123,
      buildTempAccessKeyForTencent: () => '',
    },
  };
});
describe('test command run: src/command/run', () => {
  test('run into a template project', async () => {
    const restoreTempCwd = overrideCwd(
      path.resolve(process.cwd(), 'tests/commands/materials/template')
    ).restoreCwd;

    const config = buildConfig();
    const cli = new CLI(config);
    const result = await run(config, cli, 'deploy');

    expect(result).toBe('isTemplate');
    restoreTempCwd();
  });

  describe('run into a single component project', () => {
    let restoreCwd;
    let config;
    const cli = {
      logLogo: () => {},
      sessionStatus: () => {},
      logOutputs: (msg) => console.log(msg),
      sessionStop: () => {},
      sessionStart: () => {},
      logTypeError: () => {},
    };

    beforeAll(() => {
      cli.log = jest.fn();

      jest.spyOn(utils, 'login').mockImplementation(async () => {});
      jest.spyOn(utils, 'writeClientUid').mockImplementation(async () => ({}));
      jest.spyOn(utils, 'writeJsonToCredentials').mockImplementation(() => {});
      jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({ entryFile: 'koa.js' }));

      restoreCwd = overrideCwd(
        path.resolve(process.cwd(), 'tests/commands/materials/component')
      ).restoreCwd;
    });

    beforeEach(() => {
      config = buildConfig();
    });
    afterAll(() => {
      jest.restoreAllMocks();
      restoreCwd();
    });

    test('deploy with generating YML for nodejs', async () => {
      await fse.rename('serverless.yml', 'serverless.yml.bak');

      await run(config, cli, 'deploy');

      await fse.rename('serverless.yml.bak', 'serverless.yml');
    });

    test('deploy with serverless config', async () => {
      config.debug = true;
      config.dev = true;
      await run(config, cli, 'deploy');
    });

    test('remove', async () => {
      await run(config, cli, 'remove');
    });

    test('custom command', async () => {
      await run(config, cli, 'list_alias');
    });

    test('bind role', async () => {
      config.params = ['role'];
      await run(config, cli, 'bind');
    });

    test('deploy with error', async () => {
      config.target = '../';
      try {
        await run(config, cli, 'deploy');
      } catch (e) {
        expect(e.message).toBe('无法部署当前目录，请检查目录或添加 serverless.yml 应用配置文件后重试。');
      }
    });
  });
});
