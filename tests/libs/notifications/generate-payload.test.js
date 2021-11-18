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
      cliName: '@serverless/components',
      config: { component: 'scf' },
      versions: { '@serverless/components': version },
      isStandalone: false,
      isDashboardEnabled: false,
    });
  });

  test('alone component config', () => {
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
      cliName: '@serverless/components',
      config: { components: [{ component: 'scf' }, { component: 'koa' }] },
      versions: { '@serverless/components': version },
      isStandalone: false,
      isDashboardEnabled: false,
    });
  });
});
