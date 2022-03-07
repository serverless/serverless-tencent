---
title: 使用 Serverless 快速部署和使用 Puppeteer 应用
description: 如何使用 Serverless Framework 快速初始化一个 Puppeteer 应用，部署到 SCF 平台，以及方便得使用
date: 2022-03-04
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2022-03-04-scf-puppeteer.png
authors:
  - TimQian
category:
  - guides-and-tutorials
---

[Puppeteer](https://pptr.dev/) 是一款开源的 Nodejs 应用，可以在服务端运行无界面浏览器（Headless Chrome），并且通过代码控制浏览器的行为。

通过使用 Puppeteer，你可以
- 抓取一个 SPA 页面
- 自动填写表单，点击按钮
- 建立一个集成测试环境，用来测试你的网站功能
- 生成网页截图
- 等等等等

腾讯云 SCF 默认集成了 Puppeteer 模块，本文介绍如何使用 Serverless Framework 快速初始化一个 Puppeteer 应用，部署到 SCF 平台，以及方便得使用。

## 1. 编写 Puppeteer 应用

### 1.1 初始化 Serverles 应用

首先，使用以下命令创建一个托管在腾讯云 SCF 上的简单的 Node.js 应用

```bash
serverless init scf-starter --name scf-puppeteer
cd scf-puppeteer
```

该命令会新建一个名为 scf-puppeteer 的文件夹，并且初始化一个简单的 SCF 函数。以下是初始化的函数代码，当有调用时，打印一段日志并且返回一个 JSON 对象。

```js
// index.js
exports.main_handler = async (event, context) => {
  console.log(event)
  return {
    msg: 'Hello Serverless'
  }
}
```

### 1.2 编写 Puppeteer 脚本

由于 SCF 默认集成了 Puppeteer，所以你无需 `npm install puppeteer`, 直接在代码中 `require` 使用即可。我们将初始化的函数代码修改成如下形式：

```js
// index.js
const puppeteer = require('puppeteer');

exports.main_handler = async (event, context) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    });
    const page = (await browser.pages())[0];
    await page.goto(
        'https://www.baidu.com/', {
        waitUntil: 'load', 
        timeout: 20000,
    });
    const title = await page.title();
    await browser.close();
    return {
        title: title,
    };
};
```

这段代码被调用的时候，会开启一个无界面浏览器，代替你访问 https://baidu.com/， 在页面加载完成之后获取它的标题，最后返回给调用者。

## 2. 部署

使用 Serverless Framework 部署云函数到腾讯云 SCF， 只需执行以下命令：

```bash
serverless deploy
```

扫码登录你的腾讯云账号之后，该命令会将你的函数部署到腾讯云 SCF。

## 3. 调用

调用该函数同样简单，你只需要在当前文件夹下执行以下命令：
```bash
serverless invoke
```

执行成功之后，你就可以获得这个 Puppeteer 应用的执行结果了：

```bash
$ scf-puppeteer > sls invoke

billDuration:      2214
duration:          2214
errMsg:            
functionRequestId: 48faf68d-c829-4f3c-8109-705fedb053ff
invokeResult:      0
log: 
  """
    START RequestId: 48faf68d-c829-4f3c-8109-705fedb053ff
    Event RequestId: 48faf68d-c829-4f3c-8109-705fedb053ff
    
    END RequestId: 48faf68d-c829-4f3c-8109-705fedb053ff
    Report RequestId: 48faf68d-c829-4f3c-8109-705fedb053ff Duration:2214ms Memory:128MB MemUsage:91.3923MB
  """
memUsage:          95831824
--------------------------------------------- 
Serverless: 调用成功 

{
  title: '百度一下，你就知道'
} 
```

执行结果上方是执行过程的日志和一些其他信息，下方是函数的返回值。

另外，你也可以通过其他方式来触发调用该函数，在我们这个例子中，默认还配置了 HTTP API，可以通过一个 URL 来调用。

```yml
app: scf-puppeteer-2e7ff372

#组件信息
component: scf # (必填) 引用 component 的名称，当前用到的是 tencent-scf 组件
name: scfdemo # (必填) 创建的实例名称，请修改成您的实例名称

# ##scf 组件配置##
# 更多内容请查看: https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md
#组件参数
inputs:
  src: ./ #代码路径
  handler: index.main_handler # 函数方法名称【文件名称.函数名称】。名称要求字母开始和结尾，允许使用数字、下划线(_)和连接符(-)，2-60 个字符。
  runtime: Nodejs10.15 # 运行环境。
  region: ap-guangzhou # 部署目标地区。 
  events: # 触发器
    - apigw: # 网关触发器
        parameters:
          endpoints:
            - path: /
              method: GET

```

你也可以在 yml 中配置其他触发器来触发这个应用，比如定时触发。具体配置方式可以参考这个文档： https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#event

## 4. 密钥，CI/CD

如果你不希望每次部署都需要扫码登录腾讯云账号（特别是在 CI/CD 的时候），可以在项目目录中添加一个 `.env` 文件用来存储你的账号密钥。

```bash
SERVERLESS_PLATFORM_VENDOR=tencent
TENCENT_SECRET_ID=******
TENCENT_SECRET_KEY=******
```

具体使用和配置方法可以参考这篇文章：https://cn.serverless.com/blog/serverless-github-action

## 5. 结论

目前在各大云厂商的云函数平台使用和部署 Puppeteer 都比较复杂。腾讯云 SCF 默认集成了这个服务，使用 Serverless Framework 部署和使用非常方便。欢迎试用。
