'use strict';
/**
 * Runs after publishing new version & every day regualrly
 * 1. Get latest version of binaries
 * 2. Warm them up
 */
const tencentcloud = require('tencentcloud-sdk-nodejs');
const { version } = require('../../package.json');

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
const params = {
  Urls: [
    'https://slt-binary-sv-1300963013.file.myqcloud.com/latest-tag',
    `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-macos-x64`,
    `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-macos-armv6`,
    `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-linux`,
    `https://slt-binary-sv-1300963013.file.myqcloud.com/${version}/serverless-tencent-win-x64`,
  ],
};

// eslint-disable-next-line new-cap
client.PushUrlsCache(params).then(
  (data) => {
    console.log(data);
    console.log(`${version} is warmed up successfully`);
  },
  (err) => {
    console.error('error', err);
    throw err;
  }
);
