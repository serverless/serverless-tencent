---
title: 如何优雅的部署一个 Serverless Next.js 应用
description: 一步一步带大家了解，如何基于 Serverless 架构部署一个实际的线上业务
date: 2021-11-09
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2021-11-09-deploy-nextjs-gracely.png
authors:
  - YugaSun
category:
  - guides-and-tutorials
---

> 转载自: https://yugasun.com/post/serverless-nextjs.html, 基于原文进行了 Next.js项目使用 Http 组件的优化

本文主要内容：

1. 如何快速部署 Serverless Next.js
2. 如何自定义 API 网关域名
3. 如何通过 COS 托管静态资源
4. 静态资源配置 CDN
5. 基于 Layer 部署 node_modules

## 如何快速部署 Serverless Next.js

由于本人对 [Serverless Framework](https://github.com/serverless/serverless) 开发工具比较熟悉，并且长期参与相关开源工作，所以本文均使用 Serverless Components 方案进行部署，请在开始阅读本文之前，保证当前开发环境已经全局安装 `serverless` 命令行工具。
本文使用 [Http 组件](https://github.com/serverless-components/tencent-http) 来帮助快速部署 Next.js 应用到腾讯云的 Serverless 服务上。

我们先快速初始化一个 Serverless Next.js 项目：

```bash
$ serverless init  nextjs-starter --name serverless-nextjs
$ cd serverless-nextjs
```

该项目模板已经默认配置好 `serverless.yml`，可以直接执行部署命令：

```bash
$ serverless deploy
```

大概 `30s` 左右就可以部署成功了，之后访问生成的 `apigw.url` 链接 `https://service-xxx-xxx.gz.apigw.tencentcs.com/release/` 就可以看到首页了。

Next.js 组件，会默认帮助我们创建一个 `云函数` 和 `API 网关`，并且将它们关联，实际我们访问的 是 API 网关，然后触发云函数，来获得请求返回结果，流程图如下：

![Serverless Requst Flow](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-09-deploy-nextjs-gracely-1.png)

> **解释**：我们在执行部署命令时，由于一个简单的 Next.js 应用除了业务代码，还包括庞大的 `node_modules` 文件夹，这就导致打包压缩的代码体积大概 `20M` 左右，所以大部分时间消耗在代码上传上。这里的速度也跟开发环境的网络环境有关，而实际上我们云端部署是很快的，这也是为什么需要 `30s` 左右的部署时间，而且网络差时会更久，当然后面也会提到如何提高部署速度。

相信你已经体会到，借助 Serverless Components 解决方案的便利，它确实可以帮助我们的应用高效的部署到云端。而且这里使用的 Next.js 组件，针对代码上传也做了很多优化工作，来保证快速的部署效率。

接下来将介绍如何基于 Next.js 组件，进一步优化我们的部署体验。

## 如何自定义 API 网关域名

使用过 API 网关的小伙伴，应该都知道它可以配置自定义域名，如下图所示：

![Manual Config Custom Domain](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-09-deploy-nextjs-gracely-2.png)

但是这个手动配置还是不够方便，为此 Http 组件也提供了 `customDomains` 来帮助开发者快速配置自定义域名，于是我们可以在项目的 `serverless.yml` 中新增如下配置：

```yaml
app: appDemo
component: http
name: nextjsDemo

inputs:
  src:
    dist: ./
    hook: npm run build
    exclude:
      - .env
  faas:
    runtime: Nodejs12.16
    framework: nextjs
    name: '${name}'
  apigw:
    customDomains:
      - domain: test.yuga.chat
        certificateId: abcdefg # 证书 ID
        # 这里将 API 网关的 release 环境映射到根路径
        pathMappingSet:
          - path: /
            environment: release
        protocols:
          - https
```

由于这里使用的是 `https` 协议，所以需要配置托管在腾讯云服务的证书 ID，可以到 [SSL 证书控制台](https://console.cloud.tencent.com/ssl) 查看。腾讯云已经提供了申请免费证书的功能，当然你也可以上传自己的证书进行托管。

之后我们再次执行部署命令，会得到如下输出结果：

![Custom Domain Outputs](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-09-deploy-nextjs-gracely-3.png)

这里由于自定义域名时通过 CNAME 映射到 API 网关服务，所以还需要手动添加输出结果中红框部分的 CNAME 解析记录。等待自定义域名解析成功，就可以正常访问了。

## 如何通过 COS 托管静态资源

Next.js 应用，有两种静态资源：

1. 项目中通过资源引入的方式使用，这种会经过 `Webpack` 打包处理输出到 `.next/static` 目录，比如 `.next/static/css` 样式文件目录。
2. 直接放到项目根目录的 `public` 文件夹，通过静态文件服务返回，然后项目中可以直接通过 url 的方式引入（[官方介绍](https://nextjs.org/docs/basic-features/static-file-serving)）。

第一种的资源很好处理，Next.js 框架直接支持在 `next.config.js` 中配置 `assetPrefix` 来帮助我们在构建项目时，将提供静态资源托管服务的访问 url 添加到静态资源引入前缀中。如下：

```js
// next.config.js
const isProd = process.env.NODE_ENV === "production";
const STATIC_URL =
  "https://serverless-nextjs-xxx.cos.ap-guangzhou.myqcloud.com";
module.exports = {
  assetPrefix: isProd ? STATIC_URL : "",
};
```

上面配置中的 `STATIC_URL` 就是静态资源托管服务提供的访问 url，示例中是腾讯云对应的 COS 访问 url。

那么针对第二种资源我们如何处理呢？这里就需要对业务代码进行稍微改造了。

首先，需要在 `next.config.js` 中添加 `env.STATIC_URL` 环境变量:

```js
const isProd = process.env.NODE_ENV === "production";
const STATIC_URL =
  "https://serverless-nextjs-xxx.cos.ap-guangzhou.myqcloud.com"; // 你的cos桶的可访问地址
module.exports = {
  env: {
    // 3000 为本地开发时的端口，这里是为了本地开发时，也可以正常运行
    STATIC_URL: isProd ? STATIC_URL : "http://localhost:3000",
  },
  assetPrefix: isProd ? STATIC_URL : "",
};
```

然后，在项目中修改引入 `public` 中静态资源的路径，比如：

```html
<!-- before -->
<head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</head>

<!-- after -->
<head>
  <title>Create Next App</title>
  <link rel="icon" href={`${process.env.STATIC_URL}/favicon.ico`} />
</head>
```

最后，在 `serverless.yml` 中新增静态资源相关配置 `assets`，如下：

```yaml
app: appDemo
component: http
name: nextjsDemo

inputs:
  src:
    dist: ./
    hook: npm run build
    exclude:
      - .env
  faas:
    runtime: Nodejs12.16
    framework: nextjs
    name: '${name}'
  apigw:
  # 省略apigw 配置
  assets:
    cos:
      # 你的cos桶的名字
      bucket: abc
```

通过配置 `assets.cos..bucket` 指定 COS 桶，执行部署时，会默认自动将编译生成的 `_next` 和 `public` 文件夹静态资源上传到指定的 COS。

修改好配置后，再次执行 `serverless deploy` 进行部署：

```bash
$ serverless deploy

serverless ⚡framework
Action: "deploy" - Stage: "dev" - App: "appDemo" - Instance: "nextjsDemo"

region:    ap-guangzhou
# 此处省略......
assets:
  cos:
    region:    ap-guangzhou
    cosOrigin: serverless-nextjs-xxx.cos.ap-guangzhou.myqcloud.com
    bucket:    serverless-nextjs-xxx
    url: https://sls-cloudfunction-ap-guangzhou-code-xxxxx.cos.ap-guangzhou.myqcloud.com
```

浏览器访问，打开调试控制台，可以看到访问的静态资源请求路径如下：

![Static Asset Url](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-09-deploy-nextjs-gracely-4.png)

上图可以看出，静态资源均通过访问 COS 获取，现在云函数只需要渲染入口文件，而不需要像之前，静态资源全部通过云函数返回。

> 备注：之前由于都是将 .next 部署到了云函数，所以没法访问页面后，页面中的静态资源，如图片，都需要再次访问云函数，然后获取。于是看似我们请求了一次云函数，而实际上云函数单位时间并发数，会根据页面静态资源请求数而增加，从而造成冷启动问题。

## 静态资源配置 CDN

上面我们已经将静态资源都部署到 COS 了，页面访问也快了很多。但是对于生产环境，还需要给静态资源配置 CDN 的。通过 COS 控制台已经可以很方便的配置 CDN 加速域名了。但是还是需要手动去配置，作为一名懒惰的程序员，我还是不能接受的。 而 Http 组件正好提供了给静态资源配置 CDN 的能力，只需要在 `serverless.yml` 中新增 `assets.cdn` 配置即可，如下所示：

```yaml
# 此处省略....
inputs:
  # 此处省略....

  # 静态资源相关配置
  assets:
    cos:
      # 这里是创建的 COS 桶名称
      bucket: serverless-nextjs
    cdn:
      domain: static.test.yuga.chat
      https:
        certId: abcdefg
```

这里使用 `https` 协议，所以也添加了 `https` 的 `certId` 证书 ID 配置。此外静态资源域名也需要修改为 CDN 域名，修改 `next.config.js` 如下：

```js
const isProd = process.env.NODE_ENV === "production";
const STATIC_URL = "https://static.test.yuga.chat";
module.exports = {
  env: {
    STATIC_URL: isProd ? STATIC_URL : "http://localhost:3000",
  },
  assetPrefix: isProd ? STATIC_URL : "",
};
```

配置好后，再次执行部署，结果如下：

```bash
$ serverless deploy

serverless ⚡framework
Action: "deploy" - Stage: "dev" - App: "appDemo" - Instance: "nextjsDemo"

region:    ap-guangzhou
apigw:
  # 省略...
faas:
  # 省略...
assets:
  cos:
    region:    ap-guangzhou
    cosOrigin: serverless-nextjs-xxx.cos.ap-guangzhou.myqcloud.com
    bucket:    serverless-nextjs-xxx
    url: https://sls-cloudfunction-ap-guangzhou-code-xxxxx.cos.ap-guangzhou.myqcloud.com
  cdn:
    domain: static.test.yuga.chat
    url:    https://static.test.yuga.chat
```

> 注意：这里虽然添加了 CDN 域名，但是还是需要手动配置 CNAME `static.test.yuga.chat.cdn.dnsv1.com` 解析记录。

## 优化前后对比

到这里，Serverless Next.js 应用体验已经优化了很多，我们可以使用 `Lighthouse` 进行性能测试，来验证下我们的收获。测试结果如下：

优化前：

![Before Next.js Optimization](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-09-deploy-nextjs-gracely-5.png)

优化后：

![After Next.js Optimization](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-09-deploy-nextjs-gracely-6.png)

前后对比，可以明显看出优化效果，当然这里主要是针对静态资源进行了优化处理，减少了冷启动。为了更好地优化体验，我们还可以做的更多，这里就不展开讨论了。

## 基于 Layer 部署 node_modules

随着我们的业务变得复杂，项目体积会越来越大，node_modules 文件夹也会变得原来越大，而现在每次部署都需要将 node_modules 打包压缩，然后上传，跟业务代码一起部署到云函数。在实际开发中， `node_modules` 大部分时候是不怎么变化的，但是当前每次都需要上传，这必然会浪费很多部署时间，尤其在网络状态不好的情况下，代码上传就更慢了。

既然 `node_modules` 文件夹是不怎么变更的，那么我们能不能只有在它变化时才上传更新呢？

借助 [Layer](https://cloud.tencent.com/document/product/583/40159) 的能力是可以实现的。

在这之前，先简单介绍下 Layer:

> 借助 Layer，可以将项目依赖放在 Layer 中而无需部署到云函数代码中。函数在执行前，会先加载 Layer 中的文件到 `/opt` 目录下（云函数代码会挂载到 `/var/user/` 目录下），同时会将 `/opt` 和 `/opt/node_modules` 添加到 `NODE_PATH` 中，这样即使云函数中没有 `node_modules` 文件夹，也可以通过 `require('abc')` 方式引入使用该模块。

正好 [Layer 组件](https://github.com/serverless-components/tencent-layer) 可以帮助我们自动创建 `Layer`。

使用时只需要在项目下添加 `layer` 文件夹，并且创建 `layer/serverless.yml` 配置如下：

```yaml
org: orgDemo
app: appDemo
stage: dev
component: layer
name: nextjsDemo-layer

inputs:
  region: ap-guangzhou
  name: ${name}
  src: ../node_modules
  runtimes:
    - Nodejs10.15
    - Nodejs12.16
```

配置说明:

> **region**：地区，需要跟云函数保持一致
> **name**：Layer 名称，在云函数绑定指定 Layer 时需要指定
> **src**：指定需要上传部署到 Layer 的目录
> **runtimes**：支持的云函数运行环境

执行部署 Layer 命令:

```bash
$ serverless deploy --target=./layer

serverless ⚡framework
Action: "deploy" - Stage: "dev" - App: "appDemo" - Instance: "nextjsDemo-layer"

region:      ap-guangzhou
name:        nextjsDemo-layer
bucket:      sls-layer-ap-guangzhou-code
object:      nextjsDemo-layer-xxx.zip
description: Layer created by serverless component
runtimes:
  - Nodejs10.15
  - Nodejs12.16
version:     1
```

从输出可以清晰看到 Layer 组件已经帮助我们自动创建了一个名称为 `nextjsDemo-layer`，版本为 `1` 的 Layer。

接下来我们如何自动和我们的 Next.js 云函数绑定呢？

参考 [serverless components outputs 说明文档](https://github.com/serverless/components#outputs) ，可以通过引用一个基于 Serverless Components 部署成功的实例的 `outputs` (这里就是控制台输出对象内容)，语法如下：

```
# Syntax
${output:[stage]:[app]:[instance].[output]}
```

那么我们只需要在项目根目录的 `serverless.yml` 文件中，添加 `layers` 配置就可以了：

```yaml
org: orgDemo
app: appDemo
stage: dev
component: nextjs
name: nextjsDemo

inputs:
  src:
    dist: ./
    hook: npm run build
    exclude:
      - .env
      - "node_modules/**"
  faas:
    runtime: Nodejs12.16
    framework: nextjs
    name: '${name}'
    layers:
      - name: ${output:${stage}:${app}:${name}-layer.name}
        version: ${output:${stage}:${app}:${name}-layer.version}
  # 静态资源相关配置
  # 此处省略....
```

> 注意：不同组件部署实例结果的依赖使用，需要保证 serverless.yml 中 `org,app,stage` 三个配置是一致的。

由于 `node_modules` 已经通过 Layer 部署，所以还需要在 `src.exclude` 中添加忽略部署该文件夹。

之后再次执行部署命令 `serverless deploy` 即可， 你会发现这次部署时间大大缩减了，因为我们不在需要每次压缩上传 `node_moduels` 这个庞大的文件夹了 (_^▽^_)

## 最后

关于 Serverless SSR 的方案，我也在不断尝试和探索中，如果你有更好的方案和建议，欢迎评论或者私信来撩~

