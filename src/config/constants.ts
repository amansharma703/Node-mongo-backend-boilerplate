export class Constants {
    public static readonly TOKEN_EXPIRE_IN_SECONDS = 75;
}
export class Tokens {
    public static readonly tokenTypes = {
        ACCESS: 'access',
        REFRESH: 'refresh',
        RESET_PASSWORD: 'resetPassword',
        VERIFY_EMAIL: 'verifyEmail',
    };
}
