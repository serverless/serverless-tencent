'use strict';

const path = require('node:path');
const overrideCwd = require('process-utils/override-cwd');
const utils = require('../../src/libs/utils');
const registryCmd = require('../../src/commands/registry');

jest.mock('@serverless/platform-client-china', () => {
  return {
    ServerlessSDK: class {
      async listPackages() {
        return {
          templates: [
            {
              'name': 'scf',
              'description-i18n': {
                'zh-cn': '中文描述',
              },
            },
            {
              name: 'website',
              description: 'test description',
            },
            {
              name: 'http',
            },
          ],
        };
      }
      async publishPackage() {
        if (process.env.error) {
          throw new Error('publish error');
        }
        return {
          version: '0.0.0-dev',
          name: 'test',
          type: process.env.template ? 'template' : 'component',
        };
      }
      async getPackage() {
        if (process.env.notFound) {
          return {};
        }
        return {
          versions: ['0.0.1', '0.0.0-dev'],
          type: 'component',
          description: 'publish a component',
          author: 'test',
          repo: 'test',
        };
      }
    },
  };
});
describe('Test registry: src/commands/registry', () => {
  let restoreCwd;
  const cli = {
    log: jest.fn(),
    logRegistryLogo: () => {},
    sessionStart: () => {},
    sessionStop: () => {},
    sessionStatus: () => {},
    error: jest.fn(),
  };

  beforeAll(() => {
    restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/commands')).restoreCwd;
    jest.spyOn(utils, 'login').mockImplementation(async () => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
    restoreCwd();
  });

  test('List all registed components', async () => {
    await registryCmd({ params: [] }, cli);
    expect(cli.log.mock.calls[1][0]).toMatch('安装组件或者模版');
    expect(cli.log.mock.calls[3][0]).toMatch('中文描述');
    expect(cli.log.mock.calls[4][0]).toMatch('test description');
  });

  describe('Registry publish', () => {
    test('Publish without config file', async () => {
      const tmpRestoreCwd = overrideCwd(
        path.resolve(process.cwd(), 'materials/registry')
      ).restoreCwd;
      try {
        await registryCmd({ params: ['publish'] }, cli);
      } catch (e) {
        expect(e.message).toBe(
          '发布失败。当前工作目录没有包含 "serverless.template.yml" 或者 "serverless.component.yml"'
        );
      }

      tmpRestoreCwd();
    });

    test('Publish a component', async () => {
      const tmpRestoreCwd = overrideCwd(
        path.resolve(process.cwd(), 'materials/registry/publish_component')
      ).restoreCwd;
      await registryCmd({ params: ['publish'] }, cli);

      tmpRestoreCwd();
    });

    test('Publish a template', async () => {
      const tmpRestoreCwd = overrideCwd(
        path.resolve(process.cwd(), 'materials/registry/publish_template')
      ).restoreCwd;
      process.env.template = true;
      await registryCmd({ params: ['publish'] }, cli);

      tmpRestoreCwd();
      delete process.env.template;
    });

    test('Publish with service error', async () => {
      const tmpRestoreCwd = overrideCwd(
        path.resolve(process.cwd(), 'materials/registry/publish_component')
      ).restoreCwd;
      process.env.error = true;
      try {
        await registryCmd({ params: ['publish'] }, cli);
      } catch (e) {
        expect(e.message).toBe('publish error');
      }

      delete process.env.error;
      tmpRestoreCwd();
    });
  });

  test('Registry get a specific package', async () => {
    process.env.notFound = true;
    try {
      await registryCmd({ params: ['scf-notfound'] }, cli);
    } catch (e) {
      expect(e.message).toBe('所查询的包 "scf-notfound" 不存在.');
    }

    delete process.env.notFound;

    await registryCmd({ params: ['scf'] }, cli);
    expect(cli.log.mock.calls[10][0]).toMatch('Component: scf');
    expect(cli.log.mock.calls[14][0]).toBe('代码地址: test');
  });
});
