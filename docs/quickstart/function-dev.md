---
title: "函数应用开发"
menuText: "函数应用开发"
layout: Doc
---

# 函数应用开发

通过 Serverless CLI 的交互命令可以快速创建一个 Serverless 项目，函数项目请选择 `scf-starter`。

> 与国际版本不同，Serverless 中国通过 SCF 组件实现了国际版的函数开发功能。同时用户可以使方便的整合更多的腾讯云基础设施。详细说明请查看[函数开发(function)指南](../function/README)。

## 初始化函数应用

在**空文件夹**目录下，执行如下指令：

```sh
# 使用 serverless 交互命令新建项目
$ serverless
```

接下来按照交互提示，完成项目初始化，应用请选择 `scf-starter` 模版，并选择您希望用的运行时（此处以 Node.js 为例）：

```sh
Serverless: 当前未检测到 Serverless 项目，是否希望新建一个项目？ Yes
Serverless: 请选择你希望创建的 Serverless 应用

  react-starter - 快速部署一个 React.js 应用
  restful-api - 快速部署一个 REST API 使用 python + API gateway
❯ scf-starter - 快速部署一个云函数
  vue-starter - 快速部署一个 Vue.js 基础应用
  website-starter - 快速部署一个静态网站
  eggjs-starter - 快速部署一个Egg.js 基础应用
  express-starter - 快速部署一个 Express.js 基础应用

Serverless: 请选择应用的运行时
  scf-golang - 快速部署一个 golang 云函数
❯ scf-nodejs - 快速部署一个 nodejs 云函数
  scf-php - 快速部署一个 PHP 云函数
  scf-python - 快速部署一个 python 云函数

Serverless: 请输入项目名称 my-scf-nodejs
Serverless: 正在安装 scf-nodejs 应用...

- 项目 "my-scf-nodejs" 已在当前目录成功创建
- 执行 "cd my-scf-nodejs && serverless deploy" 部署应用

scf-nodejs › 创建成功
```

应用创建完成之后，如果想要部署，可以选择【立即部署】并将已经初始化好的项目快速部署腾讯云平台：

```sh
Serverless: 是否希望立即将该项目部署到云端？ Yes

xxxxxxxx
x  QR  x
x CODE x
xxxxxxxx
请使用微信扫描上方二维码或者点击下方链接登录
https://slslogin.qcloud.com/XKYUcbaK
登录成功！

serverless ⚡components
Action: "deploy" - Stage: "dev" - App: "my-scf-nodejs-7398d46a" - Instance: "scf-nodejs"

functionName: scf-nodejs-dev-my-scf-nodejs-7398d46a
description:  This is a function in my-scf-nodejs-7398d46a application
namespace:    default
runtime:      Nodejs10.15
handler:      index.main_handler
memorySize:   128
lastVersion:  $LATEST
traffic:      1
triggers:
  -
    NeedCreate:  true
    created:     true
    serviceId:   service-mqkih33e
    serviceName: serverless
    subDomain:   service-mqkih33e-xxxxxxxx.gz.apigw.tencentcs.com
    protocols:   http
    environment: release
    apiList:
      -
        path:            /
        method:          GET
        apiName:         index
        created:         true
        authType:        NONE
        businessType:    NORMAL
        isBase64Encoded: false
        apiId:           api-97zm7fws
        internalDomain:
    urls:
      - http://service-mqkih33e-xxxxxxxx.gz.apigw.tencentcs.com/release/

应用控制台: https://serverless.cloud.tencent.com/apps/my-scf-nodejs-7398d46a/scf-nodejs/dev

21s › scf-nodejs › 执行成功
```

> 如果有使用全局密钥有可能会与上面流程不同，关于登陆的更多方式和说明请查看[腾讯云账号控制](../basic/tencent-account)相关内容获得更详细帮助。

部署成功后会显示

- 当前部署组件实例的环境(stage)，应用，地区，信息。
- 已部署的云端组件(SCF 和 API 网关)的信息信息（运行时，命名空间，访问地址，环境信息）等。
- (腾讯)应用控制台信息，在这里可以查看管理该组件应用。

> 所有基础设施信息都默认自动生成，如果需要修改请到项目目录 serverless.yml 文件中进行修改 。

部署成功后访问 API 网关地址就可以访问部署应用。

## 修改配置

### 查看目录结构

在初始化的项目目录下，可以看到一个 Serverless 函数项目的最基本结构：

```
.
├── serverless.yml  # 配置文件
├—— index.js    # 入口函数
└── .env # 环境变量文件
```

- serverless.yml 配置文件实现了函数基本信息的快速配置，函数控制台支持的配置项都支持在 yml 文件里配置（查看 [云函数的全量配置信息](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md)）。
- index.js 为项目的入口函数，此处为 helloworld 模版。
- .env 文件里存放了用户登录的鉴权信息，您也可以在里面配置其它环境变量。

Serverless Framework 项目创建成功后会在目录生成 `serverless.yml`，这是 serverless 唯一的配置文件，所有配置都可以在这里进行快速修改。以下是自动生成的 serverless 配置文件

```yml
# ##应用信息##
app: my-scf-nodejs-7398d46a # app名称(app唯一识别标识)。同账号下需唯一，留空则继承组件实例名称
component: scf # [必选]要使用组件，更多组件请查看 https://github.com/serverless-components
name: scf-nodejs # [必选]组件实例名称

# ##scf 组件配置##
# 更多内容请查看: https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md
inputs:
  src: ./ # 执行目录
  handler: index.main_handler # 函数方法名称【文件名称.函数名称】。名称要求字母开始和结尾，允许使用数字、下划线(_)和连接符(-)，2-60 个字符。
  region: ap-guangzhou # 部署目标地区。 更多参考 https://cloud.tencent.com/document/api/583/17238#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8
  runtime: Nodejs10.15 # 运行环境。[Nodejs10.15, Nodejs12.16]
  memorySize: 128 # 函数运行内存，单位MB。[64, 128, ... 3072]，以 128 递增
  timeout: 3 # 函数超时时间，单位秒，范围 1-900
  events: # 触发器
    - apigw: # api网关触发器，已有apigw服务，配置触发器
        parameters:
          endpoints:
            - path: /
              method: GET
```

这里需要注意：

> `app` 是应用名称，同时也作为云端应用的唯一标识。应用名称如果修改，会在云端重新部署为新的应用。  
> `name` 是 component 组件实例的名称，一个应用可以包含多个组件。  
> 每个账号下同一名称的应用只能存在一个，部署会按照应用名称创建/覆盖应用。同一应用下的组件在也会按照组件名创建/覆盖组件实例。  
> `inputs` 是组件配置的参数，所有的组件配置都需要将配置信息写在 inputs 中。

## 部署更新代码

在本地项目目录下，您可以对函数模版项目内容与配置文件进行修改，并通过以下指令进行重新部署：

```sh
# 部署项目代码到云服务器
$ serverless deploy
```

## 查看部署信息

如果希望再次查看应用的部署状态和资源，可以进入到部署成功的文件夹，运行如下命令，查看对应信息：

```sh
# 查看已部署应用信息
$ serverless info

serverless ⚡components

最后操作:  deploy (9 minutes ago)
部署次数:  1
应用状态:  active

functionName: scf-nodejs-dev-my-scf-nodejs-7398d46a
description:  This is a function in my-scf-nodejs-7398d46a application
namespace:    default
runtime:      Nodejs10.15
handler:      index.main_handler
memorySize:   128
lastVersion:  $LATEST
traffic:      1
triggers:
  -
    NeedCreate:  true
    created:     true
    serviceId:   service-mqkih33e
    serviceName: serverless
    subDomain:   service-mqkih33e-xxxxxxxxxx.gz.apigw.tencentcs.com
    protocols:   http
    environment: release
    apiList:
      -
        path:            /
        method:          GET
        apiName:         index
        created:         true
        authType:        NONE
        businessType:    NORMAL
        isBase64Encoded: false
        apiId:           api-97zm7fws
        internalDomain:
    urls:
      - http://service-mqkih33e-xxxxxxxxxx.gz.apigw.tencentcs.com/release/

应用控制台: https://serverless.cloud.tencent.com/apps/my-scf-nodejs-7398d46a/scf-nodejs/dev

scf-nodejs › 信息成功加载
```

**下一步：[了解函数开发(function)指南](../functions/README)**
