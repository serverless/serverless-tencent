'use strict';
/*
 * Test src/libs/config.js: To generate a config file from command arguments, env file and yaml file. Insert userful fileds to return an object for CLI generator.
 */

const path = require('path');
const fs = require('fs');
const { addArgvToProcess } = require('../testUtils');
const buildConfig = require('../../src/libs/config');
const overrideCwd = require('process-utils/override-cwd');
const overrideEnv = require('process-utils/override-env');

let restoreCwd;
let restoreEnv;
beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/libs/')).restoreCwd;
  restoreEnv = overrideEnv().restoreEnv;
});
describe('Generate config for command', () => {
  test('basic config', () => {
    addArgvToProcess(['deploy']);
    const config = buildConfig();
    expect(config).toMatchObject({
      command: 'deploy',
    });
  });

  test('config with extra option --stage', () => {
    const restoreArgv = addArgvToProcess([
      'invoke',
      'local',
      'test1',
      'test2',
      'test3',
      '--stage=test',
    ]);
    const config = buildConfig();
    expect(config).toMatchObject({
      command: 'invoke',
      stage: 'test',
    });

    restoreArgv();
  });

  describe('config load different .env files', () => {
    test('load stage env file', () => {
      const restoreArgv = addArgvToProcess(['deploy', '--stage=dev']);
      fs.writeFileSync('.env.dev', 'name=dev\nid=dev');
      buildConfig();
      expect(process.env.name).toBe('dev');
      expect(process.env.id).toBe('dev');

      fs.unlinkSync('.env.dev');
      restoreArgv();
    });

    test('insert default env values to process.env', () => {
      fs.writeFileSync('.env', 'test=test\nid=123');

      buildConfig();
      expect(process.env.test).toBe('test');
      expect(process.env.id).toBe('123');

      fs.unlinkSync('.env');
    });

    test('load parent env', () => {
      fs.writeFileSync('../.env', 'name=parent\nid=parent');
      buildConfig();

      expect(process.env.name).toBe('parent');
      expect(process.env.id).toBe('parent');
      fs.unlinkSync('../.env');
    });

    test('load parent stage env', () => {
      addArgvToProcess(['deploy', '--stage=dev']);
      fs.writeFileSync('../.env.dev', 'name=parentdev\nid=parentdev');
      buildConfig();

      expect(process.env.name).toBe('parentdev');
      expect(process.env.id).toBe('parentdev');
      fs.unlinkSync('../.env.dev');
    });

    test('load second parent env', () => {
      fs.writeFileSync('../../.env', 'name=secondparent\nid=secondparent');
      buildConfig();

      expect(process.env.name).toBe('secondparent');
      expect(process.env.id).toBe('secondparent');
      fs.unlinkSync('../../.env');
    });

    test('load second parent stage env', () => {
      addArgvToProcess(['deploy', '--stage=dev']);
      fs.writeFileSync('../../.env.dev', 'name=secondparentdev\nid=secondparentdev');
      buildConfig();

      expect(process.env.name).toBe('secondparentdev');
      expect(process.env.id).toBe('secondparentdev');
      fs.unlinkSync('../../.env.dev');
    });
  });

  test('set http proxy', () => {
    process.env.http_proxy = 'http://128.1.1:9988';
    buildConfig();
    const http = require('http');
    expect(http.globalAgent.proxy.href).toBe('http://128.1.1:9988/');
  });

  test('check inline comment for .env', () => {
    fs.writeFileSync('.env', 'name=test #inline comment');
    console.log = jest.fn();

    buildConfig();
    expect(console.log.mock.calls[0][0]).toMatch('不支持行内注释');

    fs.unlinkSync('.env');
  });

  test('publish command', () => {
    addArgvToProcess(['publish']);

    const config = buildConfig();
    expect(config.command).toBe('registry');
    expect(config.realCommand).toBe('publish');
    expect(config.params).toContain('publish');
  });

  test('unpublish command', () => {
    addArgvToProcess(['unpublish']);

    const config = buildConfig();
    expect(config.command).toBe('registry');
    expect(config.params).toContain('unpublish');
  });

  test('help command', () => {
    // --help
    addArgvToProcess(['deploy', '--help']);
    let config = buildConfig();
    expect(config.command).toBe('help');
    expect(config.originalCommand).toBe('deploy');

    // -h
    addArgvToProcess(['invoke', '-h']);
    config = buildConfig();

    expect(config.command).toBe('help');
    expect(config.originalCommand).toBe('invoke');
  });

  test('version command', () => {
    addArgvToProcess(['deploy', '-v']);

    expect(buildConfig().command).toBe('version');
  });
});

beforeEach(() => {
  process.env = {};
});

afterAll(() => {
  restoreEnv();
  restoreCwd();
});
