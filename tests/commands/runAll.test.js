'use strict';

const overrideCwd = require('process-utils/override-cwd');
const path = require('path');
const utils = require('../../src/libs/utils');
const buildConfig = require('../../src/libs/config');
const runAll = require('../../src/commands/runAll');

jest.mock('@serverless/utils/inquirer', () => {
  return {
    prompt: () => {},
  };
});

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
      async deploy() {
        // return error result
        if (process.env.showErrorResult) {
          throw new Error('deploy error');
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
    },

    utils: {
      getOrgId: async () => 123,
      buildTempAccessKeyForTencent: () => '',
    },
  };
});

describe('Run in the template project: src/commands/runAll', () => {
  const cli = {
    logLogo: () => {},
    sessionStatus: () => {},
    logOutputs: () => {},
    sessionStop: () => {},
    sessionStart: () => {},
    logTypeError: () => {},
    logError: console.log,
  };

  beforeAll(() => {
    cli.log = jest.fn();

    jest.spyOn(utils, 'login').mockImplementation(async () => {});
    jest.spyOn(utils, 'writeClientUid').mockImplementation(async () => ({}));
    jest.spyOn(utils, 'writeJsonToCredentials').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('run inside an invliad template project', () => {
    let restoreWrongCwd;
    beforeAll(() => {
      restoreWrongCwd = overrideCwd(
        path.resolve(process.cwd(), 'tests/commands/materials/invalidTemplate')
      ).restoreCwd;
    });

    afterAll(() => {
      restoreWrongCwd();
    });

    test('invalid_template folder', async () => {
      const config = buildConfig();
      try {
        await runAll(config, cli, 'deploy');
      } catch (e) {
        expect(e.message).toBe('在子文件夹中没有发现组件信息');
      }
    });
  });

  describe('normal template project', () => {
    let restoreCwd;

    beforeAll(() => {
      restoreCwd = overrideCwd(
        path.resolve(process.cwd(), 'tests/commands/materials/template')
      ).restoreCwd;
    });
    test('deployment', async () => {
      const config = buildConfig();
      config.debug = true;
      await runAll(config, cli, 'deploy');
    });

    test('deployment with failed instance', async () => {
      const config = buildConfig();
      process.env.showErrorResult = true;
      await runAll(config, cli, 'deploy');
      delete process.env.showErrorResult;
    });

    test('removement', async () => {
      const config = buildConfig();
      config.debug = true;
      await runAll(config, cli, 'remove');
    });

    test('custom command', async () => {
      const config = buildConfig();
      process.env.SERVERLESS_PLATFORM_STAGE = 'dev';
      await runAll(config, cli, 'custom');

      delete process.env.SERVERLESS_PLATFORM_STAGE;
    });

    afterAll(() => {
      restoreCwd();
    });
  });
});
