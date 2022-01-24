---
title: "Tencent Serverless - CLI 高级功能"
menuText: "CLI 高级使用技巧"
menuOrder: 7
description: 介绍 CLI 的高级功能和使用方法
layout: Doc
---

Serverless Tencent CLI 是为中国用户提供的全中文 CLI 开发工具，Serverless Tencent CLI 同 Serverless Framework CLI 共同使用 `serverless` 或 `sls` 来启用，会根据用户所在的位置(基于系统时区)或手动配置的环境变量来自动切换选择。通常用户不需要额外进行配置。

在某些特殊使用场景，或用户想要指定使用某一个 CLI 时，可以通过手动方式来进行切换，相关使用场景和切换方式如下

## 如何切换 Framework 与 Tencent CLI 以及云供应商

### 切换 CLI

如果用户想要使用 Serverless Framework CLI 进行 Framework 开发 （更多内容请参考 [Framework 说明文档](https://www.serverless.com/framework/docs/getting-started) ）可以通过一下方式指定使用 Serverless Frameowrk CLI。

* 在已经创建的 Serverless Frameowrk 项目目录中执行命令。
* 在包含 `.env` 环境变量配置文件的目录中，同时环境变量中没有声明 `SERVERLESS_PLATFORM_VENDOR` 为 `tencent` 时执行命令。
* 在执行命令时指定环境变量 `SLS_GEO_LOCATION` 不为 `cn` (可以指定为 `us`)。

相反，如果用户想要确保执行的 `serverless` 或 `sls` 命令会匹配到 Serverless Tencent CLI 与腾讯云环境，可以通过以下方式。

* 在执行命令目录中添加环境配置文件 `.env`, 同时在环境变量文件中声明 `SERVERLESS_PLATFORM_VENDOR` 为 `tencent` 时执行命令。
* 在执行命令时指定环境变量 `SLS_GEO_LOCATION` 为 `cn`。

### 切换云供应商

目前 Serverless Tencent CLI 是针对腾讯云优化的专属 Serverless 中文组件 CLI 开发工具。如果用户想要切换云供应商，需要使用 Serverless Framework CLI 并根据 [Serverless Framework 的云供应商文档](https://www.serverless.com/framework/docs/providers)说明安装相关插件后使用其他云供应商作为基础设施供应商。

> 目前 Serverless Frameowrk 因为国内云厂商接口和基础设施开放程度不同，对不同云厂商的支持有限，建议大家使用腾讯云和 Serverless Tencent CLI 来进行无服务器应用开发。 未来我们会进一步完善对其他云厂商的支持。

## 如何升级 Tencent CLI

基于不同的使用情况，您需要使用不同的方式来升级您的 Tencent CLI。

### 使用自动安装（二进制形式）

当您通过 npm 使用 `npm i serverless -g` 安装 Serverless Frameowrk CLI 后， 同时当您的 Serverless Frameowrk CLI 版本为 V3 版本时，会根据您所在的时区以及使用情况自动为您安装 二进制格式的 Serverless Tencent CLI，在这种情况下，会在您执行任意命令完成之后自动检查是否有新的版本发布，并提示您进行升级，您只需要确认升级等待升级完成即可。

> 这里的升级命令检查不包括 deploy，version， 以及 --help 。

### 使用 npm 安装

我们建议您使用 自动安装的 Serverless Tencent CLI 二进制形式，不过如果因为系统原因，有些二进制文件支持出现问题时，一样可以通过 `npm i serverless-tencent -g` 来手动安装 Serverless Tencent CLI。这是您可以通过 `npm upgrade serverless-tencent -g` 来手动升级 Serverless Tencent CLI的 npm 包，同时我们也会在有新版本发布后进行提示。

> 这种情况需要确认没有安装二进制的 Serverless Tencent CLI 工具，否则会优先使用 Serverless Tencent CLI 的二进制包来执行相关命令。

## 切换二进制与 npm 类型的 Tencent CLI

Serverless Framework CLI 会按照一下顺序加载 Serverless Tencent CLI

1. 当前目录通过 npm 安装的 Serverless Tencent CLI 包
2. 全局通过 npm 安装的 Serverless Tencent CLI 包
3. 二进制类型 Serverless Tencent CLI (文件存储在 `~/.serverless-tencent/bin` 目录下)

> 您可以通过 `sls -v` 查看 Serverless Tencent CLI 版本后的类型信息来确认当前使用的 Serverless Tencent CLI 类型。

因为系统硬件环境原因导致您无法使用二进制类型的 Serverless Tencent CLI，或您想要使用指定的版本的 Serverless Tencent CLI，您可以通过以下方式来安装 npm 类型的 Serverless Tencent CLI:

1. 确认已安装 Serverless Framework CLI (使用 `npm i serverless -g`来安装)
2. 删除 `~/.serverless-tencent/bin` 目录下的二进制类型的 Serverless Tencent CLI
3. 在全局(使用 `npm i serverless-tencent -g`)或在执行命令目录(使用 `npm i serverless-tencent`)安装 npm 类型的 Serverless Tencent CLI (同时您也可以指定具体的版本( 如 `npm i serverless-tencent@3.20.1`)来安装指定版本的 Serverless Tencent CLI)

同样，如果您想使用二进制类型的 Serverless Tencent CLI，您可以通过以下方式来安装 二进制类型的 Serverless Tencent CLI

1. 确认已安装 Serverless Framework CLI (使用 `npm i serverless -g`来安装)
2. 删除全局(使用 `npm uninstall serverless-tencent -g`)和执行命令目录((使用 `npm uninstall serverless-tencent`))已安装的 npm 类型的 Serverless Tencent CLI.
3. 在中国或腾讯云环境下(指定环境变量 `SLS_GEO_LOCATION` 为 `cn` 或 `SERVERLESS_PLATFORM_VENDOR` 为 `tencent`)执行任意命令 如 `serverless` 或 `sls`，都会自动完成二进制类型的 Serverless Tencent CLI 安装。