import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';
import httpStatus from 'http-status';

export class UserValidation {
    public createUser = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const schema: ObjectSchema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            role: Joi.string().valid('user', 'admin'),
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

    public updateUser = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const schema: ObjectSchema = Joi.object().keys({
            name: Joi.string(),
            email: Joi.string().email(),
            role: Joi.string().valid('user', 'admin'),
            isEmailVerified: Joi.boolean(),
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

    public updateProfile = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const schema: ObjectSchema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
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
