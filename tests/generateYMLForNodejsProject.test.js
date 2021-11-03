'use strict';

const path = require('path');
const fs = require('fs');
const overrideCwd = require('process-utils/override-cwd');

const { generateYMLForNodejsProject } = require('../src/libs/utils/utils');

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
  restoreCwd = overrideCwd(path.join(process.cwd(), 'tests')).restoreCwd;
});

afterEach(() => fs.unlinkSync('package.json'));

describe('Test CLI generate yaml config for a nodejs project', () => {
  it('generate an egg porject yaml', async () => {
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    const result = await generateYMLForNodejsProject(cli);
    expect(result).toEqual(
      `component: egg
name: eggjsDemo
app: appDemo

inputs:
  src: ./
  region: ap-guangzhou
  runtime: Nodejs10.15
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
`
    );
  });

  it('generate with error for empty dependencies', async () => {
    packageContent.dependencies = {};
    fs.writeFileSync('package.json', JSON.stringify(packageContent));
    try {
      await generateYMLForNodejsProject(cli);
    } catch (e) {
      expect(e.message).toMatch('当前目录未检测到 Serverless 配置文件');
    }
  });
});

afterAll(() => restoreCwd());
