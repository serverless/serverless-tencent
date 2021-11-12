'use strict';

const overrideStdoutWrite = require('process-utils/override-stdout-write');
const buildConfig = require('../src/libs/config');
const CLI = require('../src/libs/cli');
const { addEnv, addArgvToProcess } = require('./testUtils');

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
    let stdoutData = '';
    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => cli.log('log message')
    );

    expect(stdoutData).toEqual(expect.stringContaining('log message'));
  });

  test('CLI log error message', () => {
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
      () => cli.logError(err)
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

    let stdoutData = '';

    // mock the process.exit for test
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    // we need to re-write console.log method to stdout.write, otherwise we can not get the output and judge it
    const originLog = console.log;
    console.log = (msg) => {
      process.stdout.write(msg);
    };
    overrideStdoutWrite(
      (data) => (stdoutData += data),
      () => cli.logTypeError(typeErrors)
    );
    expect(stdoutData).toEqual(
      expect.stringContaining('scf 组件校验结果: 错误 1 警告 0 规则版本 v0.0.1')
    );
    expect(stdoutData).toEqual(expect.stringContaining('inputs.region'));

    expect(mockExit).toHaveBeenCalledWith();
    console.log = originLog;
  });
});

afterAll(() => jest.restoreAllMocks());
