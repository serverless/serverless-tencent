# serverless-tencent

[![serverless](http://public.serverless.com/badges/v3.svg)](http://cn.serverless.com)

<!-- [![Build Status](https://github.com/serverless/serverless/workflows/Integrate/badge.svg)](https://github.com/serverless/serverless/actions?query=workflow%3AIntegrate) -->
<!-- [![npm version](https://badge.fury.io/js/serverless.svg)](https://badge.fury.io/js/serverless) -->
<!-- [![codecov](https://codecov.io/gh/serverless/serverless/branch/master/graph/badge.svg)](https://codecov.io/gh/serverless/serverless) -->
<!-- [![Known Vulnerabilities](https://snyk.io/test/github/serverless/serverless/badge.svg)](https://snyk.io/test/github/serverless/serverless) -->
<!-- [![license](https://img.shields.io/npm/l/serverless.svg)](https://www.npmjs.com/package/serverless) -->

[![Serverless Framework](https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/logo-sf-side-dark.png)](https://cn.serverless.com)

<p align="center">
  <a href="https://cn.serverless.com">🇨🇳 中文网站</a> •
  <a href="https://cn.serverless.com/cn/framework/docs/">📖 帮助文档</a> •
  <a href="https://github.com/serverless/serverless-tencent/discussions">💬 讨论区</a> •
  <a href="https://github.com/serverless/serverless-tencent/issues/new/choose">🐞 BUG反馈</a> •
  <a href="https://serverless.com/company/jobs/"> 👩‍💻👨‍💻 招聘职位</a>
</p>

> 此插件提供了 [Serverless](https://cn.serverless.com/) 在腾讯云上进行开发和调试的相关功能，并优化了使用流程和体验。

## 快速开始

### 前置条件

1. Nodejs 12.x 及以上版本
2. Serverless CLI `v3.0+`, 如果没有安装可以使用 `npm i -g serverless` 命令安装
3. [注册](https://cloud.tencent.com/register)腾讯云账号并[开通相关权限](https://cloud.tencent.com/document/product/1154/43006)

### 安装使用

#### 直接使用 serverless-tencent CLI

```sh
$ npm i -g serverless-tencent
$ slt init express-starter --name example
$ cd example
$ slt deploy
```

#### Serverless Framework CLI 集成使用

```sh
$ npm i -g serverless
$ sls init express-starter --name example
$ cd example
$ sls deploy
```

## CLI 命令

- [Init 创建](#init)
- [Deploy 部署](#deploy)
- [Info 详情](#info)
- [Dev 远程开发](#dev)
- [Logs 日志](#logs)
- [Remove 移除](#remove)
- [Credentials 授权](#credentials)
- [Registry 注册中心](#registry)
- [Invoke 远程调用](#invoke)
- [Invoke Local 本地调用](#invoke-local)

### <a name="init">Init 创建</a>

### <a name="deploy">Deploy 部署</a>

### <a name="info">Info 详情</a>

### <a name="dev">Dev 远程开发</a>

### <a name="logs">Logs 日志</a>

### <a name="remove">Remove 移除</a>

### <a name="credentials">Credentials 授权</a>

### <a name="registry">Registry 注册中心</a>

### <a name="invoke">Invoke 远程调用</a>

### <a name="invoke-local">Invoke Local 本地调用</a>

## 代码发布

### Canary 测试版本

提交代码到 `master` 分支，自动发布插件的 `canary` 版本，可以通过 `npm i -g serverless-tencent@canary` 安装测试

### 发布正式版本

1. 功能完成之后，需要修改 `package.json/version` 字段以及在 `CHANGELOG.md` 中写明更新日志
2. 提交代码到 `master`, 合并之后自动发布正式版本
