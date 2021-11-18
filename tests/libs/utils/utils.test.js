'use strict';

const path = require('path');
const fs = require('fs');
const { utils: platformUtils } = require('@serverless/platform-client-china');
const overrideEnv = require('process-utils/override-env');
const overrideCwd = require('process-utils/override-cwd');
const utils = require('../../../src/libs/utils/utils');
const { loadInstanceConfig } = require('../../../src/libs/utils/basic');
const { addArgvToProcess, writeYamlFile, writeFile } = require('../../testUtils');

let restoreCwd;

beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/libs/')).restoreCwd;
});

describe('src/libs/utils/utils.js functions test', () => {
  test('loadInstanceCredentials', () => {
    const { restoreEnv } = overrideEnv({
      variables: {
        TENCENT_APP_ID: 123,
        TENCENT_SECRET_ID: '123',
        TENCENT_SECRET_KEY: '123',
        TENCENT_TOKEN: 'token',
      },
    });

    const result = utils.loadInstanceCredentials();
    expect(result).toEqual({
      tencent: {
        AppId: '123',
        SecretId: '123',
        SecretKey: '123',
        Token: 'token',
      },
    });

    restoreEnv();
  });

  test('login', async () => {
    const delFile = writeFile('.env', '');
    jest.spyOn(platformUtils, 'loginWithTencent').mockImplementation(() => [
      true,
      {
        appid: '456',
        token: 'mock_token',
        secret_id: '456',
        secret_key: '456',
      },
    ]);

    await utils.login({ useTencentCredential: true });
    expect(process.env.TENCENT_APP_ID).toEqual('456');
    expect(process.env.TENCENT_SECRET_ID).toEqual('456');
    expect(process.env.TENCENT_TOKEN).toEqual('mock_token');

    delFile();
  });

  test('loadTencentInstanceConfig', async () => {
    const restoreArgv = addArgvToProcess(['invoke', '--stage=dev', '--org=test', '--app=test']);
    writeYamlFile('serverless.yml', {
      component: 'koa',
      name: 'test',
      inputs: {
        src: './',
      },
    });
    expect(await utils.loadTencentInstanceConfig(process.cwd())).toEqual({
      component: 'koa',
      name: 'test',
      stage: 'dev',
      org: 'test',
      app: 'test',
      inputs: {
        src: process.cwd(),
        originSrc: './',
      },
    });

    loadInstanceConfig.clear();
    writeYamlFile('serverless.yml', {
      component: 'koa',
      name: 'test',
      inputs: {
        src: {
          src: './',
          dist: './dist',
        },
      },
    });

    expect(await utils.loadTencentInstanceConfig(process.cwd())).toEqual({
      component: 'koa',
      name: 'test',
      stage: 'dev',
      org: 'test',
      app: 'test',
      inputs: {
        originSrc: './',
        originDist: './dist',
        src: {
          src: process.cwd(),
          dist: path.resolve(process.cwd(), 'dist'),
        },
      },
    });

    fs.unlinkSync('serverless.yml');
    restoreArgv();
  });

  describe('Test getDirForInvokeCommand', () => {
    const getDFIC = utils.getDirForInvokeCommand;
    test('Return from alone scf folder', async () => {
      jest.spyOn(platformUtils, 'getOrgId').mockImplementation(() => 123);

      const filepath = path.resolve(process.cwd(), 'utils/serverless.yml');
      writeYamlFile(filepath, {
        component: 'scf',
        name: 'test',
      });

      const data = await getDFIC(process.cwd());
      expect(data).toEqual(path.resolve('utils'));

      fs.unlinkSync(filepath);
    });

    test('Error with no executable folder', async () => {
      try {
        await getDFIC(process.cwd());
      } catch (e) {
        expect(e.message).toEqual('没有找到可执行的函数目录，请使用 --target 指定或检查后再试');
      }
    });

    test('alone multi-scf proejct', async () => {
      writeYamlFile('utils/serverless.yml', {
        component: 'multi-scf',
        name: 'test',
      });

      expect(await getDFIC(process.cwd())).toBe(path.resolve(process.cwd(), 'utils'));

      fs.unlinkSync('utils/serverless.yml');
    });

    test('more than one multi-scf project', async () => {
      loadInstanceConfig.clear();
      fs.mkdirSync('tmp');
      writeYamlFile('tmp/serverless.yml', {
        component: 'multi-scf',
        name: 'test',
        inputs: {
          functions: {
            copy: {},
          },
        },
      });

      writeYamlFile('utils/serverless.yml', {
        component: 'multi-scf',
        name: 'test2',
        inputs: {
          functions: {
            test: {
              handler: 'test',
            },
            copy: {},
          },
        },
      });

      // lose to set alias
      try {
        await getDFIC(process.cwd());
      } catch (e) {
        expect(e.message).toBe('请使用 --function / -f 指定要调用的函数');
      }

      // use specific function alias
      expect(await getDFIC(process.cwd(), 'test')).toBe(path.resolve(process.cwd(), 'utils'));

      // set wrong function alias
      try {
        await getDFIC(process.cwd(), 'wrong');
      } catch (e) {
        expect(e.message).toBe('未找到指定函数，请检查后重试');
      }

      // set duplicated alias
      try {
        await getDFIC(process.cwd(), 'copy');
      } catch (e) {
        expect(e.message).toBe('发现同名函数，请通过 --target 指定要调用函数的目录');
      }

      // more than one scf proejects
      loadInstanceConfig.clear();
      writeYamlFile('tmp/serverless.yml', { component: 'scf', name: 'scf' });
      writeYamlFile('utils/serverless.yml', { component: 'scf', name: 'scf' });
      try {
        await getDFIC(process.cwd());
      } catch (e) {
        expect(e.message).toBe('目录中存在多个 SCF 组件，请使用 --target 指定目录或检查后再试');
      }

      fs.rmSync('tmp', { force: true, recursive: true });
      fs.unlinkSync('utils/serverless.yml');
    });
  });

  test('getTemplate', async () => {
    fs.mkdirSync('tmp1');
    fs.mkdirSync('tmp2');
    const t1 = {
      component: 'scf',
      name: 't1',
      org: 't1',
      app: 't1',
      stage: 't1',
    };
    const t2 = {
      component: 'scf',
      name: 't2',
      org: 't2',
      app: 't2',
      stage: 't2',
    };

    writeYamlFile('tmp1/serverless.yml', t1);
    writeYamlFile('tmp2/serverless.yml', t2);

    // throw error for different org field
    try {
      await utils.getTemplate(process.cwd());
    } catch (e) {
      expect(e.message).toBe('Template instances must use the same org, app & stage properties');
    }

    // throw error for different app field
    t1.org = 't';
    t2.org = 't';
    writeYamlFile('tmp1/serverless.yml', t1);
    writeYamlFile('tmp2/serverless.yml', t2);
    try {
      loadInstanceConfig.clear();
      await utils.getTemplate(process.cwd());
    } catch (e) {
      expect(e.message).toBe('Template instances must use the same org, app & stage properties');
    }

    // throw error for different stage field
    t1.app = 't';
    t2.app = 't';
    writeYamlFile('tmp1/serverless.yml', t1);
    writeYamlFile('tmp2/serverless.yml', t2);
    try {
      loadInstanceConfig.clear();
      await utils.getTemplate(process.cwd());
    } catch (e) {
      expect(e.message).toBe('Template instances must use the same org, app & stage properties');
    }

    t2.stage = 't1';
    writeYamlFile('tmp2/serverless.yml', t2);
    loadInstanceConfig.clear();
    expect(await utils.getTemplate(process.cwd())).toEqual({
      name: 'libs',
      org: 't',
      app: 't',
      stage: 't1',
      t2: {
        component: 'scf',
        inputs: {},
        name: 't2',
        org: 't',
        app: 't',
        stage: 't1',
      },

      t1: {
        component: 'scf',
        inputs: {},
        name: 't1',
        org: 't',
        app: 't',
        stage: 't1',
      },
    });

    fs.rmSync('tmp1', { force: true, recursive: true });
    fs.rmSync('tmp2', { force: true, recursive: true });
  });

  test('getInstanceDashboardurl', () => {
    // SSR component url
    expect(
      utils.getInstanceDashboardUrl({ component: 'koa', stage: 'dev', app: 'test', name: 'test' })
    ).toBe(
      'https://console.cloud.tencent.com/ssr/detail?stageName=dev&appName=test&instanceName=test&stageList=dev'
    );

    // non SSR url
    expect(
      utils.getInstanceDashboardUrl({ component: 'scf', stage: 'dev', app: 'test', name: 'ins' })
    ).toBe('https://serverless.cloud.tencent.com/apps/test/ins/dev');
  });

  test('getTemplateDashboardUrl', () => {
    expect(utils.getTemplateDashboardUrl({ app: 'test' })).toBe(
      '前往控制台查看应用详细信息: https://serverless.cloud.tencent.com/?q=test'
    );
  });

  test('handleDebugLogMessage', () => {
    console.log = jest.fn();
    const cli = {
      log: console.log,
    };
    const cb = utils.handleDebugLogMessage(cli);

    cb({ event: '1' });
    cb({ event: 'instance.run.logs', data: { logs: [{ data: 'test' }, { data: 'test2\n' }] } });

    expect(console.log.mock.calls[0][0]).toMatch('test');
    expect(console.log.mock.calls[1][0]).toMatch('test2');
    console.log.mockRestore();
  });

  test('saveandParseYaml', async () => {
    await utils.saveYaml('t.yml', { name: 'test' });
    expect(await utils.parseYaml('t.yml')).toEqual({ name: 'test' });

    await utils.saveYaml('t.yml', false);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
  restoreCwd();
});
