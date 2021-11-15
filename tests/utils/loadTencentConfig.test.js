'use strict';

const overrideCwd = require('process-utils/override-cwd');
const { utils: chinaUtils } = require('@serverless/platform-client-china');
const path = require('path');
const fs = require('fs');
const { loadTencentInstanceConfig } = require('../../src/libs/utils/utils');

const { writeYamlFile } = require('../testUtils');

let restoreCwd;
beforeAll(() => {
  restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests')).restoreCwd;
  writeYamlFile(path.resolve(process.cwd(), 'serverless.yml'), {
    component: 'scf',
    name: 'test',
  });
});

describe('Load project config file to json data', () => {
  test('xxx', async () => {
    const mock = jest.spyOn(chinaUtils, 'getOrgId');
    mock.mockImplementation(() => 5);
    expect(await loadTencentInstanceConfig(process.cwd())).toEqual({
      app: 'test',
      component: 'scf',
      inputs: {},
      name: 'test',
      org: 5,
      stage: 'dev',
    });

    mock.mockRestore();
  });
});

afterAll(() => {
  fs.unlinkSync(path.resolve(process.cwd(), 'serverless.yml'));
  restoreCwd();
});
