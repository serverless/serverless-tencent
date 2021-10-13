---
title: "Tencent Serverless - MPS 视频处理"
menuText: "MPS 视频处理"
menuOrder: 7
description: MPS 视频处理
layout: Doc
---

# MPS 视频处理

视频处理（Media Processing Service，MPS）是针对海量多媒体数据，提供的云端转码和音视频处理服务。您可以编写云函数来处理 MPS 中的回调信息，通过接收相关回调帮助转储、投递和处理视频任务中的相关事件与后续内容。更多细节请看定[腾讯MPS 触发器](https://cloud.tencent.com/document/product/583/50833)文档。

```yml
events: # 触发器
  - mps: # mps 触发器
        parameters:
          qualifier: '$DEFAULT' # 别名配置
          type: EditMediaTask # 事件类型
          enable: true
```

```yml
triggers:
  - type: mps
      function: index
      parameters:
        type: EditMediaTask # 事件类型
        enable: true
```

## 配置说明

通常 MPS 触发器配置包含以下字段，具体的字段和配置方式请参考[单函数组件(scf)](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#mps-%E8%A7%A6%E5%8F%91%E5%99%A8)和[多函数组件(multi-scf)](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md#mps-%E8%A7%A6%E5%8F%91%E5%99%A8)的全量配置说明文档。

| 参数名称  | 必选 | 类型    | 默认值     | 描述                                                         |
| --------- | ---- | ------- | ---------- | ------------------------------------------------------------ |
| qualifier | 否   | string  | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`                   |
| type      | 是   | string  |            | 事件类型。`WorkflowTask - 工作流任务`，`EditMediaTask - 视频编辑任务` |
| enable    | 否   | boolean | `false`    | 触发器是否启用                                               |

> 注意：添加 MPS 触发器，需要给 `SLS_QcsRole` 添加 `QcloudMPSFullAccess` 策略。

## MPS 事件入参

在指定的 MPS 触发器接收到消息时，事件结构与字段以 WorkflowTask 为例，示例如下：

```json
{
  "EventType":"WorkflowTask",
  "WorkflowTaskEvent":{
      "TaskId":"245****654-WorkflowTask-f46dac7fe2436c47******d71946986t0",
      "Status":"FINISH",
      "ErrCode":0,
      "Message":"",
      "InputInfo":{
          "Type":"COS",
          "CosInputInfo":{
              "Bucket":"macgzptest-125****654",
              "Region":"ap-guangzhou",
              "Object":"/dianping2.mp4"
          }
      },
      "MetaData":{
          "AudioDuration":11.261677742004395,
          "AudioStreamSet":[
              {
                  "Bitrate":127771,
                  "Codec":"aac",
                  "SamplingRate":44100
              }
          ],
          "Bitrate":2681468,
          "Container":"mov,mp4,m4a,3gp,3g2,mj2",
          "Duration":11.261677742004395,
          "Height":720,
          "Rotate":90,
          "Size":3539987,
          "VideoDuration":10.510889053344727,
          "VideoStreamSet":[
              {
                  "Bitrate":2553697,
                  "Codec":"h264",
                  "Fps":29,
                  "Height":720,
                  "Width":1280
              }
          ],
          "Width":1280
      },
      "MediaProcessResultSet":[
          {
              "Type":"Transcode",
              "TranscodeTask":{
                  "Status":"SUCCESS",
                  "ErrCode":0,
                  "Message":"SUCCESS",
                  "Input":{
                      "Definition":10,
                      "WatermarkSet":[
                          {
                              "Definition":515247,
                              "TextContent":"",
                              "SvgContent":""
                          }
                      ],
                      "OutputStorage":{
                          "Type":"COS",
                          "CosOutputStorage":{
                              "Bucket":"gztest-125****654",
                              "Region":"ap-guangzhou"
                          }
                      },
                      "OutputObjectPath":"/dasda/dianping2_transcode_10",
                      "SegmentObjectName":"/dasda/dianping2_transcode_10_{number}",
                      "ObjectNumberFormat":{
                          "InitialValue":0,
                          "Increment":1,
                          "MinLength":1,
                          "PlaceHolder":"0"
                      }
                  },
                  "Output":{
                      "OutputStorage":{
                          "Type":"COS",
                          "CosOutputStorage":{
                              "Bucket":"gztest-125****654",
                              "Region":"ap-guangzhou"
                          }
                      },
                      "Path":"/dasda/dianping2_transcode_10.mp4",
                      "Definition":10,
                      "Bitrate":293022,
                      "Height":320,
                      "Width":180,
                      "Size":401637,
                      "Duration":11.26200008392334,
                      "Container":"mov,mp4,m4a,3gp,3g2,mj2",
                      "Md5":"31dcf904c03d0cd78346a12c25c0acc9",
                      "VideoStreamSet":[
                          {
                              "Bitrate":244608,
                              "Codec":"h264",
                              "Fps":24,
                              "Height":320,
                              "Width":180
                          }
                      ],
                      "AudioStreamSet":[
                          {
                              "Bitrate":48414,
                              "Codec":"aac",
                              "SamplingRate":44100
                          }
                      ]
                  }
              },
              "AnimatedGraphicTask":null,
              "SnapshotByTimeOffsetTask":null,
              "SampleSnapshotTask":null,
              "ImageSpriteTask":null
          },
          {
              "Type":"AnimatedGraphics",
              "TranscodeTask":null,
              "AnimatedGraphicTask":{
                  "Status":"FAIL",
                  "ErrCode":30010,
                  "Message":"TencentVodPlatErr Or Unkown",
                  "Input":{
                      "Definition":20000,
                      "StartTimeOffset":0,
                      "EndTimeOffset":600,
                      "OutputStorage":{
                          "Type":"COS",
                          "CosOutputStorage":{
                              "Bucket":"gztest-125****654",
                              "Region":"ap-guangzhou"
                          }
                      },
                      "OutputObjectPath":"/dasda/dianping2_animatedGraphic_20000"
                  },
                  "Output":null
              },
              "SnapshotByTimeOffsetTask":null,
              "SampleSnapshotTask":null,
              "ImageSpriteTask":null
          },
          {
              "Type":"SnapshotByTimeOffset",
              "TranscodeTask":null,
              "AnimatedGraphicTask":null,
              "SnapshotByTimeOffsetTask":{
                  "Status":"SUCCESS",
                  "ErrCode":0,
                  "Message":"SUCCESS",
                  "Input":{
                      "Definition":10,
                      "TimeOffsetSet":[
                       ],
                      "WatermarkSet":[
                          {
                              "Definition":515247,
                              "TextContent":"",
                              "SvgContent":""
                          }
                      ],
                      "OutputStorage":{
                          "Type":"COS",
                          "CosOutputStorage":{
                              "Bucket":"gztest-125****654",
                              "Region":"ap-guangzhou"
                          }
                      },
                      "OutputObjectPath":"/dasda/dianping2_snapshotByOffset_10_{number}",
                      "ObjectNumberFormat":{
                          "InitialValue":0,
                          "Increment":1,
                          "MinLength":1,
                          "PlaceHolder":"0"
                      }
                  },
                  "Output":{
                      "Storage":{
                          "Type":"COS",
                          "CosOutputStorage":{
                              "Bucket":"gztest-125****654",
                              "Region":"ap-guangzhou"
                          }
                      },
                      "Definition":0,
                      "PicInfoSet":[
                          {
                              "TimeOffset":0,
                              "Path":"/dasda/dianping2_snapshotByOffset_10_0.jpg",
                              "WaterMarkDefinition":[
                                  515247
                              ]
                          }
                      ]
                  }
              },
              "SampleSnapshotTask":null,
              "ImageSpriteTask":null
          },
          {
              "Type":"ImageSprites",
              "TranscodeTask":null,
              "AnimatedGraphicTask":null,
              "SnapshotByTimeOffsetTask":null,
              "SampleSnapshotTask":null,
              "ImageSpriteTask":{
                  "Status":"SUCCESS",
                  "ErrCode":0,
                  "Message":"SUCCESS",
                  "Input":{
                      "Definition":10,
                      "OutputStorage":{
                          "Type":"COS",
                          "CosOutputStorage":{
                              "Bucket":"gztest-125****654",
                              "Region":"ap-guangzhou"
                          }
                      },
                      "OutputObjectPath":"/dasda/dianping2_imageSprite_10_{number}",
                      "WebVttObjectName":"/dasda/dianping2_imageSprite_10",
                      "ObjectNumberFormat":{
                          "InitialValue":0,
                          "Increment":1,
                          "MinLength":1,
                          "PlaceHolder":"0"
                      }
                  },
                  "Output":{
                      "Storage":{
                          "Type":"COS",
                          "CosOutputStorage":{
                              "Bucket":"gztest-125****654",
                              "Region":"ap-guangzhou"
                          }
                      },
                      "Definition":10,
                      "Height":80,
                      "Width":142,
                      "TotalCount":2,
                      "ImagePathSet":[
                          "/dasda/imageSprite/dianping2_imageSprite_10_0.jpg"
                      ],
                      "WebVttPath":"/dasda/imageSprite/dianping2_imageSprite_10.vtt"
                  }
              }
          }
      ]
  }
}
```
### WorkflowTask 事件
WorkflowTask 事件消息体详细字段如下：

```json
{
   "EventType":"WorkflowTask",
   "WorkflowTaskEvent":{
       // WorkflowTaskEvent 字段
    }
}
```
WorkflowTask 数据结构及字段内容详细说明：

| 名称                     | 类型                                                         | 描述                                                         |
| :----------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| TaskId                   | String                                                       | 视频处理任务 ID。                                            |
| Status                   | String                                                       | 任务流状态，取值如下： PROCESSING：处理中。 FINISH：已完成。 |
| ErrCode                  | Integer                                                      | 已弃用，请使用各个具体任务的 ErrCode。                       |
| Message                  | String                                                       | 已弃用，请使用各个具体任务的 Message。                       |
| InputInfo                | [MediaInputInfo](https://cloud.tencent.com/document/api/862/37615#MediaInputInfo) | 视频处理的目标文件信息。注意：此字段可能返回 null，表示取不到有效值。 |
| MetaData                 | [MediaMetaData](https://cloud.tencent.com/document/api/862/37615#MediaMetaData) | 原始视频的元信息。注意：此字段可能返回 null，表示取不到有效值。 |
| MediaProcessResultSet    | Array of [MediaProcessTaskResult](https://cloud.tencent.com/document/api/862/37615#MediaProcessTaskResult) | 视频处理任务的执行状态与结果。                               |
| AiContentReviewResultSet | Array of [AiContentReviewResult](https://cloud.tencent.com/document/api/862/37615#AiContentReviewResult) | 视频内容审核任务的执行状态与结果。                           |
| AiAnalysisResultSet      | Array of [AiAnalysisResult](https://cloud.tencent.com/document/api/862/37615#AiAnalysisResult) | 视频内容分析任务的执行状态与结果。                           |
| AiRecognitionResultSet   | Array of [AiRecognitionResult](https://cloud.tencent.com/document/api/862/37615#AiRecognitionResult) | 视频内容识别任务的执行状态与结果。                           |

### EditMediaTask 事件

```json
{
   "EventType":"EditMediaTask",
   "EditMediaTaskEvent":{
       // EditMediaTask 字段
    }
}
```

EditMediaTask 数据结构及字段内容详细说明：

| 名称    | 类型                                                         | 描述                                                         |
| :------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| TaskId  | String                                                       | 任务 ID。                                                    |
| Status  | String                                                       | 任务状态，取值如下： PROCESSING：处理中。 FINISH：已完成。   |
| ErrCode | Integer                                                      | 错误码0：成功；其他值：失败。                                |
| Message | String                                                       | 错误信息。                                                   |
| Input   | [EditMediaTaskInput](https://cloud.tencent.com/document/api/862/37615#EditMediaTaskInput) | 视频编辑任务的输入。                                         |
| Output  | [EditMediaTaskOutput](https://cloud.tencent.com/document/api/862/37615#EditMediaTaskOutput) | 视频编辑任务的输出。注意：此字段可能返回 null，表示取不到有效值。 |