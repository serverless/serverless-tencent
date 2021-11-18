'use strict';

const path = require('path');
const fs = require('fs');
const { Graph } = require('graphlib');
const overrideCwd = require('process-utils/override-cwd');

const { writeFile, writeYamlFile, addArgvToProcess } = require('../../testUtils');
const basicUtils = require('../../../src//libs/utils/basic');

let restoreCwd;

beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/libs/utils/')).restoreCwd;
});

describe('Test basic utils in src/libs/utils/basic.js', () => {
  describe('readAndSync', () => {
    test('file does not exist', () => {
      try {
        basicUtils.readAndParseSync('test.yml');
      } catch (e) {
        expect(e.message).toMatch('File does not exist at this path');
      }
    });

    test('read json file', () => {
      const fpath = path.resolve(process.cwd(), 't.json');
      const delFile = writeFile(
        fpath,
        `
        {
          "name": "test"
        }
      `
      );

      expect(basicUtils.readAndParseSync(fpath)).toEqual({ name: 'test' });
      delFile();
    });

    test('read slsignore file', () => {
      const fpath = 'test.slsignore';
      const delFile = writeFile(fpath, 'name:1\nage:2');
      basicUtils.readAndParseSync(fpath);
      delFile();
    });

    test('read other kind of file', () => {
      const fpath = 'test.txt';
      const delFile = writeFile(fpath, 'name:1\nage:2');
      basicUtils.readAndParseSync(fpath);
      delFile();
    });
  });

  test('resolveVarables', () => {
    process.env.test = 'resolvedValue';
    const result = basicUtils.resolveVariables({
      name: '${env:test}',
    });
    expect(result).toEqual({ name: 'resolvedValue' });

    delete process.env.test;
  });

  describe('load component config', () => {
    test('load yml config', () => {
      const fpath = 'serverless.component.yml';
      writeYamlFile(fpath, 'name: test\napp: test');
      const result = basicUtils.loadComponentConfig(process.cwd());
      expect(result).toEqual(
        `name: test
app: test`
      );
      fs.unlinkSync(fpath);
    });

    test('load yaml config', () => {
      const fpath = 'serverless.component.yaml';
      writeYamlFile(fpath, 'name: test\napp: test');
      const result = basicUtils.loadComponentConfig(process.cwd());
      expect(result).toEqual(
        `name: test
app: test`
      );
      fs.unlinkSync(fpath);
    });

    test('load json config', () => {
      const fpath = 'serverless.component.json';
      const delFile = writeFile(fpath, JSON.stringify({ name: 'test', app: 'test' }));
      const result = basicUtils.loadComponentConfig(process.cwd());
      expect(result).toEqual({
        name: 'test',
        app: 'test',
      });
      delFile();
    });

    test('non exist config', () => {
      expect(basicUtils.loadComponentConfig(process.cwd())).toBeNull();
    });

    test('read a wrong yaml file', () => {
      const fpath = 'serverless.component.yaml';
      writeYamlFile(fpath, 'name: test\napp:');
      expect(basicUtils.loadComponentConfig(process.cwd())).toEqual(
        `name: test
app:`
      );
      fs.unlinkSync(fpath);
    });
  });

  describe('load template config', () => {
    test('load yml config', () => {
      const fpath = 'serverless.template.yml';
      writeYamlFile(fpath, 'name: test\napp: test');
      const result = basicUtils.loadTemplateConfig(process.cwd());
      expect(result).toEqual(
        `name: test
app: test`
      );
      fs.unlinkSync(fpath);
    });

    test('load yaml config', () => {
      const fpath = 'serverless.template.yaml';
      writeYamlFile(fpath, 'name: test\napp: test');
      const result = basicUtils.loadTemplateConfig(process.cwd());
      expect(result).toEqual(
        `name: test
app: test`
      );
      fs.unlinkSync(fpath);
    });

    test('load json config', () => {
      const fpath = 'serverless.template.json';
      const delFile = writeFile(fpath, JSON.stringify({ name: 'test', app: 'test' }));
      const result = basicUtils.loadTemplateConfig(process.cwd());
      expect(result).toEqual({
        name: 'test',
        app: 'test',
      });
      delFile();
    });

    test('non exist config', () => {
      expect(basicUtils.loadTemplateConfig(process.cwd())).toBeNull();
    });

    test('read a wrong yaml file', () => {
      const fpath = 'serverless.template.yaml';
      writeYamlFile(fpath, 'name: test\napp:');
      expect(basicUtils.loadTemplateConfig(process.cwd())).toEqual(
        `name: test
app:`
      );
      fs.unlinkSync(fpath);
    });
  });

  test('loadInstanceConfigUncached', () => {
    const delYamlFile = writeFile('serverless.yaml', 'name: test');
    const delJsonFile = writeFile('serverless.json', JSON.stringify({ name: 'test', app: 'json' }));
    const delParentFile = writeFile('../serverless.yml', 'app: test\nstage: test\norg: test');
    const result = basicUtils.loadInstanceConfigUncached(process.cwd());
    expect(result).toEqual({
      name: 'test',
      stage: 'test',
      org: 'test',
      app: 'test',
    });
    delYamlFile();
    delJsonFile();
    delParentFile();
  });

  test('isProjectPath', async () => {
    expect(await basicUtils.isProjectPath(process.cwd())).toBe(false);
    const delFile = writeFile('serverless.yml', '');

    expect(await basicUtils.isProjectPath(process.cwd())).toBe(true);
    delFile();
  });

  describe('checkTemplateAppAndStage', () => {
    const checkTemplateAppAndStage = basicUtils.checkTemplateAppAndStage;

    test('deployable path', () => {
      const delFile = writeFile('serverless.yml', 'component: scf');

      expect(checkTemplateAppAndStage(process.cwd())).toBe(false);
      delFile();
    });

    test('check template project', () => {
      fs.mkdirSync('temp1');
      writeYamlFile('temp1/serverless.yml', { app: 'test' });
      fs.mkdirSync('temp2');
      writeYamlFile('temp2/serverless.yml', { app: 'test' });

      // valid template project
      expect(checkTemplateAppAndStage(process.cwd())).toBe(true);

      // invalid template project
      fs.mkdirSync('temp3');
      writeYamlFile('temp3/serverless.yml', { app: 'test1', name: 'test' });
      expect(checkTemplateAppAndStage(process.cwd())).toBe(false);

      fs.rmSync('temp1', { recursive: true, force: true });
      fs.rmSync('temp2', { recursive: true, force: true });
      fs.rmSync('temp3', { recursive: true, force: true });
    });
  });

  describe('runningTemplate', () => {
    const runningTemplate = basicUtils.runningTemplate;

    test('deployable path', () => {
      const delFile = writeFile('serverless.yml', 'component: scf');

      expect(runningTemplate(process.cwd())).toBe(false);
      delFile();
    });

    test('check template project', () => {
      fs.mkdirSync('temp4');
      writeYamlFile('temp4/serverless.yml', { app: 'test', component: 'scf' });
      fs.mkdirSync('temp5');
      writeYamlFile('temp5/serverless.yml', { app: 'test', component: 'koa' });

      // valid template project
      expect(runningTemplate(process.cwd())).toBe(true);

      // invalid template project
      fs.mkdirSync('temp6');
      writeYamlFile('temp6/serverless.yml', { app: 'test1', name: 'test' });
      expect(runningTemplate(process.cwd())).toBe(false);

      fs.rmSync('temp4', { recursive: true, force: true });
      fs.rmSync('temp5', { recursive: true, force: true });
      fs.rmSync('temp6', { recursive: true, force: true });
    });
  });

  test('getOutputs', () => {
    expect(
      basicUtils.getOutputs({
        test: {
          outputs: 'test',
        },
      })
    ).toEqual({
      test: 'test',
    });
  });

  test('validateGraph', () => {
    const g = new Graph();
    g.setNode('a');
    g.setNode('b');
    g.setEdge('a', 'b');
    g.setEdge('b', 'a');
    expect(() => basicUtils.validateGraph(g)).toThrow();
  });

  test('getAllComponents', () => {
    expect(
      basicUtils.getAllComponents({
        app: 'parent',
        stage: 'parent',
        test1: {
          component: 'scf',
        },
        test2: {
          component: 'koa',
          inputs: {
            src: './',
          },
        },
      })
    ).toEqual({
      test1: {
        app: 'parent',
        name: 'test1',
        stage: 'parent',
        component: 'scf',
        org: undefined,
        inputs: {},
      },
      test2: {
        app: 'parent',
        name: 'test2',
        stage: 'parent',
        component: 'koa',
        org: undefined,
        inputs: {
          src: './',
        },
      },
    });
  });

  test('isChinaUser', () => {
    const isChinaUser = basicUtils.isChinaUser;

    process.env.SERVERLESS_PLATFORM_VENDOR = 'tencent';
    expect(isChinaUser()).toBe(true);

    process.env.SERVERLESS_PLATFORM_VENDOR = 'aws';
    expect(isChinaUser()).toBe(false);
  });

  test('isJson', () => {
    expect(basicUtils.isJson('test')).toBe(false);
    expect(basicUtils.isJson(JSON.stringify({ name: 'test' }))).toBe(true);
  });

  test('parseCliInputs', () => {
    const restoreArgv = addArgvToProcess([
      'invoke',
      '--inputs',
      'name=test',
      'age=1,2',
      'env={"lang": "en"}',
    ]);
    expect(basicUtils.parseCliInputs()).toEqual({
      age: [1, 2],
      env: { lang: 'en' },
      name: 'test',
    });

    restoreArgv();
  });

  test('writeJsonToCredentials', () => {
    try {
      basicUtils.writeJsonToCredentials();
    } catch (e) {
      expect(e.message).toBe('Missing required credentials path field');
    }
    basicUtils.writeJsonToCredentials('test_credentials', {
      default: {
        id: 123,
        key: 'test',
      },
    });

    expect(basicUtils.loadCredentialsToJson('test_credentials')).toEqual({
      default: {
        id: '123',
        key: 'test',
      },
    });

    fs.unlinkSync('test_credentials');
  });
});

afterAll(() => {
  restoreCwd();
});
