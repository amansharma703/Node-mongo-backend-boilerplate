import logger from './src/config/logger';
import mongoose from 'mongoose';
import app from './src/app';
import config from './src/config/config';

let server: any;

mongoose.connect(config.mongoose.url).then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: any) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB Disconnected');
});

mongoose.connection.on('connected', () => {
    logger.info('MongoDB Connected back');
});
