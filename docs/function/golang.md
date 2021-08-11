---
title: "Golang 函数应用开发"
menuText: "Golang 函数应用开发"
layout: Doc
---

# Golang 函数应用开发
目前 腾讯 SCF 对于支持的 Golang 运行时有

- Golang 1.8 及以上版本

## 定义函数

```go
package main

import (
    "context"
    "fmt"
    "github.com/tencentyun/scf-go-lib/cloudfunction"
)

type DefineEvent struct {
    // test event define
    Key1 string `json:"key1"`
    Key2 string `json:"key2"`
}

func hello(ctx context.Context, event DefineEvent) (string, error) {
    fmt.Println("key1:", event.Key1)
    fmt.Println("key2:", event.Key2)
    return fmt.Sprintf("Hello %s!", event.Key1), nil
}

func main() {
    // Make the handler available for Remote Procedure Call by Cloud Function
    cloudfunction.Start(hello)
}
```

代码开发时，请注意以下几点：

需要使用 package main 包含 main 函数。
引用 github.com/tencentyun/scf-go-lib/cloudfunction 库，在编译打包之前，执行 go get github.com/tencentyun/scf-go-lib/cloudfunction。
入口函数入参可选 0 - 2 参数，如包含参数，需 context 在前，event 在后，入参组合有 （），（event），（context），（context，event），具体说明请参见 入参。
入口函数返回值可选 0 - 2 参数，如包含参数，需返回内容在前，error 错误信息在后，返回值组合有 （），（ret），（error），（ret，error），具体说明请参见 返回值。
入参 event 和返回值 ret，均需要能够兼容 encoding/json 标准库，可以进行 Marshal、Unmarshal。
在 main 函数中使用包内的 Start 函数启动入口函数。

### package 与 main 函数

在使用 Golang 开发云函数时，需要确保 main 函数位于 main package 中。在 main 函数中，通过使用 cloudfunction 包中的 Start 函数，启动实际处理业务的入口函数。

通过 `import "github.com/tencentyun/scf-go-lib/cloudfunction"`，可以在 main 函数中使用包内的 Start 函数。

### 入口函数

入口函数为通过 cloudfunction.Start 来启动的函数，通常通过入口函数来处理实际业务。入口函数的入参和返回值都需要根据一定的规范编写。

### 入参

入口函数可以带有 0 - 2 个入参，例如：

```go
func hello()
func hello(ctx context.Context)
func hello(event DefineEvent)
func hello(ctx context.Context, event DefineEvent)
```

在带有 2 个入参时，需要确定 context 参数在前，自定义参数在后。

自定义参数可以为 Golang 自带基础数据结构，例如 string，int，也可以为自定义的数据结构，如示例中的 DefineEvent。在使用自定义的数据结构时，需要确定数据结构可以兼容 encoding/json 标准库，可以进行 Marshal、Unmarshal 操作，否则在送入入参时会因为异常而出错。

自定义数据结构对应的 JSON 结构，通常与函数执行时的入参对应。在函数调用时，入参的 JSON 数据结构将会转换为自定义数据结构变量并传递和入口函数。

### 返回值

入口函数可以带有 0 - 2 个返回值，例如：

```go
func hello()()
func hello()(error)
func hello()(string, error)
```

在定义 2 个返回值时，需要确定自定义返回值在前，error 返回值在后。

自定义返回值可以为 Golang 自带基础数据结构，例如 string，int，也可以为自定义的数据结构。在使用自定义的数据结构时，需要确定数据结构可以兼容 encoding/json 标准库，可以进行 Marshal、Unmarshal 操作，否则在返回至外部接口时会因为异常转换而出错。

自定义数据结构对应的 JSON 结构，通常会在函数调用完成返回时，在平台内转换为对应的 JSON 数据结构，作为运行响应传递给调用方函数。

## 日志

您可以在程序中使用 `fmt.Println` 或使用 `fmt.Sprintf` 类似方法完成日志输出。例如例子中的函数，将可以在日志中输出入参中 Key1，Key2 的值。

输出内容您可以在函数日志中的 `log` 位置查看。
