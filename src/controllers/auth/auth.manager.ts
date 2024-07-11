import { User } from '@/models/user.model';
import { ApiError } from '@/utils/ApiError';
import { Tokens } from '@/config/constants';
import { Token } from '@/models/token.model';
import { TokenManager } from '@/controllers/token/token.manager';
import { UserManager } from '@/controllers/user/user.manager';
import httpStatus from 'http-status';

export class AuthManager {
    private _tokenManager = new TokenManager();
    private _userManager = new UserManager();

    public loginWithEmailAndPassword = async (
        email: string,
        password: string
    ): Promise<User> => {
        const user = await User.findOne({ email });
        if (!user || !(await user.isPasswordMatch(password))) {
            throw new ApiError(
                httpStatus.UNAUTHORIZED,
                'Incorrect email or password'
            );
        }
        return user;
    };

    public logout = async (refreshToken: string): Promise<void> => {
        const refreshTokenDoc = await Token.findOne({
            token: refreshToken,
            type: Tokens.tokenTypes.REFRESH,
            blacklisted: false,
        });
        if (!refreshTokenDoc) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        }
        await refreshTokenDoc.deleteOne();
    };

    public refreshAuth = async (
        refreshToken: string
    ): Promise<{ access: {}; refresh: {} }> => {
        try {
            const refreshTokenDoc = await this._tokenManager.verifyToken(
                refreshToken,
                Tokens.tokenTypes.REFRESH
            );
            const user = await this._userManager.getUserById(
                refreshTokenDoc.user
            );
            if (!user) {
                throw new Error();
            }
            await Token.deleteOne({ token: refreshTokenDoc.token });
            return this._tokenManager.generateAuthTokens(user);
        } catch (error) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
        }
    };
}
