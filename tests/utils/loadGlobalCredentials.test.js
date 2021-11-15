'use strict';

const path = require('path');
const { loadTencentGlobalConfig } = require('../../src/libs/utils/basic');

const cli = {
  log: console.log,
};

const originEnv = process.env;

beforeEach(() => (process.env = { ...originEnv }));

const credentialsPath = path.join(__dirname, './credentials');

describe('Test loading global credentials', () => {
  test('import credentials with default profile', () => {
    loadTencentGlobalConfig(cli, {}, credentialsPath);
    expect(process.env.TENCENT_SECRET_KEY).toBe('default_key');
    expect(process.env.TENCENT_SECRET_ID).toBe('default_id');
  });

  test('import credentails with specific profile', () => {
    loadTencentGlobalConfig(cli, { profile: 'test' }, credentialsPath);
    expect(process.env.TENCENT_SECRET_KEY).toBe('test_key');
    expect(process.env.TENCENT_SECRET_ID).toBe('test_id');
  });

  test('import credentials with the non-existed profile', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    cli.log = jest.fn();

    loadTencentGlobalConfig(cli, { profile: 'wrong' }, credentialsPath);

    expect(cli.log.mock.calls[0][0]).toMatch(
      '授权信息 wrong 不存在，请通过 serverless credentials list 查看当前授权信息'
    );
    expect(mockExit).toHaveBeenCalledWith();
  });
});

afterAll(() => {
  jest.restoreAllMocks();
  process.env = { ...originEnv };
});
