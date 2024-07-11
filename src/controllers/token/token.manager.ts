import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '@/config/config';
import { Token } from '@/models/token.model';
import { Tokens } from '@/config/constants';
import { User } from '@/models/user.model';

interface AuthTokens {
    access: {
        token: string;
        expires: Date;
    };
    refresh: {
        token: string;
        expires: Date;
    };
}

export class TokenManager {
    public generateToken = (
        userId: string,
        expires: moment.Moment,
        type: string,
        secret: string = config.jwt.secret
    ): string => {
        const payload = {
            sub: userId,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };
        return jwt.sign(payload, secret);
    };

    public saveToken = async (
        token: string,
        userId: string,
        expires: moment.Moment,
        type: string,
        blacklisted = false
    ): Promise<Token> => {
        const tokenDoc = await Token.create({
            token,
            user: userId,
            expires: expires.toDate(),
            type,
            blacklisted,
        });
        return tokenDoc;
    };

    public verifyToken = async (
        token: string,
        type: string
    ): Promise<Token> => {
        const payload = jwt.verify(token, config.jwt.secret);
        const tokenDoc = await Token.findOne({
            token,
            type,
            user: payload.sub,
            blacklisted: false,
        });
        if (!tokenDoc) {
            throw new Error('Token not found');
        }
        return tokenDoc;
    };

    public generateAuthTokens = async (user: User): Promise<AuthTokens> => {
        const accessTokenExpires = moment().add(
            config.jwt.accessExpirationMinutes,
            'minutes'
        );
        const accessToken = this.generateToken(
            String(user.id),
            accessTokenExpires,
            Tokens.tokenTypes.ACCESS
        );

        const refreshTokenExpires = moment().add(
            config.jwt.refreshExpirationDays,
            'days'
        );
        const refreshToken = this.generateToken(
            String(user.id),
            refreshTokenExpires,
            Tokens.tokenTypes.REFRESH
        );
        await this.saveToken(
            refreshToken,
            String(user.id),
            refreshTokenExpires,
            Tokens.tokenTypes.REFRESH
        );

        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
    };
}
