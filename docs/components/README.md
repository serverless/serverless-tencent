---
title: "框架和SaaS应用开发"
menuText: "框架和SaaS应用开发"
layout: Doc
---

## 框架应用开发

通过 Serverless 可以快速进行框架应用开发， 开发者可以使用 Serverless 进行框架应用（如：Express，Next.js, Flask, Laraval 等）的开发，Serverless 可以轻松配置云函数所依赖的其他云设施，并且还支持本地和远程调试，日志查看以及一键部署。

> 目前框架应用开发支持框架有：Express, Koa, egg, Next.js, Nuxt.js, nest, Flask, Django, Laravel, ThinkPHP。更多的运行时会在未来逐步添加。

## 静态站点与服务端应用

Serverless 同腾讯云一起提供了 `website`组件和 `http` 组件供开发者进行静态网站部署及框架应用开发。

- `website` 组件可以将框架开发的静态网站部署到腾讯云的 COS 并使用 CDN 进行加速，同时也可以轻松配置 SSL 证书。
- `http` 组件可以通过很少的改动，将框架应用部署为 Serverless 应用，目前支持的开发框架有
  - [x] `express` : 查看[腾讯 Express 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/express)
  - [x] `koa` : 查看[腾讯 Koa 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/koa)
  - [x] `egg` : 查看[腾讯 egg 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/egg)
  - [x] `nextjs` : 查看[腾讯 Next.js 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/nextjs)
  - [x] `nuxtjs` : 查看[腾讯 Nuxt.js 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/nuxtjs)
  - [x] `nestjs` : 查看[腾讯 nest 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/nestjs)
  - [x] `flask` : 查看[腾讯 Flask 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/flask)
  - [x] `django` : 查看[腾讯 Django 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/django)
  - [x] `laravel` : 查看[腾讯 Laravel 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/laravel)
  - [x] `thinkphp` : 查看[腾讯 ThinkPHP 框架应用示例](https://github.com/serverless-components/tencent-http/tree/master/examples/thinkphp)

## SaaS 应用开发

Serverless 同腾讯云一起提供了众多 SaaS 应用组件，可以快速部署一个开源软件服务进行使用，目前可以部署的 SaaS 软件有

- [x] `Wordpress` : 查看[腾讯 Wordpress 应用示例](https://github.com/serverless-components/tencent-wordpress/tree/master/example) 或 [腾讯 Wordpress 全量配置](https://github.com/serverless-components/tencent-wordpress/blob/master/docs/configure.md)
- [x] `Discuz-Q` : 查看[腾讯 Discuz-Q 框架应用示例](https://github.com/serverless-components/tencent-discuzq/tree/main/example) 或 [腾讯 Discuz-Q 全量配置](https://github.com/serverless-components/tencent-discuzq/blob/main/docs/configure.md)

**下一步：开始组件开发**

- [静态网站开发](./website)
- [框架应用开发](./http)
- [SaaS 应用部署](./saas)
- [Serverless CLI 命令](../quickstart/commands)
