'use strict';

const overrideStdoutWrite = require('process-utils/override-stdout-write');
const buildConfig = require('../../src/libs/config');
const CLI = require('../../src/libs/cli');
const { version } = require('../../package.json');
const { addEnv, addArgvToProcess } = require('../testUtils');

let cli;

beforeAll(() => {
  addEnv();
  addArgvToProcess(['deploy']);
  const config = buildConfig();
  cli = new CLI(config);
});

describe('Test CLI functions', () => {
  test('CLI instance build', () => {
    expect(cli instanceof CLI).toBeTruthy();
  });

  test('CLI log message', () => {
    expect(cli.log()).toBe(null);

    cli._.debug = false;
    expect(cli.log()).toBe(null);
    cli._.debug = true;

    cli.log({ msg: 'test' });
    let stdoutData = '';
    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => cli.log('log message', 'red')
    );

    expect(stdoutData).toEqual(expect.stringContaining('log message'));
  });

  test('CLI log error message', () => {
    expect(cli.logError('')).toBe(null);

    const err = new Error('A test error');
    err.extraErrorInfo = {
      step: '代码部署',
      source: 'Serverless::CLI',
      referral: 'test.com',
      code: 'api_error',
      requestId: 123,
      traceId: 456,
    };
    let stdoutData = '';

    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => cli.logError(err, { command: 'deploy' })
    );

    expect(stdoutData).toEqual(expect.stringContaining('参考信息:    test.com'));
    expect(stdoutData).toEqual(expect.stringContaining('代码部署失败'));
    expect(stdoutData).toEqual(expect.stringContaining('错误信息: A test error'));
    expect(stdoutData).toEqual(expect.stringContaining('ErrorCode:   api_error'));
    expect(stdoutData).toEqual(expect.stringContaining('RequestId:   123'));
  });

  test('CLI log type error message', () => {
    const typeErrors = {
      typeVersion: '0.0.1',
      component: 'scf',
      messages: [
        {
          message:
            '地区选择错误，https://cloud.tencent.com/document/api/583/17238#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8',
          level: 'error',
          path: 'inputs.region',
        },
      ],
    };

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    // we need to re-write console.log method to stdout.write, otherwise we can not get the output and judge it
    console.log = jest.fn();

    cli.logTypeError(typeErrors);
    expect(console.log.mock.calls[1][0]).toMatch('scf 组件校验结果: 错误 1 警告 0 规则版本 v0.0.1');
    expect(console.log.mock.calls[3][0]).toMatch('inputs.region');

    expect(mockExit).toHaveBeenCalledWith();
  });

  test('isSessionActive', () => {
    expect(cli.isSessionActive()).toBeFalsy();
  });

  test('sessionStatus', () => {
    cli.sessionStatus('test', 'tencent', 'red');
    expect(cli._.status).toBe('test');
    expect(cli._.entity).toBe('tencent');
  });

  test('logErrorStackTrace', () => {
    expect(cli.logErrorStackTrace()).toBe(null);

    cli._.debug = true;
    const err = new Error('stack error');
    console.log = jest.fn();
    expect(cli.logErrorStackTrace(err.stack)).toBe(null);
    expect(console.log.mock.calls[0][0]).toMatch('stack error');
    console.log.mockRestore();
  });

  test('logWarning', () => {
    console.log = jest.fn();
    process.exit = jest.fn();
    cli.logWarning(new Error('warning message'));

    expect(console.log.mock.calls[0][0]).toMatch('warning message');
    expect(process.exit).toHaveBeenCalledWith();

    console.log.mockRestore();
    process.exit.mockRestore();
  });

  test('debugMode', () => {
    expect(cli.debugMode()).toBeTruthy();
  });

  test('logVersion', () => {
    let stdoutData = '';

    process.env.SERVERLESS_PLATFORM_STAGE = 'dev';
    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => cli.logVersion()
    );

    delete process.env.SERVERLESS_PLATFORM_STAGE;
    expect(stdoutData).toEqual(expect.stringContaining(`tencent version: ${version}`));
  });

  test('logRegistryLogo', () => {
    let stdoutData = '';

    process.env.SERVERLESS_PLATFORM_STAGE = 'dev';
    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => cli.logRegistryLogo('registry')
    );

    delete process.env.SERVERLESS_PLATFORM_STAGE;
    expect(stdoutData).toEqual(expect.stringContaining('registry'));
  });

  test('logOutputs', () => {
    let stdoutData = '';

    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => cli.logOutputs('test outputs')
    );

    expect(stdoutData).toMatch('test outputs');
  });
});

afterAll(() => jest.restoreAllMocks());
