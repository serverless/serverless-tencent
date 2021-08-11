---
title: "Python 函数应用开发"
menuText: "Python 函数应用开发"
layout: Doc
---

# Python 函数应用开发
目前支持的 Python 开发语言包括如下版本：

- Python 2.7
- Python 3.6

## 定义函数

Python 环境下的入参包括 event 和 context，两者均为 Python dict 类型。

event：使用此参数传递触发事件数据。
context：使用此参数向您的处理程序传递运行时信息。

```py
import json

def main_handler(event, context):
    print("Received event: " + json.dumps(event, indent = 2))
    print("Received context: " + str(context))
    return("Hello World")
```

### 返回和异常

您的处理程序可以使用 return 来返回值，根据调用函数时的调用类型不同，返回值会有不同的处理方式。

同步调用：使用同步调用时，返回值会序列化后以 JSON 的格式返回给调用方，调用方可以获取返回值已进行后续处理。例如通过控制台进行的函数调试的调用方法就是同步调用，能够在调用完成后捕捉到函数返回值并显示。
异步调用：异步调用时，由于调用方法仅触发函数就返回，不会等待函数完成执行，因此函数返回值会被丢弃。
同时，无论同步调用还是异步调用，返回值均会在函数日志中 ret_msg 位置显示。

您可以在函数内使用 raise Exception 的方式抛出异常。抛出的异常会在函数运行环境中被捕捉到并在日志中以 Traceback 的形式展示。

## 日志

您可以在程序中使用 print 或使用 logging 模块来完成日志输出。例如，如下函数：

```py
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
def main_handler(event, context):
    logger.info('got event{}'.format(event))
    print("got event{}".format(event))
    return 'Hello World!'
```

输出内容您可以在函数日志中的 log 位置查看。

## 依赖库

### 使用内建的库

目前包含的库请参考[腾讯云说明文档](https://cloud.tencent.com/document/product/583/55592#.E5.86.85.E7.BD.AE.E7.9A.84.E5.BA.93.E5.88.97.E8.A1.A8)

### 使用自定义库

目前仅支持将自定义的本地库打包上传的使用方式。

