'use strict';
const versionCmd = require('../../src/commands/version');
const overrideStdoutWrite = require('process-utils/override-stdout-write');
const { version } = require('../../package.json');
const CLI = require('../../src/libs/cli');

describe('Test sls version command: src/commands/version', () => {
  beforeAll(() => {
    console.log = jest.fn();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('output plain version', () => {
    versionCmd({ plain: true }, {});
    expect(console.log.mock.calls[0][0]).toBe(version);
  });
  test('output more content version', () => {
    const cli = new CLI({});

    let stdoutData = '';
    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => versionCmd({}, cli)
    );
    expect(stdoutData).toMatch(
      `serverless - tencent version: ${version}(${process.pkg ? 'Binary' : 'npm'})`
    );
  });
});
