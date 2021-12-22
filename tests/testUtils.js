'use strict';

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const dotenv = require('dotenv');

const addArgvToProcess = (argvs = []) => {
  const originArgs = [...process.argv];
  // clear the process.argv firstly
  process.argv = ['_', '_', ...argvs];
  return () => (process.argv = [...originArgs]);
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

const writeFile = (fpath, content) => {
  fs.writeFileSync(fpath, content);
  return () => fs.unlinkSync(fpath);
};

module.exports = {
  addArgvToProcess,
  addEnv,
  readYamlFile,
  writeFile,
  writeYamlFile,
};
