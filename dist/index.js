"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const parser = require("cron-parser");
const human = require("human-interval");
function main(cnf, deps) {
    const { cron = {} } = cnf;
    const ciaTaskType = "cronJob";
    const { cia } = deps;
    const { tz = "Asia/Shanghai" } = cron;
    // 注册信息
    const registed = {};
    // 是否已经启动, 记录的是启动时间
    let startedAt;
    // 计算具体下次执行还有多少毫秒
    const calcNextMS = (intervalStr) => {
        const interval = human(intervalStr) || parser.parseExpression(intervalStr, { tz });
        if (typeof interval === "number")
            return interval;
        //  *    *    *    *    *    *
        //  ┬    ┬    ┬    ┬    ┬    ┬
        //  │    │    │    │    │    |
        //  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
        //  │    │    │    │    └───── month (1 - 12)
        //  │    │    │    └────────── day of month (1 - 31, L)
        //  │    │    └─────────────── hour (0 - 23)
        //  │    └──────────────────── minute (0 - 59)
        //  └───────────────────────── second (0 - 59, optional)
        return interval.next().getTime() - Date.now();
    };
    // 触发
    const trigger = (name) => {
        const opt = registed[name];
        let timeoutMS = calcNextMS(opt.intervalStr);
        if (opt.times === 0 && opt.startAt) {
            // 第一次
            const startAt = human(opt.startAt);
            if (!startAt)
                throw Error("startAt 定义不合法");
            timeoutMS = startAt;
        }
        setTimeout(() => {
            opt.times += 1;
            opt.triggeredAt = Date.now();
            cia.submit(`Cron::${name}`, opt.times, ({ cronJob: [err, , totalMS] }) => {
                if (err) {
                    opt.failds += 1;
                }
                else {
                    opt.dones += 1;
                    opt.totalMS += totalMS;
                }
                trigger(name);
            });
        }, timeoutMS);
    };
    // name string 任务名称
    // interval string | number 任务执行间隔
    // startAt string 任务开始于
    const regist = (name, intervalStr, startAt) => {
        if (startedAt)
            throw Error("计划任务系统已经启动，禁止注册");
        if (registed[name])
            throw Error(`Same name cron has been registed: ${name}`);
        // 写入到注册变量上去。后续持续执行需要用到
        registed[name] = {
            times: 0,
            dones: 0,
            failds: 0,
            totalMS: 0,
            triggeredAt: 0,
            intervalStr,
            startAt,
        };
        // 注册到cia上, 为了借助cia的能力自动下发任务
        // 增加 Cron:: 前缀是为了避免和其他任务名称冲突
        cia.regist(`Cron::${name}`, null, [{ type: ciaTaskType }]);
    };
    const start = () => {
        if (startedAt)
            throw Error("已经启动，不能重复启动");
        startedAt = new Date();
        for (const name of Object.keys(registed))
            trigger(name);
    };
    const getStats = () => {
        const stats = [];
        for (const name of Object.keys(registed)) {
            const { times, dones, failds, totalMS } = registed[name];
            const avgMS = dones ? totalMS / dones : null;
            stats.push({ name, times, dones, failds, totalMS, avgMS });
        }
        return stats;
    };
    return { regist, start, getStats };
}
exports.main = main;
main.Deps = ["cia"];
