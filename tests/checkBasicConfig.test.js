'use strict';

const overrideCwd = require('process-utils/override-cwd');
const path = require('path');
const { checkBasicConfigValidation } = require('../src/libs/utils/utils');

let restoreCwd;
beforeAll(() => {
  restoreCwd = overrideCwd(path.join(process.cwd(), 'tests')).restoreCwd;
});

describe('Check basic fields from configuraton', () => {
  it('error: path does not exit', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    console.log = jest.fn();

    const wrongPath = path.join(process.cwd(), 'empty');
    try {
      await checkBasicConfigValidation(wrongPath);
    } catch (e) {}
    expect(console.log.mock.calls[0][0]).toMatch(`请检查后重试`);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
  restoreCwd();
});
