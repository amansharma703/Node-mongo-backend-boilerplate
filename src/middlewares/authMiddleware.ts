import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '@/utils/ApiError';
import { Roles } from '@/config/roles';
import passport from 'passport';
import '@/config/passport';
import { User as AuthUser } from '../models/user.model';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        export interface Request {
            authUser?: AuthUser;
        }
    }
}

export class AuthMiddleware {
    private verifyCallback =
        (
            req: Request,
            resolve: any,
            reject: (arg) => void,
            requiredRights: string[],
            options: { allowSinglePermission?: boolean }
        ) =>
        async (err: any, user: any, info: any) => {
            if (err || info || !user) {
                return reject(
                    new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
                );
            }
            req.authUser = user;

            if (requiredRights.length) {
                const userRights = Roles.roleRights.get(user.role);
                const hasRequiredRights = options?.allowSinglePermission
                    ? requiredRights.some(requiredRight =>
                          userRights.includes(requiredRight)
                      )
                    : requiredRights.every(requiredRight =>
                          userRights.includes(requiredRight)
                      );
                if (!hasRequiredRights && req.params.userId !== user.id) {
                    return reject(
                        new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
                    );
                }
            }

            resolve();
        };

    public auth =
        (
            requiredRights?: string[],
            options?: { allowSinglePermission?: boolean }
        ) =>
        async (req: Request, res: Response, next: NextFunction) => {
            return new Promise((resolve, reject) => {
                passport.authenticate(
                    'jwt',
                    { session: false },
                    this.verifyCallback(
                        req,
                        resolve,
                        reject,
                        requiredRights,
                        options
                    )
                )(req, res, next);
            })
                .then(() => next())
                .catch(err => next(err));
        };
}
