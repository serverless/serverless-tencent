---
title: "Tencent Serverless - 升级变更"
menuText: "升级变更"
menuOrder: 9
description: 需要关注的 Serverless 相关升级变更内容。
layout: Doc
---

# 升级变更

## Serverless Framework CLI V3 

> 该版本升级发布时间为 2022年1月27日

### 变更内容

* 升级了 Serverless Framework CLI 的使用体验，优化内容让内容更清晰，同时强调了用户的可操作内容。
* 优化了 Serverless Tencent CLI 与 Serverless Framework CLI 的集成方式，
* 加强了 Serverless Tencent CLI 的错误定位信息和帮助内容。 

### 变更对我有影响吗？

对于使用腾讯云的 Serverless 用户来说，在升级 Serverless Framework CLI V3 之后所有命令都是通过 Serverless Tencent CLI 来完成的。 

* 在使用方式上没有任何变动，用户依旧可以使用 `serverless` 同 `sls` 来执行 Serverless 命令，同时 Serverless 的相关命令与用法也没有变动。
* 用户执行的 CLI 命令依旧会有 Serverless Framework CLI 根据用户执行的环境以及目录自动判断由哪一个CLI来执行。

这次升级的主要改动内容是 Serverless Tencent CLI 的安装和升级逻辑，对于绝大多数用户的使用情况，这些变动是不需要关注的。 

> 对于需要使用 Serverless Framework CLI 进行 AWS 或其他云平台开发的用户，可以参考[ Framework CLI V3 升级指南](https://www.serverless.com/framework/docs/guides/upgrading-v3)

> 如果用户由特殊的使用需求，比如希望手动切换 CLI，或使用固定版本的 Tencent CLI，请参考[CLI 高级使用技巧](./guides/cli-advance)

### 如何升级到 V3？

首先，通过 npm 安装升级到最新的 Serverless Framework CLI V3，执行：

```
$ npm i serverless -g
```

然后可以正常执行所有 Serverless 命令，当系统监测到当前没有 Serverless Tencent CLI 存在时会自动安装，如下：

```
$ sls

⠦ 正在安装 Tencent Serverless CLI
```

并在安装完成之后继续执行相关命令。
