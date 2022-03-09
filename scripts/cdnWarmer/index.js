'use strict';
/**
 * Runs after publishing new version & every day regualrly
 * 1. Get latest version of binaries
 * 2. Warm them up
 *
 * Ref
 * - https://console.intl.cloud.tencent.com/api/explorer?Product=cdn&Version=2018-06-06&Action=PurgeUrlsCache&SignVersion=
 * - https://console.intl.cloud.tencent.com/api/explorer?Product=cdn&Version=2018-06-06&Action=PushUrlsCache&SignVersion=
 */
const tencentcloud = require('tencentcloud-sdk-nodejs');
const { version } = require('../../package.json');
const got = require('got');

console.log(`Going to warm up CDN for version ${version}`);

const CdnClient = tencentcloud.cdn.v20180606.Client;

const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: '',
  profile: {
    httpProfile: {
      endpoint: 'cdn.tencentcloudapi.com',
    },
  },
};

const client = new CdnClient(clientConfig);

// eslint-disable-next-line new-cap
client.PushUrlsCache({
    Urls: [
      `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-macos-x64`,
      `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-macos-armv6`,
      `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-linux`,
      `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-win-x64`,
    ],
    Area: 'global',
  })
  .then(
    (data) => {
      console.log(data);
      console.log(`${version} is warmed up successfully`);
    },
    (err) => {
      console.error('error', err);
      throw err;
    }
  );

// When the latest tag is outdated, we need to purge CDN cache
got('https://slt-binary-sv-1300963013.file.myqcloud.com/latest-tag')
  .then((res) => {
    const CDNVersion = res.body;
    if (CDNVersion.slice(1) !== version) {
      console.log('CLI version tag on CDN is old, going to purge it');
      // eslint-disable-next-line new-cap
      return client.PurgeUrlsCache({
        Urls: ['https://slt-binary-sv-1300963013.file.myqcloud.com/latest-tag'],
      });
    }
    console.log('CLI version tag is up to date, going to warm it');
    // eslint-disable-next-line new-cap
    return client.PushUrlsCache({
      Urls: ['https://slt-binary-sv-1300963013.file.myqcloud.com/latest-tag'],
      Area: 'global',
    });
  })
  .then(
    (data) => {
      console.log(data);
      console.log('CLI version tag is purged/warmed up successfully');
    },
    (err) => {
      console.error('error', err);
      throw err;
    }
  );
