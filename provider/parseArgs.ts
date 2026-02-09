import { parseArgs, type ParseArgsConfig } from 'node:util';
import { DEFAULTS, type Config } from '../types.ts';

const parseArgsConfig: ParseArgsConfig = {
    allowPositionals: true,
    options: {
        'debug': {
            type: 'boolean',
            default: DEFAULTS.debug,
        },
        'listen-address': {
            type: 'string',
            default: DEFAULTS.listen.address,
        },
        'listen-port': {
            type: 'string',
            default: DEFAULTS.listen.port.toString(),
        },
    },
};

export const parseConfigFromArgs = (): Config => {
    const args = parseArgs(parseArgsConfig);

    return {
        debug: args.values.debug as boolean,
        url: args.positionals[0],
        listen: {
            address: args.values['listen-address'] as string,
            port: parseInt(args.values['listen-port'] as string, 10),
        },
    };
}
