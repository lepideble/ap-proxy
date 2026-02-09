import { ConsoleLogger } from './provider/console.ts';
import { parseConfigFromArgs } from './provider/parseArgs.ts';
import { WSClient, WSServer } from './provider/ws.ts';
import { type Client, type Config, type Server } from './types.ts';

const config: Config = parseConfigFromArgs();

const logger = new ConsoleLogger(config.debug);

const server: Server = new WSServer(config.listen, logger);

server.on('connection', (connection) => {
    const client: Client = new WSClient(config.url, logger);

    client.on('message', (data) => {
        logger.log('Message from server: ', data);

        connection.send(data);
    });

    client.on('close', () => {
        connection.close();
    });

    connection.on('message', async (data) => {
        logger.log('Message from client: ', data);

        await client.ready();
        await client.send(data);
    });

    connection.on('close', () => {
        client.close();
    });
});
