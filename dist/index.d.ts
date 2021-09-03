interface Cnf {
    cron?: {
        tz?: string;
    };
}
interface waiter {
    type: string;
    timeout?: number;
    validator?: any;
}
interface callbackArg {
    cronJob: [Error | null, any, number];
}
interface Deps {
    cia: {
        regist: (name: string, validator: any, waiters: waiter[]) => void;
        submit: (name: string, times: number, callback: (arg: callbackArg) => void) => void;
    };
}
export declare function main(cnf: Cnf, deps: Deps): {
    regist: (name: string, intervalStr: string, startAt: string) => void;
    start: () => void;
    getStats: () => {
        name: string;
        times: number;
        dones: number;
        failds: number;
        totalMS: number;
        avgMS: number | null;
    }[];
};
export declare namespace main {
    var Deps: string[];
}
export {};
