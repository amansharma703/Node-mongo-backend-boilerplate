import { User } from '@/models/user.model';
import { ApiError } from '@/utils/ApiError';
import { FilterQuery, ObjectId, ProjectionType } from 'mongoose';
import httpStatus from 'http-status';

export class UserManager {
    public createUser = async (user: User): Promise<User> => {
        if (await User.isEmailTaken(user.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        return User.create(user);
    };

    public getUserById = async (id: ObjectId | string): Promise<User> => {
        return User.findById(id);
    };

    public queryUsers = async (
        filter?: FilterQuery<User>,
        options?: ProjectionType<User>
    ): Promise<User[]> => {
        const users = await User.paginate(filter, options);
        return users;
    };

    public updateUserById = async (
        userId: ObjectId | string,
        updateBody: { email: string; name: string }
    ): Promise<User> => {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        if (
            updateBody.email &&
            (await User.isEmailTaken(updateBody.email, String(userId)))
        ) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        Object.assign(user, updateBody);
        await User.updateOne({ _id: user.id }, user, { multi: true });
        return user;
    };

    public deleteUserById = async (userId: string): Promise<User> => {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        await User.deleteOne({ _id: user.id });
        return user;
    };
}
