import logger from '@/config/logger';

interface MetaData {
    logId: string;
    kind: string;
    data?: any;
    requestData?: any;
    requestMethod?: string;
    responseData?: any;
    err?: Error;
    error?: Error;
}

const processError = (
    metaData: MetaData,
    error?: Error
): [Error | undefined, MetaData] => {
    if (error instanceof Error) {
        if ((error as any).isAxiosError) {
            const requestData = (error as any).config?.data;
            const requestMethod = (error as any).config?.method;
            const responseData = (error as any).response?.data;

            metaData.requestData = requestData;
            metaData.requestMethod = requestMethod;
            metaData.responseData = responseData;
        }
        const stack = error.stack;
        error = new Error(error.message);
        error.stack = stack;
        metaData.error = error;
    }

    return [error, metaData];
};

class LoggerHelper {
    static logCustomError(
        logId: string,
        error?: Error,
        data?: any,
        kind = 'custom'
    ): void {
        if (!logId) return;

        const metaData: MetaData = {
            logId,
            kind,
            ...(data && Object.keys(data).length > 0 && { data }),
        };

        try {
            const [logError, logMetadata] = processError(metaData, error);
            const errorMessage = logError
                ? logError.message
                : `Error logging ${kind} error`;
            logger.error(errorMessage, logMetadata);
        } catch (err) {
            logger.error(new Error(`Error logging ${kind} error`).message, {
                ...metaData,
                error,
                err,
            });
        }
    }
}

export default LoggerHelper;
