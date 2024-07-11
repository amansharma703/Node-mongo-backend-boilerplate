import { Router } from 'express';
import { AuthController } from '@/controllers/auth/auth.controller';
import { UserController } from '@/controllers/user/user.controller';

const router = Router();

const routes = [
    {
        path: '/auth',
        route: new AuthController().router,
    },
    {
        path: '/users',
        route: new UserController().router,
    },
];

routes.forEach(route => {
    router.use(route.path, route.route);
});

export default router;
