---
title: "前端组件应用开发"
menuText: "前端组件应用开发"
layout: Doc
---

# 前端组件应用开发

Serverless Framework 提供了许多流行前端组件来帮助前端使用 serverless 进行前端开发。目前提供的官方组件有

- 静态网站([static-website](https://github.com/serverless-components/tencent-examples/tree/master/website-starter)): 静态 HTML 网站项目  -- [配置说明](https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md)
- React 站点([react-starter](https://github.com/serverless-components/tencent-examples/tree/master/react-starter)): React + Parcel 静态页面模板 -- [配置说明](https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md)
- Vue 站点([vue-starter](https://github.com/serverless-components/tencent-examples/tree/master/vue-starter)): @vue/cli 初始化的静态页面模板 -- [配置说明](https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md)
- Next.js 站点([nextjs-starter](https://github.com/serverless-components/tencent-examples/tree/master/nextjs-starter)): Next.js 开发模板 -- [配置说明](https://github.com/serverless-components/tencent-nextjs/blob/master/docs/configure.md)
- Nuxt.js 站点([nuxtjs-starter](https://github.com/serverless-components/tencent-examples/tree/master/nuxtjs-starter)): Nuxt.js 开发模板 -- [配置说明](https://github.com/serverless-components/tencent-nuxtjs/blob/master/docs/configure.md)

使用 Serverless Framework 组件，大开发者得以在国内快速部署网站应用，并通过腾讯云的深度优化，让网站访问速度达到最优。

## 静态网站

静态网站通过在在构建时(如：当您运行 `npm run build` 命令时)渲染应用,并为每个路径生成一个 HTML 页面。这样构建的网站速度非常快，但无法处理动态内容。

### HTML 静态目录

在`serverless.yml`中可以通过指定 HTML 静态目录，和网站入口文件 (index.html)和错误入口文件(error.html)即可实现 HTML 站点部署。

```yml
# static-website 配置示例
inputs:
  src: # 路径配置
    src: ./src # 执行目录路径
    index: index.html # 网站主页入口文件
    error: error.html # 网站错误入口文件
    ...
```

### 构建网站

对于有构建网站步骤的开发流程，需要在`serverless.yml`路径配置中配置构建命令 hook 以及构建后的输出目录路径(具体参考使用框架的说明文档), 在部署之前 Serverless Framework 会自动使用该命令构建网站。

```yml
# nextjs, nuxtjs, react-starter, vue-starter 配置示例
inputs:
  src: # 路径配置
    src: ./src # 执行目录路径,可选，默认为项目根目录。
    hook: npm run build # 构建命令。在代码上传之前执行
    dist: ./dist # 输出的目录。如果配置 hook，此参数必填
```

## 动态网站

动态网站是在响应每个请求时，在服务器上渲染应用程序，然后将合成的 HTML 和 Javascript 发送回客户端。这样构建的网站可以动态处理内容，同时保证页面内容始终是最新的，但因为额外处理渲染加载速度会比较慢，同时无法通过 CDN 进行缓存加速。

### Nextjs + Express

如果你的项目是基于 express 自定义服务，则需要添加入口文件 `sls.js`, 并进行如下配置：

```js
const express = require("express");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

const noReportRoutes = ["/_next", "/static"];

async function createServer() {
  await app.prepare();
  const server = express();

  server.all("*", (req, res) => {
    noReportRoutes.forEach((route) => {
      if (req.path.indexOf(route) !== -1) {
        req.__SLS_NO_REPORT__ = true;
      }
    });
    return handle(req, res);
  });

  // 定义返回二进制文件类型
  // 由于 Next.js 框架默认开启 `gzip`，所以这里需要配合为 `['*/*']`
  // 如果项目关闭了 `gzip` 压缩，那么对于图片类文件，需要定制化配置，比如 `['image/jpeg', 'image/png']`
  server.binaryTypes = ["*/*"];

  return server;
}

module.exports = createServer;
```

### Nuxtjs + Express

如果你的项目是基于 express 自定义服务，则需要添加入口文件 `sls.js`, 并进行如下配置：

```js
const express = require("express");
const { loadNuxt } = require("nuxt");

async function createServer() {
  const noReportRoutes = ["/_nuxt", "/static", "/favicon.ico"];

  const server = express();
  const nuxt = await loadNuxt("start");

  server.all("*", (req, res, next) => {
    noReportRoutes.forEach((route) => {
      if (req.path.indexOf(route) === 0) {
        req.__SLS_NO_REPORT__ = true;
      }
    });
    return nuxt.render(req, res, next);
  });

  // 定义返回二进制文件类型
  // 由于 Next.js 框架默认开启 `gzip`，所以这里需要配合为 `['*/*']`
  // 如果项目关闭了 `gzip` 压缩，那么对于图片类文件，需要定制化配置，比如 `['image/jpeg', 'image/png']`
  server.binaryTypes = ["*/*"];

  return server;
}

module.exports = createServer;
```

## 使用 COS 托管静态资源

在网站开发中，往往需要存储非常多的静态资源，如，图片，视频，第三方的 js, css 文件等。通过使用 Serverless Framework 的 COS 组件可以快速管理维护这些资源。

<!-- next.js nuxt.js -->
<!-- vue, react -> website -->

要使用 COS 组件来管理网站静态资源在目录的 `serverless.yml` 文件的`inputs` 内添加`staticConf` 的 `cosConf` 配置， 更多配置请查看 [COS 对象存储](../infrastructure/cos) 中的说明和更多配置信息。

```yml
app: sls-my-nextjs # 这里需要保证app名称一致。
component: nextjs # 声明这里使用 cos 组件
name: my-nextjs-site # cos组件实例名称

inputs:
  # ...省略此处配置
  # staticConf: # 静态资源相关配置

  # cosConf:
  src: ./assets # 要上传或目录
  targetDir: / # 上传到存储桶的目标目录,默认为 /
  bucket: serverless-bucket # 存储桶名称
  region: ap-guangzhou # 存储桶所在地区
  protocol: https
  acl:
    permissions: public-read # 访问权限
  host: ...
  cdnConf:
```

静态资源配置成功后，可以通过 `<protocol>://<bucket-name>-<appid>.cos.<region>.myqcloud.com` 进行访问，在如上配置中的最终访问地址为 `https://serverless-bucket-1251556596.cos.ap-guangzhou.myqcloud.com`

> 以上信息可以通过 `sls info` 获取。

### Nextjs 配置

- src 配置成你的 next 项目构建的目标目录。 eg: `../.next/static`
- target 添加 `/_next/`, 因为 next 框架在访问静态文件会自动附加 `_next` 前缀。 eg: `/_next/static`

## 使用 CDN 加速

在网站开发中，可以通过使用 CDN 对静态资源进行加速，从而大幅提高网站的加载速度。通过使用 Serverless Framework 的 CND 组件可以域名 或者 COS 进行加速。

要使用 COS 组件来管理网站静态资源在目录的 `serverless.yml` 文件的`inputs` 内添加`staticConf` 的 `cdnConf` 配置，， 更多配置请查看 [CDN 内容分发](../infrastructure/cdn) 中的说明和更多配置信息。

```yml
app: sls-my-nextjs # 这里需要保证app名称一致。
component: nextjs # 声明这里使用 cos 组件
name: my-nextjs-site # cos组件实例名称

inputs:
  # ...省略此处配置
  staticConf: # 静态资源相关配置
    cosConf:
      # ...省略此处配置
    cdnConf:
      area: mainland # 域名加速区域
      domain: mysite.com # CDN 域名。
      origin: # 源站配置
        origins:
          - xxx.cos.ap-guangzhou.myqcloud.com #源站，可以是域名或 IP
        originType: cos # 源类型
        originPullProtocol: https
  serviceType: web # 加速业务类型，web 静态网站加速
```

> 配置了 CDN 之后，需要修改 CDN 域名的 CNAME 解析。

## 自定义域名

提供了 customDomains 来帮助开发者快速配置自定义域名，于是我们可以在项目的 serverless.yml 中新增如下配置

```yml
app: sls-my-nextjs # 这里需要保证app名称一致。
component: nextjs # 声明这里使用 cos 组件
name: my-nextjs-site # cos组件实例名称

inputs:
  # ...省略此处配置
  apigatewayConf:
    protocols:
      - https
    environment: release
    enableCORS: true
    customDomains: # 自定义域名相关配置
      - domain: www.mysite.com
        certificateId: abcdefg # 腾讯云证书 ID, 可以从腾讯云申请免费证书或者导入证书。
        pathMappingSet: # 将 API 网关的 release 环境映射到根路径
          - path: /
            environment: release
        protocols:
          - https
```

## 配置 SSL 证书

SSL 证书目前需要到腾讯云的[证书控制台](https://console.cloud.tencent.com/ssl)进行申请或导入。

**下一步：查看开发案例**

- [React静态站开发实例](../tutorial/fullstack)
- [查看Next.js静态站开发实例](../tutorial/frontend)
- [查看Nuxt.js动态站开发实例](../tutorial/backend)

