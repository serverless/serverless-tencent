'use strict';

const { version } = require('../../../package.json');

module.exports = (serviceConfig) => {
  const config = {};

  if (serviceConfig.component) {
    config.component = serviceConfig.component;
  } else {
    config.components = [];
    for (const componentConfig of Object.values(serviceConfig)) {
      if (componentConfig.component) {
        config.components.push({ component: componentConfig.component });
      }
    }
  }
  return {
    cliName: '@serverless/serverless-tencent',
    config,
    versions: {
      '@serverless/serverless-tencent': version,
    },
    isStandalone: Boolean(process.pkg),
    isDashboardEnabled: Boolean(serviceConfig.org),
  };
};
