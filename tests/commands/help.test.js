'use strict';

const path = require('path');
const overrideCwd = require('process-utils/override-cwd');
const helpCmd = require('../../src/commands/help');

jest.mock('@serverless/utils/inquirer', () => {
  return {
    prompt: () => {},
  };
});

describe('sls --help command: src/commands/help', () => {
  const cli = { logLogo: () => {} };
  beforeAll(() => {
    cli.log = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('sls help', async () => {
    await helpCmd({ params: [] }, cli);
    expect(cli.log.mock.calls[0][0]).toMatch('快速开始');
  });

  test('sls help in scf component project', async () => {
    const restoreCwd = overrideCwd(
      path.resolve(process.cwd(), 'tests/commands/materials/component')
    ).restoreCwd;
    await helpCmd({ params: [] }, cli);
    expect(cli.log.mock.calls[1][0]).toMatch('函数组件命令');
    restoreCwd();
  });

  test('sls deploy --help', async () => {
    await helpCmd({ help: true, originalCommand: 'deploy', params: [] }, cli);

    expect(cli.log.mock.calls[2][0]).toMatch('部署应用到云端');
  });

  test('sls --help remove', async () => {
    await helpCmd({ help: 'remove', command: 'remove', params: [] }, cli);

    expect(cli.log.mock.calls[3][0]).toMatch('移除应用');
  });

  test('sls help invoke local', async () => {
    await helpCmd({ command: 'help', params: ['invoke', 'local'] }, cli);

    expect(cli.log.mock.calls[4][0]).toMatch('指定要调用的组件实例路径');
  });

  test('sls help with unsupported command', async () => {
    await helpCmd({ command: 'help', params: ['unsupported'] }, cli);
    expect(cli.log.mock.calls[6][0]).toMatch('没有找到 "unsupported" 命令');
  });
});
