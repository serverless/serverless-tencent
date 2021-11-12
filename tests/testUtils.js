'use strict';

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
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

function readYamlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
}

function writeYamlFile(filePath, content) {
  const data = yaml.dump(content);
  fs.writeFileSync(filePath, data);
  return data;
}

module.exports = {
  addArgvToProcess,
  addEnv,
  readYamlFile,
  writeYamlFile,
};
