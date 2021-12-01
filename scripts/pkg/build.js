#!/usr/bin/env node

// Node.js v8+ only

'use strict';

require('essentials');

const path = require('path');
const spawn = require('child-process-ext/spawn');
const fse = require('fs-extra');

const serverlessPath = path.join(__dirname, '../..');
const spawnOptions = { cwd: serverlessPath, stdio: 'inherit' };

(async () => {
  try {
    process.stdout.write('Build binaries\n');
    await spawn(
      'node',
      [
        './node_modules/.bin/pkg',
        '--targets',
        'node14-linux-x64,node14-mac-x64,node14-win-x64',
        '--out-path',
        'build',
        'bin/serverless-tencent',
      ],
      spawnOptions
    );
  } finally {
  }
})();
