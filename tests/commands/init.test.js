'use strict';

const overrideCwd = require('process-utils/override-cwd');
const path = require('path');
const fse = require('fs-extra');
const { init: initCmd, initTemplateFromCli } = require('../../src/commands/init');
const got = require('got');
const { readYamlFile } = require('../testUtils');

jest.mock('../../src/libs/telemtry', () => {
  return {
    storeLocally: async () => {},
    send: async () => {},
    generatePayload: async () => ({ components: [] }),
  };
});

jest.mock('@serverless/platform-client-china', () => {
  return {
    ServerlessSDK: class {
      async getPackage() {
        if (process.env.notFound) {
          return null;
        }
        if (process.env.isEmpty) {
          return {};
        }
        if (process.env.isTemplate) {
          return {
            type: 'template',
            downloadKey: 'scf-starter.zip',
            downloadUrl: new URL(`file://${process.cwd()}/materials/scf-starter.zip`),
          };
        }
        return {
          type: 'component',
        };
      }
    },
  };
});

describe('sls init command: src/commands/init', () => {
  let restoreCwd;
  const cli = {
    logLogo: () => {},
    sessionStatus: () => {},
    logOutputs: (msg) => console.log(msg),
    sessionStop: () => {},
    sessionStart: () => {},
    logTypeError: () => {},
  };

  beforeAll(() => {
    cli.log = jest.fn();
    restoreCwd = overrideCwd(path.resolve(process.cwd(), 'tests/commands')).restoreCwd;
    jest.spyOn(got, 'stream').mockImplementation((url) => fse.createReadStream(url));
  });

  test('sls init with name error', async () => {
    try {
      await initCmd({}, cli);
    } catch (e) {
      expect(e.message).toBe(
        '请指定 component 或 template 名称，如: "serverless init scf-starter"'
      );
    }
  });

  test('sls init notFound', async () => {
    process.env.notFound = true;
    try {
      await initCmd({ t: 'notFound' }, cli);
    } catch (e) {
      expect(e.message).toBe('查询的包 "notFound" 不存在.');
    }
    delete process.env.notFound;
  });

  test('sls init component project', async () => {
    await initCmd({ params: ['scf'] }, cli);
    const content = readYamlFile('./scf/serverless.yml');
    expect(content.component).toBe('scf');
    expect(content.name).toBe('scf');

    await fse.remove('./scf');
  });

  test('sls init template project', async () => {
    process.env.isTemplate = true;
    await initCmd({ params: ['scf-starter'] }, cli);
    delete process.env.isTemplate;

    await fse.remove('./scf-starter');
  });

  test('sls init an empty properties project', async () => {
    process.env.isEmpty = true;

    try {
      await initCmd({ t: 'test' }, cli);
    } catch (e) {
      expect(e.message).toBe('查询的包 "test" 不存在.');
    }
    delete process.env.isEmpty;
  });

  test('initTemplateFromCli reserveAppName and instanceName options', async () => {
    process.env.isTemplate = true;
    const packageName = 'scf-starter';
    const targetPath = path.resolve(packageName);

    await initTemplateFromCli({
      targetPath,
      packageName,
      registryPackage: {
        type: 'template',
        downloadKey: 'scf-starter.zip',
        downloadUrl: new URL(`file://${process.cwd()}/materials/scf-starter.zip`),
      },
      cli,
      appName: 'demoAPP',
      reserveAppName: true,
      instanceName: 'demoInstance',
    });
    const content = readYamlFile(path.resolve(targetPath, 'serverless.yml'));
    expect(content.app).toBe('demoAPP');
    expect(content.name).toBe('demoInstance');

    await fse.remove('./scf-starter');

    await initTemplateFromCli({
      targetPath,
      packageName,
      registryPackage: {
        type: 'template',
        downloadKey: 'scf-starter.zip',
        downloadUrl: new URL(`file://${process.cwd()}/materials/scf-starter.zip`),
      },
      cli,
      appName: 'demoAPP',
    });
    const content2 = readYamlFile(path.resolve(targetPath, 'serverless.yml'));
    expect(content2.app).not.toBe('demoAPP');
    expect(content2.app.includes('demoAPP')).toBe(true);

    await fse.remove('./scf-starter');

    delete process.env.isTemplate;
  });

  afterAll(() => {
    restoreCwd();
  });
});
