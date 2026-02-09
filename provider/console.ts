import { type Logger } from '../types.ts';

export class ConsoleLogger implements Logger {
    #debug: boolean;

    constructor(debug: boolean) {
        this.#debug = debug;
    }

    debug(...data: any[]): void {
        if (this.#debug) {
            console.debug(...data);
        }
    }

    log(...data: any[]): void {
        console.log(...data);
    }

    error(...data: any[]): void {
        console.error(...data);
    }
}
