'use strict';

const { spawn } = require('child_process');
const path = require('path');
const { v4 } = require('uuid');
const fse = require('fs-extra');
const { printOutput, colorLog } = require('./utils');

module.exports = async (event, context, handlerFile, handlerFunc, cli) => {
  const tempResFile = `serverless_res_${v4().split('-')[0]}.txt`;
  const tempNodeFile = `serverless_tmep_${v4().split('-')[0]}.js`;
  fse.createFileSync(tempResFile);

  const tempNodeFileContent = `
const fs = require('fs')
const path = require('path')
const { ${handlerFunc} } = require('${path.join(process.cwd(), handlerFile)}')

async function test() {

const res = await ${handlerFunc}(${JSON.stringify(event)},${JSON.stringify(context)})
fs.writeFileSync('${tempResFile}', JSON.stringify(res))
}

test()
`;

  fse.writeFileSync(tempNodeFile, tempNodeFileContent);
  try {
    const res = spawn('node', [path.join(process.cwd(), tempNodeFile)]);
    res.stdout.on('data', (d) => {
      console.log(d.toString());
    });

    res.stderr.on('data', (data) => {
      // we need to remove the error which is from the temp python file, directly show the origin error
      const errData = data.toString().split('\n');
      errData.splice(1, 2);

      cli.log('---------------------------------------------');
      fse.unlinkSync(tempNodeFile);
      fse.unlinkSync(tempResFile);
      colorLog(`调用错误\n\n ${errData.join('\n').toString()}`, 'red', cli);
      process.exit(1);
    });

    res.on('close', () => {
      const data = fse.readFileSync(tempResFile);
      printOutput(cli, JSON.parse(data.toString()));

      fse.unlinkSync(tempNodeFile);
      fse.unlinkSync(tempResFile);
    });
  } catch (e) {
    printOutput(cli, null, e);
  }
};
