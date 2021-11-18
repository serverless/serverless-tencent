'use strict';

const got = require('got');
const { storeLocally } = require('../../../src/libs/telemtry/index');

describe('Test telemtry utils', () => {
  test('storeLocally', async () => {
    expect(await storeLocally()).toBeNull();

    expect(await storeLocally({ event: 'mock' }, { message: 'error message' })).toBeUndefined();
  });

  test('send telemtry', async () => {
    const mock = jest.spyOn(got, 'post').mockImplementation(async () => 'mock');
    expect(await require('../../../src/libs/telemtry/index').send()).toBeNull();

    mock.mockRestore();
  });
});
