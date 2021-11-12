'use strict';

const overrideCwd = require('process-utils/override-cwd');
const path = require('path');
const fs = require('fs');
const { writeYamlFile } = require('../testUtils');
const { checkBasicConfigValidation } = require('../../src/libs/utils');

let restoreCwd;
beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(__dirname)).restoreCwd;
});

describe('Check basic fields from configuraton', () => {
  test('error: path does not exit', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    console.log = jest.fn();

    const wrongPath = path.join(process.cwd(), 'empty');
    try {
      await checkBasicConfigValidation(wrongPath);
      // eslint-disable-next-line
    } catch (e) {}
    expect(console.log.mock.calls[0][0]).toMatch('请检查后重试');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('error: no config file in folder', async () => {
    const emptyPath = path.join(process.cwd());
    try {
      await checkBasicConfigValidation(emptyPath);
    } catch (e) {
      expect(e.message).toEqual('没有找到serverless配置文件，请检查。');
    }
  });

  test('error: config does not have name field', async () => {
    const content = {
      app: 'test',
    };
    const fpath = path.resolve(__dirname, 'serverless.yml');
    writeYamlFile(fpath, content);
    try {
      await checkBasicConfigValidation(path.resolve(__dirname), 2);
    } catch (e) {
      expect(e.message).toEqual('在serverless配置文件中没有发现实例名称("name"字段)，请检查。');
    }
    fs.unlinkSync(fpath);
  });

  test('error: config does not have component field', async () => {
    const content = {
      app: 'test',
      name: 'test',
    };
    const fpath = path.resolve(__dirname, '../serverless.yml');
    writeYamlFile(fpath, content);
    try {
      await checkBasicConfigValidation(path.resolve(__dirname, '..'), 3);
    } catch (e) {
      expect(e.message).toEqual(
        '在serverless配置文件中没有发现组件类型("component"字段)，请检查。'
      );
    }
    fs.unlinkSync(fpath);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  restoreCwd();
});
