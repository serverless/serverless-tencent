# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [3.19.2](https://github.com/serverless/serverless-tencent/compare/v3.19.1...v3.19.2) (2022-01-20)

- Fix standalone upgrade on windows

# [3.19.1](https://github.com/serverless/serverless-tencent/compare/v3.19.0...v3.19.1) (2022-01-19)

- Stop polling logs when two errors happen in a row
- Check if path already exists for sls init
- Link instance to existed app in sls command

# [3.19.0](https://github.com/serverless/serverless-tencent/compare/v3.16.11...v3.19.0) (2022-01-11)

- Exit process and format msg for errors in dev mode
- Fix credentials command

# [3.16.11](https://github.com/serverless/serverless-tencent/compare/v3.16.10...v3.16.11) (2022-01-10)

- Add questionnaire notify for users
- Add `CLI upgrade` notify for **npm installation**

# [3.16.10](https://github.com/serverless/serverless-tencent/compare/v3.16.9...v3.16.10) (2021-12-21)

- Add unit tests for Tencent CLI

# [3.16.9](https://github.com/serverless/serverless-tencent/compare/v3.16.8...v3.16.9) (2021-12-09)

- Change `--skip-update` to `--skipUpdate` for skipping update check

# [3.16.8](https://github.com/serverless/serverless-tencent/compare/v3.16.7...v3.16.8) (2021-12-07)

- Show plain version message by `serverless-tencent version --plain`
- `--skip-update` option can skip `auto upgrade feature`
- Use `$HOME/.serverless-tencent` as **CLI resource path**

# [3.16.7](https://github.com/serverless/serverless-tencent/compare/v3.16.6...v3.16.7) (2021-12-07)

- Ignore upgrade feature for `version` command

# [3.16.6](https://github.com/serverless/serverless-tencent/compare/v3.16.5...v3.16.6) (2021-12-06)

- We consider `macos_x64` as `mac_arm64` right now and provide this standalone to `mac arm64` users, due to Github CI has not provide a `mac arm64` environment to build standalone

# [3.16.5](https://github.com/serverless/serverless-tencent/compare/v3.16.4....v3.16.5) (2021-12-01)

- `serverless-tencent CLI` will inform for users to upgrade the standalone CLI if detect a new version except `deploy` commands

# [3.16.4](https://github.com/serverless/serverless-tencent/compare/v3.16.3....v3.16.4) (2021-11-30)

- Test `generate standalone in Github CI` feature
- Update `window-x64` program

# [3.16.3](https://github.com/serverless/serverless-tencent/compare/v3.16.2....v3.16.3) (2021-11-16)

- Update `name` and `app` fields for generate YML config

# [3.16.2](https://github.com/serverless/serverless-tencent/compare/v3.16.1....v3.16.2) (2021-11-16)

- Upgrade **generate YML config for Node project in http component**
- Add unit tests

# [3.16.1](https://github.com/serverless/serverless-tencent/compare/v3.16.0....v3.16.1) (2021-11-08)

- Fix loadGlobalCredentials config

# 3.16.0 (2021-11-08)

- Release error message improvement
- Update major version to make validation alert feasible

# 2.31.0 (2021-10-20)

## Refactor serverless-tencent cli

## improve error message

# 0.0.1 (2021-09-27)

### Init serverless tencent cli
