'use strict';

const path = require('path');
const fs = require('fs');
const { utils: platformUtils } = require('@serverless/platform-client-china');
const overrideEnv = require('process-utils/override-env');
const overrideCwd = require('process-utils/override-cwd');
const utils = require('../../src/libs/utils/utils');
const { addArgvToProcess, writeYamlFile, writeFile } = require('../testUtils');

let restoreCwd;

beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests')).restoreCwd;
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

    await utils.login();
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
    fs.unlinkSync('serverless.yml');
    restoreArgv();
  });

  describe('Test getDirForInvokeCommand', () => {
    test('Return from alone scf folder', async () => {
      jest.spyOn(platformUtils, 'getOrgId').mockImplementation(() => 123);

      const filepath = path.resolve(process.cwd(), 'utils/serverless.yml');
      writeYamlFile(filepath, {
        component: 'scf',
        name: 'test',
      });

      const data = await utils.getDirForInvokeCommand(process.cwd());
      expect(data).toEqual(path.resolve('utils'));

      fs.unlinkSync(filepath);
    });

    test('Error with no executable folder', async () => {
      try {
        await utils.getDirForInvokeCommand(process.cwd());
      } catch (e) {
        expect(e.message).toEqual('没有找到可执行的函数目录，请使用 --target 指定或检查后再试');
      }
    });
  });
});

afterAll(() => {
  jest.restoreAllMocks();
  restoreCwd();
});
