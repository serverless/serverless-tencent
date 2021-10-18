'use strict';

/*
 * serverless-tencnet: Command: INVOKE LOCAL
 */

const path = require('path');
const utils = require('../../../libs/utils');
const { colorLog, summaryOptions, checkRuntime } = require('./utils');
const runPython = require('./runPython');
const runPhp = require('./runPhp');
const runNode = require('./runNode');
const { generatePayload, storeLocally } = require('../../../libs/telemtry');

module.exports = async (config, cli, command, instanceDir) => {
  const { config: ymlFilePath, c } = config;

  let instanceYml = await utils.loadTencentInstanceConfig(instanceDir, command);
  const telemtryData = await generatePayload({
    command: 'invoke_local',
    rootConfig: instanceYml,
  });

  try {
    if (ymlFilePath || c) {
      const customizedConfigFile = ymlFilePath || c;

      if (!utils.fileExistsSync(path.join(instanceDir, customizedConfigFile))) {
        await storeLocally({
          ...telemtryData,
          outcome: 'failure',
          failure_reason: '指定的yml文件不存在',
        });
        throw new Error('指定的yml文件不存在');
      }
      instanceYml = utils.readAndParseSync(customizedConfigFile);
    }

    const { inputs = {}, component } = instanceYml;

    // Currently we only support local invoke for scf component
    if (!component.includes('scf')) {
      await storeLocally({
        ...telemtryData,
        outcome: 'failure',
        failure_reason: '当前命令只支持 SCF 组件，请在 SCF 组件目录内使用',
      });
      colorLog('当前命令只支持 SCF 组件，请在 SCF 组件目录内使用', 'yellow', cli);
    }

    try {
      const [eventData, contextData, handlerFile, handlerFunc] = summaryOptions(
        config,
        instanceYml,
        cli
      );

      const runtime = inputs.runtime;
      checkRuntime(runtime, cli);

      if (runtime.includes('Nodejs')) {
        await runNode(eventData, contextData, handlerFile, handlerFunc, cli);
      }

      if (runtime.includes('Python')) {
        await runPython(eventData, contextData, handlerFile, handlerFunc, cli);
      }

      if (runtime.includes('Php')) {
        await runPhp(eventData, contextData, handlerFile, handlerFunc, cli);
      }
    } catch (e) {
      await storeLocally({
        ...telemtryData,
        outcome: 'failure',
        failure_reason: e.message,
      });
      throw e;
    }

    await storeLocally({ ...telemtryData, outcome: 'success' });
  } catch (e) {
    await storeLocally({
      ...telemtryData,
      outcome: 'failure',
      failure_reason: e.message,
    });
    throw e;
  }
};
