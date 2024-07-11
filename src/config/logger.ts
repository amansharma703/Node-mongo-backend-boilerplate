/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import config from '@/config/config';
import winston from 'winston';
import { MongoDB } from 'winston-mongodb';
require('winston-mongodb').MongoDB;

const enumerateErrorFormat = winston.format(info => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const mongoDBFilter = winston.format(info => {
    if (info?.metadata?.data?.saveInDB) {
        return {
            ...info,
            level: 'error',
        };
    }
    return false;
});

const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'development'
            ? winston.format.colorize()
            : winston.format.uncolorize(),
        winston.format.json(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`),
        winston.format.metadata()
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
            handleExceptions: true,
        }),
        new winston.transports.MongoDB({
            level: 'error',
            db: config.mongoose.url,
            options: { useUnifiedTopology: true },
            collection: 'logs',
            storeHost: true,
            format: winston.format.combine(mongoDBFilter()),
        }),
    ],
});

export default logger;
