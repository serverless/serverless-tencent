'use strict';

const path = require('path');

const { fileExistsSync, readAndParseSync } = require('./utils');
/**
 *
 * Checks if a filename ends with yaml or yml
 * @param {*} filename
 */
const isYaml = (filename) => {
  return (filename && filename.endsWith('yaml')) || (filename && filename.endsWith('yml'));
};

const getServerlessFilePath = (directoryPath) => {
  directoryPath = path.resolve(directoryPath);
  const ymlFilePath = path.join(directoryPath, 'serverless.yml');
  const yamlFilePath = path.join(directoryPath, 'serverless.yaml');
  const jsonFilePath = path.join(directoryPath, 'serverless.json');
  const jsFilePath = path.join(directoryPath, 'serverless.js');
  let filePath;

  // Check to see if exists and is yaml or json file
  if (fileExistsSync(ymlFilePath)) {
    filePath = ymlFilePath;
  }
  if (fileExistsSync(yamlFilePath)) {
    filePath = yamlFilePath;
  }
  if (fileExistsSync(jsonFilePath)) {
    filePath = jsonFilePath;
  }
  if (fileExistsSync(jsFilePath)) {
    filePath = jsFilePath;
  }
  if (!filePath) {
    return null;
  }
  return filePath;
};

/**
 * Reads and parses a serverless config file (serverless.yml) in any format (yml, yaml, json), in a given directory path
 * @param {*} directoryPath
 */
const loadServerlessFile = (directoryPath) => {
  let configFile;
  const filePath = getServerlessFilePath(directoryPath);

  // If no filePath, the serverless config file does not exist
  if (!filePath) {
    return null;
  }

  // Read file, if it's yaml/yml
  if (isYaml(filePath)) {
    try {
      configFile = readAndParseSync(filePath);
    } catch (e) /* istanbul ignore next */ {
      // todo currently our YAML parser does not support
      // CF schema (!Ref for example). So we silent that error
      // because the framework can deal with that
      if (e.name !== 'YAMLException') {
        throw e;
      }
    }
  } else {
    configFile = readAndParseSync(filePath);
  }

  return configFile;
};

module.exports = {
  loadServerlessFile,
  getServerlessFilePath,
};
