import { type EventEmitter } from 'node:events';

export const DEFAULTS = {
    debug: false,
    listen: {
        address: 'localhost',
        port: 38281,
    },
};

export interface Config {
    debug: boolean,
    url: string;
    listen: {
        address: string;
        port: number;
    };
}

export interface Logger {
    debug(...data: any[]): void;
    log(...data: any[]): void;
    error(...data: any[]): void;
}

export interface Client extends EventEmitter<{
    'close': [],
    'message': [string],
}> {
    ready(): Promise<void>
    send(data: string): Promise<void>;
    close(): void;
}

export interface Connection extends EventEmitter<{
}> {
    send(data: string): Promise<void>;
    close(): void;
}

export interface Server extends EventEmitter<{
    'connection': [Connection],
}> {
}
