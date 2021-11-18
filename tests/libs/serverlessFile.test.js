'use strict';

const path = require('path');
const fs = require('fs');
const { loadServerlessFile } = require('../../src/libs/serverlessFile');
const overrideCwd = require('process-utils/override-cwd');
const { writeYamlFile, writeFile } = require('../testUtils.js');

let restoreCwd;

beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/libs/')).restoreCwd;
});

describe('src/libs/serverlessFile', () => {
  test('loadServerlessFile without config', () => {
    expect(loadServerlessFile(process.cwd())).toBeNull();
  });

  test('loadServerlessFile with a yml config', () => {
    writeYamlFile('serverless.yml', {
      name: 'test',
      component: 'scf',
    });

    expect(loadServerlessFile(process.cwd())).toEqual({
      name: 'test',
      component: 'scf',
    });
    fs.unlinkSync('serverless.yml');
  });

  test('loadServerlessFile with a yaml config', () => {
    writeYamlFile('serverless.yaml', {
      name: 'test',
      component: 'scf',
    });

    expect(loadServerlessFile(process.cwd())).toEqual({
      name: 'test',
      component: 'scf',
    });
    fs.unlinkSync('serverless.yaml');
  });

  test('loadServerlessFile with a json file', () => {
    const delFile = writeFile(
      'serverless.json',
      JSON.stringify({ name: 'test', component: 'koa' })
    );

    expect(loadServerlessFile(process.cwd())).toEqual({
      name: 'test',
      component: 'koa',
    });

    delFile();
  });
});

afterAll(() => {
  restoreCwd();
});
