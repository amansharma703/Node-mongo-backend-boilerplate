import { Schema, model, Model, FilterQuery, ProjectionType } from 'mongoose';
import bcrypt from 'bcrypt';
import type { NextFunction } from 'express';
import { Roles } from '@/config/roles';
import paginate from '@/models/plugins/paginate.plugin';
import toJSON from '@/models/plugins/toJSON.plugin';

export interface User {
    id?: Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role?: string;
    isEmailVerified?: boolean;
    isPasswordMatch?(password: string): Promise<boolean>;
}

interface UserModelInterface extends Model<User> {
    // declare any static methods here
    paginate(
        filter: FilterQuery<User>,
        options: ProjectionType<User>
    ): Promise<User[]>;
    isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}

export const schema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            private: true, // used by the toJSON plugin
        },
        role: {
            type: String,
            enum: Roles.roles,
            default: 'user',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

schema.method('isPasswordMatch', function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
});

schema.static(
    'isEmailTaken',
    async function (email: string, excludeUserId: string): Promise<boolean> {
        const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    }
);

schema.pre('save', async function (next: NextFunction) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

schema.plugin(toJSON);
schema.plugin(paginate);

export const User = model<User, UserModelInterface>('User', schema);
