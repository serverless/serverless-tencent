'use strict';

/*
 * serverless-tencent: Command: RUN
 */
const { version } = require('../../package.json');

module.exports = (config, cli) => {
  if (config.plain) {
    console.log(version);
    return;
  }
  cli.logVersion();
};
