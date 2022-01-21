'use strict';

/*
 * serverless-tencent: Command: RUN
 */
const { version } = require('../../package.json');

module.exports = (config, cli) => {
  if (config.plain) {
    console.log(`${version}(${process.pkg ? 'Binary' : 'npm'})`);
    return;
  }
  cli.logVersion();
};
