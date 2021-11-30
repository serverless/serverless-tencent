#!/usr/bin/env node

// Node.js v10+ only

'use strict';

const minimist = require('minimist');
require('essentials');

const argv = minimist(process.argv.slice(2));
const [versionTag] = argv._;
const usage = `Usage: ./scripts/pkg/upload.js [-h | --help] <versionTag>

Uploads binary files found in ./build folder into GitHub release.
Github OAuth token is expected to be exposed at GITHUB_TOKEN env var

Options:

    --help,   -h  Show this message
`;

if (argv.help) {
  process.stdout.write(usage);
  return;
}

if (!versionTag) {
  process.stdout.write(usage);
  return;
}

if (!/^v\d+\.\d+\.\d+$/.test(versionTag)) {
  const chalk = require('chalk');
  process.stdout.write(chalk.red(`Invalid version tag: ${versionTag}\n`));
  process.exitCode = 1;
  return;
}

require('./upload')(versionTag, { isLegacyVersion: argv.legacy });
