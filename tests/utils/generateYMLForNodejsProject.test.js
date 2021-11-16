'use strict';

const path = require('path');
const fs = require('fs');
const overrideCwd = require('process-utils/override-cwd');
const inquirer = require('@serverless/utils/inquirer');

const { generateYMLForNodejsProject, fileExistsSync } = require('../../src/libs/utils');

const cli = {
  log: () => {},
};

const packageContent = {
  dependencies: {
    egg: '1.0.0',
  },
};

let restoreCwd;
beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(__dirname)).restoreCwd;
});

afterEach(() => fs.unlinkSync('package.json'));

describe('Test CLI generate yaml config for a nodejs project', () => {
  test('generate an simple framwork project yaml for egg, next, nuxt', async () => {
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    const eggResult = await generateYMLForNodejsProject(cli);
    expect(eggResult).toEqual(
      `
component: http
name: eggDemo

inputs:
  src:
    dist: ./
    exclude:
      - .env
  faas:
    runtime: Nodejs12.16
    framework: egg
    name: $\{name\}
  apigw:
    protocols:
      - http
      - https`
    );

    // test for next.js
    packageContent.dependencies = { next: '1.1.1' };
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    const nextResult = await generateYMLForNodejsProject(cli);

    expect(nextResult).toEqual(
      `
component: http
name: nextDemo

inputs:
  src:
    dist: ./
    hook: npm run build
    exclude:
      - .env
  faas:
    runtime: Nodejs12.16
    framework: nextjs
    name: $\{name\}
  apigw:
    protocols:
      - http
      - https
`
    );

    // test for nuxt.js
    packageContent.dependencies = { nuxt: '1.1.1' };
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    const nuxtResult = await generateYMLForNodejsProject(cli);
    expect(nuxtResult).toEqual(
      `
component: http
name: nuxtDemo

inputs:
  src:
    dist: ./
    hook: npm run build
    exclude:
      - .env
  faas:
    runtime: Nodejs12.16
    framework: nuxtjs
    name: $\{name\}
  apigw:
    protocols:
      - http
      - https`
    );
  });

  test('generate project with multiple dependencies', async () => {
    packageContent.dependencies = {
      koa: '1.0.0',
      egg: '1.0.0',
    };

    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    const mock = jest.spyOn(inquirer, 'prompt').mockImplementation((obj) =>
      Promise.resolve({
        ymlType: 'egg',
      })
    );

    const result = await generateYMLForNodejsProject(cli);
    expect(result).toEqual(
      `
component: http
name: eggDemo

inputs:
  src:
    dist: ./
    exclude:
      - .env
  faas:
    runtime: Nodejs12.16
    framework: egg
    name: $\{name\}
  apigw:
    protocols:
      - http
      - https`
    );
    mock.mockRestore();
  });

  test('generate project for express and koa with entryFile', async () => {
    // mock express framework
    packageContent.dependencies = { express: '1.0.1' };
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    const mock = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async () => ({ entryFile: 'express.js' }));

    // test for wrong entryFile condition
    try {
      await generateYMLForNodejsProject(cli);
    } catch (e) {
      expect(e.message).toBe('未找到入口文件，请重试');
    }

    fs.writeFileSync('express.js', '');
    const expressResult = await generateYMLForNodejsProject(cli);
    expect(expressResult).toEqual(
      `
component: http
name: expressDemo

inputs:
  src:
    src: ./
    exclude:
      - .env
  faas:
    runtme: Nodejs12.16
    name: $\{name\}
    framework: express
  apigw:
    protocols:
      - http
      - https
`
    );

    // mock koa framework
    packageContent.dependencies = { koa: '1.0.1' };
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    mock.mockImplementation(async () => ({ entryFile: 'koa.js' }));
    fs.writeFileSync('koa.js', '');
    const koaResult = await generateYMLForNodejsProject(cli);

    expect(koaResult).toEqual(
      `
component: http
name: koaDemo

inputs:
  src:
    src: ./
    exclude:
      - .env
  faas:
    runtme: Nodejs12.16
    name: $\{name\}
    framework: koa
  apigw:
    ignoreUpdate: true
    protocols:
      - http
      - https`
    );
    // clear work
    fs.unlinkSync('express.js');
    fs.unlinkSync('koa.js');
    mock.mockRestore();
  });

  test('generate with error without dependencies field', async () => {
    packageContent.dependencies = null;
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    try {
      await generateYMLForNodejsProject(cli);
    } catch (e) {
      expect(e.message).toMatch('当前目录未检测到 Serverless 配置文件');
    }
  });

  test('generate with error for non-known dependencies', async () => {
    packageContent.dependencies = { test: '1.0.1' };
    fs.writeFileSync('package.json', JSON.stringify(packageContent));

    try {
      await generateYMLForNodejsProject(cli);
    } catch (e) {
      expect(e.message).toMatch('当前目录未检测到 Serverless 配置文件');
    }
  });
});

afterAll(() => {
  restoreCwd();
});
