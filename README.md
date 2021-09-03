# @domain.js/cron cron encode and decode functions for domain.js internal

[![Build status](https://travis-ci.com/domain-js/cron.svg?branch=master)](https://travis-ci.com/domain-js/cron)
[![codecov](https://codecov.io/gh/domain-js/cron/branch/master/graph/badge.svg)](https://codecov.io/gh/domain-js/cron)

# Installation
<pre>npm i @domain.js/cron --save</pre>

# cnf
专属配置名称 `cron`
| 名称 | 类型 | 必填 | 默认值 | 描述 | 样例 |
| ---- | ---- | ---- | ------ | ---- | ---- |
| tz | string | `否` | `Asia/Beijing` | 时区设置，在linux风格的时刻表会用到 | Europe/London |

# deps
| 模块名 | 别名 | 用到的方法 | 描述 |
| ------ | ---- | ---------- | ---- |
| cia | `无` | `regist`, `link`, `submit` | @domain.js/cia 模块 |


# Usage

```javascript
const Cron = require('@domain.js/cron');

const cia = Cia(); // cia 模块初始化, 这里是伪代码
const cron = Cron({ cron: { tz: 'Asia/Beijing' } }, { cia });
// 计划任务注册 cron.regist(/* 任务名称 */, /* 时间间隔或时刻表 */, /* 第一次开始与进程启动后多久 */);
cron.regist('上厕所', '2 hours', '1 hours'); // 每个两小时上一次测试，进程启动后一个小时执行第一次
cron.regist('吃早饭', '0 20 07 * * *'); // 每天早上七点二十分吃早餐

// 注册完毕后，启动计划任务, 启动以后禁止注册
cron.start();

// 检测触发，执行对应任务, 这里利用了 cia 的能力
cia.link(`Cron::上厕所`, 'cronJob', (times) => {
  // 上厕所，嘘嘘 第 ${times} 次
});

cia.link(`Cron::吃早饭`, 'cronJob', (times) => {
  // 上早饭 第 ${times} 次
});

// 获取计划任务执行统计
cron.getStats();
```

