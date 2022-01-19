'use strict';

const path = require('path');
const overrideCwd = require('process-utils/override-cwd');
const logsCmd = require('../../src/commands/logs');
const utils = require('../../src/libs/utils');

jest.mock('@serverless/platform-client-china', () => {
  return {
    ServerlessSDK: class {
      async getLogs() {
        if (process.env.error) {
          throw new Error('service error');
        }
        if (process.env.empty) {
          return [];
        }
        return [{ message: 'log1' }, { message: 'log2' }];
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

describe('Test getLogs: src/commands/getLogs', () => {
  let restoreCwd;
  const cli = {
    log: jest.fn(),
    logLogo: () => {},
    sessionStart: () => {},
    sessionStop: () => {},
  };

  beforeAll(() => {
    restoreCwd = overrideCwd(
      path.resolve(process.cwd(), 'tests/commands/materials/component')
    ).restoreCwd;
    jest.spyOn(utils, 'login').mockImplementation(async () => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process exit');
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
    restoreCwd();
  });

  test('specify startTime', async () => {
    await logsCmd({ startTime: Date.now(), target: './' }, cli);
  });

  test('specify error startTime', async () => {
    try {
      await logsCmd({ startTime: 'test' }, cli);
    } catch (e) {
      expect(e.message).toBe('process exit');
    }

    expect(cli.log.mock.calls[3][0]).toMatch('指定时间格式不正确，请检查后重试');
  });

  test('test logs with interval', async () => {
    const tailLogs = logsCmd({ t: true }, cli);
    const sleep500 = new Promise((resolve) => setTimeout(resolve, 500, 'one'));
    jest.useFakeTimers();
    const value = await Promise.race([tailLogs, sleep500]);
    expect(value).toBe('one');
    jest.runOnlyPendingTimers();
  });

  test('test empty response', async () => {
    process.env.empty = true;
    await logsCmd({}, cli);
    delete process.env.empty;
  });

  test('get logs with service error', async () => {
    process.env.error = true;
    try {
      await logsCmd({}, cli);
    } catch (e) {
      expect(e.message).toBe('service error');
    }

    delete process.env.error;
  });
});
