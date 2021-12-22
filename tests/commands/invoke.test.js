'use strict';

const invokeCmd = require('../../src/commands/invoke/index');
const utils = require('../../src/libs/utils');
const path = require('node:path');
const overrideCwd = require('process-utils/override-cwd');

jest.mock('../../src/commands/invoke/invoke-local', () => async () => 'isInvokeLocal');
jest.mock('@serverless/platform-client-china', () => {
  return {
    ServerlessSDK: class {
      async invoke() {
        if (process.env.error) {
          throw new Error('service error');
        }
        return {
          retMsg: JSON.stringify('invoke message'),
          outputs: {
            message: 'remote invoke outputs',
          },
        };
      }
    },

    utils: {
      getOrgId: async () => 123,
    },
  };
});

jest.mock('../../src/libs/telemtry', () => {
  return {
    storeLocally: async () => {},
    generatePayload: async () => ({}),
  };
});

describe('Remote function invoke: src/commands/invoke', () => {
  let restoreCwd;
  const cli = {
    log: jest.fn(),
    logOutputs: () => {},
  };
  let config = {};

  beforeAll(() => {
    restoreCwd = overrideCwd(
      path.resolve(process.cwd(), 'tests/commands/materials/component')
    ).restoreCwd;
    jest.spyOn(utils, 'login').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process exit');
    });
  });

  beforeEach(() => {
    config = {
      params: [],
    };
  });
  afterAll(() => {
    jest.restoreAllMocks();
    restoreCwd();
  });

  test('remote invoke in a tempalte', async () => {
    const tmpRestoreCwd = overrideCwd(path.resolve(process.cwd(), '../template')).restoreCwd;
    await invokeCmd(config, cli);
    tmpRestoreCwd();
  });

  test('is invoke locally', async () => {
    config.params = ['local'];
    const res = await invokeCmd(config, cli);
    expect(res).toBe('isInvokeLocal');
  });

  test('invoke: duplicated data and path args', async () => {
    config.data = JSON.stringify({ test: 1 });
    config.path = './invoke.json';

    try {
      await invokeCmd(config, cli);
    } catch (e) {
      expect(e.message).toBe('process exit');
    }
    expect(cli.log.mock.calls[4][0]).toMatch('不能同时指定 data 与 path, 请检查后重试');
  });

  test('invoke: pass wrong json format', async () => {
    config.path = './invoke_wrong.txt';
    try {
      await invokeCmd(config, cli);
    } catch (e) {
      expect(e.message).toBe('process exit');
    }
    expect(cli.log.mock.calls[5][0]).toMatch('传入的 data 不是序列化 JSON, 请检查后重试');
  });

  test('invoke in a non-scf project', async () => {
    const tmpRestoreCwd = overrideCwd(
      path.resolve(process.cwd(), '../template/website')
    ).restoreCwd;
    try {
      await invokeCmd(config, cli);
    } catch (e) {
      expect(e.message).toBe('process exit');
    }
    expect(cli.log.mock.calls[6][0]).toMatch('Inovke 命令仅能在 scf 或者 multi-scf 组件目录中调用');
    tmpRestoreCwd();
  });

  test('invoke for a notfound path file', async () => {
    config.path = './notfound.json';
    try {
      await invokeCmd(config, cli);
    } catch (e) {
      expect(e.message).toBe('process exit');
    }

    expect(cli.log.mock.calls[7][0]).toMatch('找不到指定的路径文件, 请检查后重试');
  });

  test('remote invoke with service error', async () => {
    process.env.error = true;
    try {
      await invokeCmd(config, cli);
    } catch (e) {
      expect(e.message).toBe('service error');
    }
    delete process.env.error;
  });
});
