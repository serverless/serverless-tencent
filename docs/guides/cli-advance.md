---
title: "Tencent Serverless - CLI 高级指南"
menuText: "Tencent CLI 使用指南"
menuOrder: 7
description: 介绍 CLI 的高级功能和使用方法
layout: Doc
---

# Tencent CLI 高级指南

Serverless 为中国用户在腾讯云上进行 Serverless 开发提供了专门的 Tencent CLI 工具，使用方式和功能都与 Serverless Framework CLI （为在 AWS 上进行 Serverless 开发提供了支持）保持一致，并针对腾讯云的基础设施进行了优化，同时 CLI 中所有内容进行了汉化。

在使用时 Tencent CLI 作为 Serverless Framework CLI 的一个动态依赖会在需要的时候自动安装并接管 Serverless CLI 的全部命令。这里自动安装接管的逻辑是：

* 用户当前所在的时区为中国时区。
* 用户当前的项目是 Tencent Serverless 项目。

## 切换腾讯云与 AWS

### 指定使用 Tencent CLI - 腾讯云

1. 在已有的 Tencent Serverless 项目目录中执行 `serverless` 命令。（CLI 会根据项目的配置文件 `serverless.yml` 自动选择匹配 Tencent CLI。）

2. 通过在执行 `serverless` 命令前添加环境变量 `SERVERLESS_PLATFORM_VENDOR` 并设置值为 `tencent`，如：
```bash
SERVERLESS_PLATFORM_VENDOR=tencent serverless deploy
```

> 也可以使用 `SLS_GEO_LOCATION` 并将值设置为 `cn`

3. 在 Serverless 应用目录的环境配置文件 `.env` 中添加环境变量配置 `SERVERLESS_PLATFORM_VENDOR=tencent`。

> .env 文件的加载顺序优先级是： `--target` 指定目录 > 执行命令目录 > 执行命令父目录 > 执行命令父父目录 > 全局变量。

### 指定使用 Serverless Framework CLI - AWS

1. 在已有的 Serverless Framework 项目目录中执行 `serverless` 命令。（CLI 会根据项目的配置文件 `serverless.yml` 自动选择匹配 Serverless Framework CLI。）

2. 通过在执行 `serverless` 命令前添加环境变量 `SERVERLESS_PLATFORM_VENDOR` 并设置值为 `aws`，如：
```bash
SERVERLESS_PLATFORM_VENDOR=aws serverless deploy
```

> 也可以使用 `SLS_GEO_LOCATION` 并将值设置为 `us`

> 注意：Serverless Framework CLI 不再支持项目 .env 变量配置加载，所以不能在 Framework 项目中使用 .env 方式切换 CLI。

## 指定 Tencent CLI 版本

因为 Serverless Framework CLI 自动安装的 Tencent CLI 会自动安装当前发布的最新发布版本，如果需要使用指定版本的 Tencent CLI 可以使用以下方式指定：

> 使用指定版本的 Tencent CLI （npm 安装版本）后需要手动对 Tencent CLI 进行升级。

### 全局指定 Tencent CLI 版本

使用 npm 全局方式安装 `serverles-tencent` 并指定所需的版本后，
```bash
npm i serverless-tencent@3.21.0 -g
```

Serverless Framework CLI 会优先于自动安装的 Tencent CLI 加载使用全局安装的 npm 版本。

可以通过 `serverless -v` 来查看当前使用的 Tencent CLI 版本和来源。 全局版本提示信息如下：

```bash
Framework Core: 3.2.1
Plugin: 6.0.0
SDK: 4.3.1
Tencent CLI: 3.21.0 (npm global)
```

### 本地指定 Tencent Serveress CLI 版本

使用 npm 本地方式安装 `serverles-tencent` 并指定所需的版本后，
```bash
 npm i serverless-tencent@3.21.1
```

Serverless Framework CLI 会优先于自动安装的 Tencent Serverless CLI 以及全局安装的 npm 版本，加载使用本地安装的 npm 版本。

可以通过 `serverless -v` 来查看当前使用的 Tencent Serverless CLI 版本和来源。 本地版本提示信息如下：

```bash
Framework Core: 3.2.1
Plugin: 6.0.0
SDK: 4.3.1
Tencent CLI: 3.21.1 (npm local)
```

### 恢复自动安装的 Tencent CLI（编译版本）

如果要恢复使用 Serverless Framework CLI 自动安装的 Tencent CLI (编译版本)，可以通过删除全局和本地的 npm 版本的 Tencent CLI：

```bash
# 删除本地安装的 serverless-tencent
npm uninstall serverless-tencent

# 删除全局安装的 serverless-tencent
npm uninstall serverless-tencent -g
```

可以通过 `serverless -v` 来查看当前使用的 Tencent CLI 版本和来源。 自动安装的编译版本提示信息如下：

```bash
Framework Core: 3.2.1
Plugin: 6.0.0
SDK: 4.3.1
Tencent CLI: 3.21.2 (binary)
```

## Tencent Serverless CLI 常见使用问题

### 如何升级

#### 自动安装的编译版本

通过 Serverless Framework CLI 自动安装的编译版本 Tencent CLI 会在执行命令之后自动检查是否有新的版本发布，并提示用户进行升级，用户根据需要进行选择即可：

```bash
Tencent Serverless CLI 有新版本更新，是否立即升级？(Y/n)

# 确认升级后会自动下载并安装最新的 Serverless Tencent CLI。
⠧ 正在升级 Tencent Serverless CLI 
```

> 为了避免升级功能阻塞 CI/CD 使用流程以及使用体验，在命令 `deploy` 和 `help` 命令执行完成后不会检查并提示升级。 

#### NPM 版本升级

通过 npm 安装的 Tencent CLI 需要手动进行升级，命令如下：

```bash
npm update serverless-tencent -g
```

### Serverless Components CLI is no longer bundled with Serverless Framework CLI

如果遇到这个错误提示，同时您确认您没有尝试在 AWS 上部署 Serverless Components 项目，那么通常是因为 Serverless CLI 并没有正确识别到应用或使用环境导致没有自动将命令转交给 Tencent CLI 执行。通常这种情况可以通过上方的 [指定使用 Tencent CLI](#指定使用-tencent-cli---腾讯云) 来指定使用，最简单的方法就是在执行 `serverless` 命令前添加要使用的云厂商环境变量信息：

```bash
SERVERLESS_PLATFORM_VENDOR=tencent serverless deploy
```
