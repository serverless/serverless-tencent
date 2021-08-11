# Serverless Tencent

Serverless Tencent 是 Serverless Framework 与腾讯云合作，基于组件（serverless components）为中国用户定制的 serverlss 开发完整解决方案。覆盖了开发编码、测试、部署等全生命周期，在保留 Serverless Framework 的特点和优势的同时更加切合中国用户的使用场景和习惯。

目前 Serverless Tencent 主要提供一下组件来满足不同使用场景的开发需要：

### SCF & Multi-SCF 组件

SCF 组件主要用于开发腾讯 SCF 云函数

* `scf` 组件提供了单一的云函数开发方案（每个实例暴露一个入口函数，可以用来进行简单功能开发）
* `multi-scf` 组件提供了多个云函数开发支持（每个实例可以暴露多个入口函数，可以用来开发 CURD 用例）

### HTTP 组件

HTTP 组件用来适配传统框架应用开发，目前支持的框架有

- [x] express
- [x] koa
- [x] egg
- [x] nextjs
- [x] nuxtjs
- [x] nestjs
- [x] flask
- [x] django
- [x] laravel
- [ ] thinkphp

### 其他 SaaS 组件

通过 SaaS 组件，可以快速部署一个开源软件服务进行使用，无需编辑维护。

- [x] Wordpress
- [ ] Discuz-Q

> 不同组件的配置方式不尽相同，具体的组件配置字段信息请查看对应组件的配置示例和说明。

|                    | scf 组件 | multi-scf 组件 | http 组件 |
| :----------------: | :------: | :------------: | :-------: |
|    VPC虚拟网络     |    ✅     |       ✅        |     ✅     |
|    Layer层部署     |    ✅     |       ✅        |     ✅     |
| DeadLetter死信队列 |    ✅     |       ✅        |     ❌     |
|    CLS函数日志     |    ✅     |       ✅        |     ❌     |
|    CFS文件系统     |    ✅     |       ✅        |     ❌     |
|    EVENT触发器     |    ✅     |       ✅        |     ❌     |
|    API网络网关     |    ✅     |       ✅        |     ✅     |
|      COS配置       |    ❌     |       ❌        |     ✅     |
|      CDN配置       |    ❌     |       ❌        |     ✅     |

>  关于 Serverless Framework 的任何使用问题、建议或者经验分享欢迎到 [Serverless 中文讨论社区](https://github.com/serverless/serverless-tencent/discussions) 分享讨论。同时使用中遇到的 bug 也欢迎通过 [BUG 反馈](https://github.com/serverless/serverless-tencent/issues/new/choose) 提交并追踪。

