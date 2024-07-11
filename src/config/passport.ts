import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '@/models/user.model';
import config from '@/config/config';
import { Tokens } from '@/config/constants';

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (
    payload: { type: string; sub: string },
    done: (arg0: null, arg1: boolean | User) => void
): Promise<void> => {
    try {
        if (payload.type !== Tokens.tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
