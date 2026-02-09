import EventEmitter from 'node:events';
import WebSocket, { WebSocketServer } from 'ws';
import { type Server, type Client, type Connection, type Logger } from '../types.ts';

export class WSClient extends EventEmitter implements Client {
    #logger: Logger;
    #socket: WebSocket;
    #ready: Promise<void>;

    constructor(url: string, logger: Logger) {
        super();

        this.#logger = logger;
        this.#socket = new WebSocket(url);

        const { promise, resolve } = Promise.withResolvers<void>();

        this.#ready = promise;

        this.#socket.addEventListener('open', () => {
            resolve();
        });

        this.#socket.addEventListener('close', () => {
            this.#ready = Promise.reject(new Error('Client closed'));
            this.emit('close');
        });

        this.#socket.addEventListener('message', (event) => {
            this.emit('message', event.data as string);
        });
    }

    ready(): Promise<void> {
        return this.#ready;
    }

    send(data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.#socket.send(data, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    close(): void {
        this.#socket.close()
    }
}

class WSConnection extends EventEmitter implements Connection {
    #socket: WebSocket

    constructor(socket: WebSocket) {
        super();

        this.#socket = socket;

        this.#socket.on('close', () => {
            this.emit('close');
        });

        this.#socket.on('message', (raw) => {
            this.emit('message', raw.toString('utf8'));
        });
    }

    send(data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.#socket.send(data, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    close(): void {
        this.#socket.close()
    }
}

export class WSServer extends EventEmitter implements Server {
    #logger: Logger;
    #server: WebSocketServer;

    constructor(listen: { address: string, port: number }, logger: Logger) {
        super();

        this.#logger = logger;
        this.#server = new WebSocketServer({
            host: listen.address,
            port: listen.port,
        });

        this.#server.on('connection', (connection) => {
            this.emit('connection', new WSConnection(connection));
        });

        this.#server.on('error', (error) => {
            this.#logger.error(error);
        });
    }
}
