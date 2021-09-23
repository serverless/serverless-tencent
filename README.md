## CLI 命令列表

### `serverless registry`

查看可用的 组件（Components）以及模板（Template） 列表

### `serverless publish`

发布组件（Components）或者模板（Template） 到 Serverless 注册中心

`--dev` - 支持 dev 参数用于发布 `@dev` 版本的 Component，用于开发或测试，此参数仅对组件有效，对模板无效，模板没有版本的概念。

### `serverless init`

选择一个模板初始化项目

### `serverless deploy`

部署一个 Component 实例到云端

`--debug` - 列出组件部署过程中 `console.log()` 输出的部署操作和状态等日志信息。

### `serverless remove`

从云端移除一个 Component 实例

`--debug` - 列出组件移除过程中 `console.log()` 输出的移除操作和状态等日志信息。

### `serverless info`

获取并展示一个 Component 实例的相关信息

`--debug` - 列出更多 `state`.

### `serverless dev`

启动 DEV MODE 开发者模式，通过检测 Component 的状态变化，自动部署变更信息。同时支持在命令行中实时输出运行日志，调用信息和错误等。此外，支持对 Node.js 应用进行云端调试。

### `serverless logs`

获取实例的运行日志

### `serverless invoke`

命令行对已部署实例进行调用

### `serverless invoke local`

命令行对代码进行本地调用

### `serverless version`

查看当前使用的 `serverless-tencent-plugin` 的版本

### `serverless credentials`

设置 腾讯云全局认证信息

#### `serverless credentials set`

认证信息设置

#### `serverless credentials remove`

认证信息删除

#### `serverless credentilas list`

列出当前已设置的认证信息

### `serverless help`, `serverless xxxx --help`

输出全局帮助信息，以及具体某一命令的具体参数和帮助信息

### `serverless <command> --inputs key=value foo=bar`

在运行命令时覆盖 `serverless.yml` 中的 inputs

例子:

```
# 简单的例子
serverless test --inputs domain=serverless.com
# 传递对象: 使用 JSON 格式
serverless invoke --inputs env='{"LANG": "en"}'
# 传递 Array: 用逗号分隔
serverless backup --inputs userIds=foo,bar
```
