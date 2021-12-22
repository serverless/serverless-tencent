'use strict';

const path = require('path');
const fs = require('fs');
const cliUtils = require('../../../src/libs/utils');
const overrideCwd = require('process-utils/override-cwd');
const { version } = require('../../../package.json');
const { writeYamlFile } = require('../../testUtils');

let restoreCwd;
let generatePayload;

beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/libs/telemtry/')).restoreCwd;
  jest.spyOn(cliUtils, 'writeClientUid').mockImplementation(async () => ({
    value: 100,
  }));
  generatePayload = require('../../../src/libs/telemtry/generatePayload');
});

describe('generatePayload for telemtry', () => {
  test('non command', async () => {
    const innerGeneratePayload = require('../../../src/libs/telemtry/generatePayload');
    try {
      await innerGeneratePayload({});
    } catch (e) {
      expect(e.message).toBe('command is required for sending metrics analytics');
    }
  });

  test('generate a config without configs', async () => {
    const res = await generatePayload({
      command: 'deploy',
      rootConfig: {
        name: 'test',
        component: 'scf',
        inputs: {
          type: 'web',
          runtime: 'Nodejs12.16',
          region: 'ap-shanghai',
          events: [{ timer: { enable: true } }],
        },
      },
    });
    expect(res).toMatchObject({
      event: 'components.command.deploy',
      client_uid: 100,
      provider_name: 'tencent',
      outcome: 'success',
      components_cli_version: version,
      functions_count: 1,
      events_count: 1,
      events_type: ['timer'],
      components: ['scf'],
      provider_runtimes: ['Nodejs12.16'],
    });
  });

  test('generate a config with rootConfig and subConfigs', async () => {
    fs.mkdirSync('tmp1');
    fs.mkdirSync('tmp2');
    fs.mkdirSync('tmp3');

    writeYamlFile('tmp1/serverless.yml', {
      name: 'tmp1',
      component: 'koa',
      org: 123,
      app: 'test',
      inputs: {
        runtime: 'Nodejs.12.16',
        region: 'ap-beijing',
      },
    });
    writeYamlFile('tmp2/serverless.yml', {
      name: 'tmp2',
      component: 'multi-scf',
      org: 123,
      app: 'test',
      inputs: {
        runtime: 'Python3.6',
        region: 'ap-shanghai',
        type: 'web',
        triggers: [
          {
            type: 'cos',
            name: 'cos',
          },
        ],
        functions: {
          func1: {
            name: 'func1',
          },
          func2: {
            name: 'func2',
          },
        },
      },
    });
    writeYamlFile('tmp3/serverless.yml', {
      name: 'tmp3',
      component: 'scf',
      org: 123,
      app: 'test',
      inputs: {
        runtime: 'Nodejs14.10',
        region: 'ap-shanghai',
        type: 'web',
        events: [{ timer: { enable: true } }, { apigw: { environment: 'release' } }],
      },
    });

    const rootConfig = await cliUtils.getTemplate(process.cwd());
    const allComponents = await cliUtils.getAllComponents(rootConfig);
    const res = await generatePayload({
      userId: 123,
      command: 'deploy',
      rootConfig,
      configs: Object.values(allComponents),
    });
    expect(res).toMatchObject({
      event: 'components.command.deploy',
      client_uid: 100,
      provider_name: 'tencent',
      outcome: 'success',
      components_cli_version: version,
      provider_stage: 'dev',
      provider_region: 'ap-shanghai',
      functions_count: 3,
      events_count: 3,
      events_type: ['cos', 'timer', 'apigw'],
      components: ['koa', 'multi-scf', 'scf'],
      provider_runtimes: ['Nodejs.12.16', 'Python3.6', 'Nodejs14.10'],
    });

    fs.rmSync('tmp1', { force: true, recursive: true });
    fs.rmSync('tmp2', { force: true, recursive: true });
    fs.rmSync('tmp3', { force: true, recursive: true });
  });

  test('test ci detect', async () => {
    // Serverless_CI_CD
    process.env.SERVERLESS_CI_CD = true;
    expect(
      (
        await require('../../../src/libs/telemtry/generatePayload')({
          command: 'deploy',
        })
      ).ciName
    ).toBe('Serverless CI/CD');
    delete process.env.SERVERLESS_CI_CD;

    // Seed
    process.env.SEED_APP_NAME = true;
    expect(
      (
        await require('../../../src/libs/telemtry/generatePayload')({
          command: 'deploy',
        })
      ).ciName
    ).toBe('Seed');
    delete process.env.SEED_APP_NAME;

    if (process.env.GITHUB_ACTIONS) {
      // certain ci
      expect(
        (
          await require('../../../src/libs/telemtry/generatePayload')({
            command: 'deploy',
          })
        ).ciName
      ).toBe('GitHub Actions');
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
  restoreCwd();
});
