import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthMiddleware } from '@/middlewares/authMiddleware';
import { UserManager } from '@/controllers/user/user.manager';
import catchAsync from '@/utils/asyncWrapper';
import pick from '@/utils/pick';
import { ApiError } from '@/utils/ApiError';
import { UserValidation } from '@/controllers/user/user.validation';

export class UserController {
    public router = Router();

    private _authMiddleware = new AuthMiddleware();
    private _userManager = new UserManager();
    private _userValidation = new UserValidation();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            '/dashboard',
            catchAsync(this._authMiddleware.auth(['user_get'])),
            catchAsync(this.getDashboard.bind(this))
        );

        this.router.post(
            '/update',
            catchAsync(this._authMiddleware.auth(['user_update'])),
            catchAsync(this._userValidation.updateProfile),
            catchAsync(this.updateProfile.bind(this))
        );

        this.router.get(
            '/',
            catchAsync(this._authMiddleware.auth(['admin_getUsers'])),
            catchAsync(this.getUsers.bind(this))
        );

        this.router.post(
            '/',
            catchAsync(this._authMiddleware.auth(['admin_manageUsers'])),
            catchAsync(this._userValidation.createUser),
            catchAsync(this.createUser.bind(this))
        );

        this.router.get(
            '/:userId',
            catchAsync(this._authMiddleware.auth(['admin_getUsers'])),
            catchAsync(this.getUser.bind(this))
        );

        this.router.patch(
            '/:userId',
            catchAsync(this._authMiddleware.auth(['admin_manageUsers'])),
            catchAsync(this._userValidation.updateUser),
            catchAsync(this.updateUser.bind(this))
        );

        this.router.delete(
            '/:userId',
            catchAsync(this._authMiddleware.auth(['admin_manageUsers'])),
            catchAsync(this.deleteUser.bind(this))
        );
    }

    private createUser = async (request: Request, response: Response) => {
        const user = await this._userManager.createUser(request.body);
        response.status(httpStatus.CREATED).send(user);
    };

    private getUsers = async (request: Request, response: Response) => {
        const filter = pick(request.query, ['name', 'role']);
        const options = pick(request.query, ['sortBy', 'limit', 'page']);
        const result = await this._userManager.queryUsers(filter, options);
        response.send(result);
    };

    private getUser = async (request: Request, response: Response) => {
        const user = await this._userManager.getUserById(request.params.userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        response.send(user);
    };

    private updateUser = async (request: Request, response: Response) => {
        const user = await this._userManager.updateUserById(
            request.params.userId,
            request.body
        );
        response.send(user);
    };

    private deleteUser = async (request: Request, response: Response) => {
        await this._userManager.deleteUserById(request.params.userId);
        response.status(httpStatus.NO_CONTENT).send();
    };

    private getDashboard = async (request: Request, response: Response) => {
        const requestUser = request.authUser;
        const user = await this._userManager.getUserById(requestUser.id);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        response.send(user);
    };

    private updateProfile = async (request: Request, response: Response) => {
        const requestUser = request.authUser;
        const name = request.body.name as string;
        const email = request.body.email as string;
        const user = await this._userManager.updateUserById(requestUser.id, {
            name,
            email,
        });
        response.send(user);
    };
}
