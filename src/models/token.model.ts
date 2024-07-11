import { Schema, model } from 'mongoose';
import { Tokens } from '@/config/constants';
import toJSON from '@/models/plugins/toJSON.plugin';

export interface Token {
    token: string;
    user: Schema.Types.ObjectId | string;
    type: string;
    expires: Date;
    blacklisted: boolean;
}

export const schema = new Schema<Token>(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [
                Tokens.tokenTypes.REFRESH,
                Tokens.tokenTypes.RESET_PASSWORD,
                Tokens.tokenTypes.VERIFY_EMAIL,
            ],
            required: true,
        },
        expires: {
            type: Date,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

schema.plugin(toJSON);

export const Token = model<Token>('Token', schema);
