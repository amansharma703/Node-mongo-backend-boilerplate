import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';
import httpStatus from 'http-status';

export class AuthValidation {
    public login = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const schema: ObjectSchema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const result = schema.validate(request.body);

        if (result.error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                result.error.message.split(`\"`).join('')
            );
        }
        next();
    };

    public register = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const schema: ObjectSchema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const result = schema.validate(request.body);

        if (result.error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                result.error.message.split(`\"`).join('')
            );
        }
        next();
    };

    public logout = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const schema: ObjectSchema = Joi.object().keys({
            refreshToken: Joi.string().required(),
        });

        const result = schema.validate(request.body);

        if (result.error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                result.error.message.split(`\"`).join('')
            );
        }
        next();
    };

    public refreshTokens = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const schema: ObjectSchema = Joi.object().keys({
            refreshToken: Joi.string().required(),
        });

        const result = schema.validate(request.body);

        if (result.error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                result.error.message.split(`\"`).join('')
            );
        }
        next();
    };
}
