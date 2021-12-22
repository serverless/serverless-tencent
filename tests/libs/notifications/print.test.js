'use strict';

const printNotify = require('../../../src/libs/notifications/print-notification');

test('printNotification', () => {
  console.log = jest.fn();
  const cli = {
    log: console.log,
  };
  process.env.SLS_NOTIFICATIONS_MODE = '2';
  printNotify(cli, [
    {
      code: 'COMPONENTS_QUESTIONNAIRE',
      message: '邀请您填写调查问卷: https://www.surveymonkey.com/r/slcusage',
      visibilityInterval: 0,
    },
  ]);

  expect(console.log.mock.calls[0][0]).toMatch('邀请您填写调查问卷');
  console.log.mockRestore();
});
