import httpStatus from 'http-status';
import config from '@/config/config';
import logger from '@/config/logger';
import { ApiError } from '@/utils/ApiError';
import type { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
    public errorConverter(
        err: {
            isOperational?: boolean;
            message: any;
            stack?: any;
            statusCode?: number;
        },
        _req: Request,
        _res: Response,
        next: NextFunction
    ): void {
        let error = err;
        if (!(error instanceof ApiError)) {
            const statusCode = error.statusCode
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message || httpStatus[statusCode];
            error = new ApiError(statusCode, message, false, err.stack);
        }
        next(error);
    }

    public errorHandler(
        err: {
            isOperational?: boolean;
            message: any;
            stack?: any;
            statusCode?: number;
            ipAddress?: string;
        },
        req: Request,
        res: Response,
        _next: NextFunction
    ): void {
        let { message, statusCode } = err;
        err.ipAddress = req.ip;

        if (config.env === 'production' && !err.isOperational) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
        }

        const response = {
            code: statusCode,
            message,
            ...(config.env === 'development' && { stack: err.stack }),
        };

        logger.error(err);

        res.status(statusCode).send(response);
    }
}
