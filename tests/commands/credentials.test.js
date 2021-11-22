'use strict';

const path = require('path');
const fs = require('fs');
const overrideCwd = require('process-utils/override-cwd');
const credentialsCmd = require('../../src/commands/credentials');

describe('Test for credentials command: src/commands/credentials', () => {
  let restoreCwd;
  const cli = {};
  let credentialsPath;

  beforeAll(() => {
    cli.log = jest.fn();
    process.exit = jest.fn().mockImplementation(() => {
      return null;
    });
    restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/commands')).restoreCwd;
    credentialsPath = path.resolve(process.cwd(), 'credentials');
  });

  afterAll(async () => {
    if (fs.existsSync(credentialsPath)) {
      fs.unlinkSync(credentialsPath);
    }
    jest.restoreAllMocks();
    restoreCwd();
  });

  describe('Test credentials set', () => {
    let config = {};

    beforeEach(() => {
      config = { params: ['set'] };
      jest.clearAllMocks();
    });

    test('lost secretId', async () => {
      try {
        await credentialsCmd(config, cli);
      } catch (e) {
        expect(e.message).toBe('缺少secretId, 请使用 --secretId 或者 -i 指定');
      }
    });

    test('lost secretKey', async () => {
      config.secretId = 123;
      try {
        await credentialsCmd(config, cli);
      } catch (e) {
        expect(e.message).toBe('缺少secretKey, 请使用 --secretKey 或者 -k 指定');
        expect(e.extraErrorInfo.step).toBe('授权信息存储');
      }
    });

    test('create new credentials', async () => {
      config = {
        ...config,
        i: 'id',
        k: 'key',
        n: 'default',
      };

      await credentialsCmd(config, cli, credentialsPath);
      expect(cli.log.mock.calls[0][0]).toMatch('请确认当前电脑不是公用电脑或与他人共享');
    });

    test('overwrite credentials', async () => {
      config = {
        ...config,
        i: 'id',
        k: 'overwriteKey',
      };

      // can not overwirte content without --overwrite option
      await credentialsCmd(config, cli, credentialsPath);

      expect(cli.log.mock.calls[0][0]).toMatch('已存在，请使用 --overwrite 进行覆写');
      cli.log.mockClear();

      config.o = true;
      // overwrite with -o | --overwrite
      await credentialsCmd(config, cli, credentialsPath);
      expect(cli.log.mock.calls[0][0]).toMatch('更新成功');
    });
  });

  describe('Test credentials remove', () => {
    let config = {};

    beforeEach(() => {
      config = { params: ['remove'] };
      jest.clearAllMocks();
    });

    test('remove without --profile or -n', async () => {
      await credentialsCmd(config, cli);
      expect(cli.log.mock.calls[0][0]).toMatch(
        '指定授权名称，请通过 --profile 指定要删除的授权名称'
      );
    });

    test('remove with wrong profile', async () => {
      config.profile = 'wrong';

      await credentialsCmd(config, cli, credentialsPath);

      expect(cli.log.mock.calls[0][0]).toMatch(
        '不存在，请通过 serverless credentials list 查看当前授权信息'
      );
    });

    test('remove in a non-exist credentials file', async () => {
      config.profile = 'default';
      await credentialsCmd(config, cli, path.resolve(process.cwd(), 't_credentials'));

      expect(cli.log.mock.calls[0][0]).toMatch('法找到全局认证配置文件');
    });

    test('remove successfully', async () => {
      config.profile = 'default';
      await credentialsCmd(config, cli, credentialsPath);

      expect(cli.log.mock.calls[0][0]).toMatch(
        '如果需要删除相关授权用户请前往 腾讯云-用户控制台 删除相关用户'
      );
    });
  });

  test('list credentials', async () => {
    jest.clearAllMocks();
    await credentialsCmd({ params: ['list'] }, cli, credentialsPath);

    expect(cli.log.mock.calls[0][0]).toBe('Serverless: 当前已有用户授权信息名称：\n');
  });

  test('do thing for other action', async () => {
    await credentialsCmd({ params: ['test'] });
  });
});
