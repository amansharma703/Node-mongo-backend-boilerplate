import { Router, Request, Response } from 'express';
import { AuthManager } from '@/controllers/auth/auth.manager';
import { TokenManager } from '@/controllers/token/token.manager';
import { UserManager } from '@/controllers/user/user.manager';
import { AuthValidation } from '@/controllers/auth/auth.validation';
import httpStatus from 'http-status';
import catchAsync from '@/utils/asyncWrapper';

export class AuthController {
    public router = Router();

    private _authManager = new AuthManager();
    private _tokenManager = new TokenManager();
    private _userManager = new UserManager();
    private _authValidation = new AuthValidation();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            '/register',
            catchAsync(this._authValidation.register),
            catchAsync(this.register.bind(this))
        );

        this.router.post(
            '/login',
            catchAsync(this._authValidation.login),
            catchAsync(this.login.bind(this))
        );

        this.router.post(
            '/logout',
            catchAsync(this._authValidation.logout),
            catchAsync(this.logout.bind(this))
        );

        this.router.post(
            '/refresh-tokens',
            catchAsync(this._authValidation.refreshTokens),
            catchAsync(this.refreshTokens.bind(this))
        );
    }

    private login = async (request: Request, response: Response) => {
        const email = request.body.email as string;
        const password = request.body.password as string;

        const user = await this._authManager.loginWithEmailAndPassword(
            email,
            password
        );
        const tokens = await this._tokenManager.generateAuthTokens(user);
        response.status(httpStatus.OK).send({
            user,
            tokens,
        });
    };

    private register = async (request: Request, response: Response) => {
        const user = await this._userManager.createUser(request.body);
        const tokens = await this._tokenManager.generateAuthTokens(user);
        response.status(httpStatus.CREATED).send({ user, tokens });
    };

    private logout = async (request: Request, response: Response) => {
        await this._authManager.logout(request.body.refreshToken);
        response.status(httpStatus.NO_CONTENT).send();
    };

    private refreshTokens = async (request: Request, response: Response) => {
        const tokens = await this._authManager.refreshAuth(
            request.body.refreshToken
        );
        response.send({ ...tokens });
    };
}
