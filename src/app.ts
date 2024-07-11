import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';
import httpStatus from 'http-status';
import morgan from '@/config/morgan';
import { ApiError } from '@/utils/ApiError';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { ErrorHandler } from '@/middlewares/error';
import passport from 'passport';
import jwtStrategy from '@/config/passport';
import cors from 'cors';

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: '*',
    })
);

app.enable('trust proxy');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 45, // Limit each IP to 45 requests per `window` (here, per 1 minute)
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

const _errorHandler = new ErrorHandler();

// convert error to ApiError, if needed
app.use(_errorHandler.errorConverter);

// handle error
app.use(_errorHandler.errorHandler);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

export default app;
