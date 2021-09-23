'use strict';

const config = require('./config');
const Cli = require('./cli');
const functions = require('./libs');
const { loadTencentGlobalConfig } = require('./utils');

const commandList = [
  'init',
  'remove',
  'dev',
  'deploy',
  'info',
  'logs',
  'registry',
  'publish',
  'help',
  'version',
  'auto', // interatively init a project command
  'custom',
];

class ServerlessTencentPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.config = config();
    this.cli = new Cli(this.config);

    loadTencentGlobalConfig(this.cli, this.config);

    this.commands = commandList.reduce(
      (value, curr) => ({
        [curr]: {
          lifecycleEvents: ['exec'],
        },
        ...value,
      }),
      {
        invoke: {
          lifecycleEvents: ['exec'],
          commands: {
            local: {
              lifecycleEvents: ['exec'],
            },
          },
        },

        credentials: {
          commands: {
            set: {
              lifecycleEvents: ['exec'],
            },
            list: {
              lifecycleEvents: ['exec'],
            },
            remove: {
              lifecycleEvents: ['exec'],
            },
          },
        },
      }
    );

    this.hooks = commandList.reduce(
      (value, curr) => ({
        [`${curr}:exec`]: async () => await functions(this.config, this.cli),
        ...value,
      }),
      {
        'version:exec': () => {
          this.cli.logVersion();
        },
        'invoke:exec': async () => await functions(this.config, this.cli),
        'invoke:local:exec': async () => await functions(this.config, this.cli),
        'credentials:set:exec': async () => await functions(this.config, this.cli),
        'credentials:list:exec': async () => await functions(this.config, this.cli),
        'credentials:remove:exec': async () => await functions(this.config, this.cli),
      }
    );
  }
}

module.exports = ServerlessTencentPlugin;
