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
interface Deps {
    cia: {
        regist: (name: string, validator: any, waiters: waiter[]) => void;
        submit: (name: string, count: number, callback: any) => void;
    };
}
interface Registed {
    [propName: string]: {
        count: number;
        triggeredAt: number;
        intervalStr: string;
        startAt?: string;
    };
}
export declare function main(cnf: Cnf, deps: Deps): {
    regist: (name: string, intervalStr: string, startAt: string) => void;
    start: () => void;
    getStats: () => Registed;
};
export declare namespace main {
    var Deps: string[];
}
export {};
