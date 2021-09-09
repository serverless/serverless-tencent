---
title: "Tencent Serverless - Remove 移除"
menuText: "Remove 移除"
menuOrder: 6
description: 移除组件应用
layout: Doc
---

# remove 移除组件应用

移除应用

```sh
# 删除组件应用实例
$ sls remove

# 删除指定目录下的组件应用实例
$ sls remove --target ./src
```

## 命令选项

```sh
remove                    移除应用
    --stage / -s             指定环境名称，默认使用配置环境
    --target                 指定要移除的组件实例路径
    --profile                使用指定身份的全局授权信息
    --debug                  显示 debug 信息
```
