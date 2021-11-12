'use strict';

const path = require('path');
const dotenv = require('dotenv');

const addArgvToProcess = (argvs) => {
  // clear the process.argv firstly
  process.argv = ['_', '_', ...argvs];
};

const addEnv = (envPath = '.env') => {
  dotenv.config({
    path: path.resolve(__dirname, `./${envPath}`),
  });
};

module.exports = {
  addArgvToProcess,
  addEnv,
};
