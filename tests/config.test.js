'use strict';
/*
 * Test src/libs/config.js: To generate a config file from command arguments, env file and yaml file. Insert userful fileds to return an object for CLI generator.
 */

const path = require('path');
const { addArgvToProcess } = require('./testUtils');
const buildConfig = require('../src/libs/config');

describe('Generate config for command', () => {
  test('basic config', () => {
    addArgvToProcess(['deploy']);
    const config = buildConfig();
    expect(config).toMatchObject({
      command: 'deploy',
    });
  });

  test('config with extra option --stage', () => {
    addArgvToProcess(['deploy', '--stage=test']);
    const config = buildConfig();
    expect(config).toMatchObject({
      command: 'deploy',
      stage: 'test',
    });
  });

  test('insert .env values to process.env', () => {
    // change dir to tests for helping config function to find .env file
    process.chdir(path.join(process.cwd(), 'tests'));
    buildConfig();
    expect(process.env.test).toBe('test');
    expect(process.env.id).toBe('123');
  });
});
