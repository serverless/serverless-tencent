'use strict';

const os = require('os');

const USER_PERFERENCE_FILE = `${os.homedir}/.serverless-tencent/perference.json`;

module.exports = {
  USER_PERFERENCE_FILE,
};
