'use strict';

const generate = require('../../../src/libs/notifications/generate-payload');
const { version } = require('../../../package.json');

describe('generate notify payload', () => {
  test('alone component config', () => {
    expect(
      generate({
        component: 'scf',
      })
    ).toEqual({
      cliName: '@serverless/serverless-tencent',
      config: { component: 'scf' },
      versions: { '@serverless/serverless-tencent': version },
      isStandalone: false,
      isDashboardEnabled: false,
    });
  });

  test('multiple component configs', () => {
    expect(
      generate({
        scf: {
          component: 'scf',
        },
        koa: {
          component: 'koa',
        },
      })
    ).toEqual({
      cliName: '@serverless/serverless-tencent',
      config: { components: [{ component: 'scf' }, { component: 'koa' }] },
      versions: { '@serverless/serverless-tencent': version },
      isStandalone: false,
      isDashboardEnabled: false,
    });
  });
});
