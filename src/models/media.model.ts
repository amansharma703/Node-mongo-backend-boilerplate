import { Schema, model } from 'mongoose';
import paginate from '@/models/plugins/paginate.plugin';
import toJSON from '@/models/plugins/toJSON.plugin';

export interface Media {
    id?: Schema.Types.ObjectId;
    _id?: Schema.Types.ObjectId;
    eTag: string;
    location: string;
    key: string;
    bucket: string;
}

export const schema = new Schema<Media>(
    {
        eTag: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            trim: true,
        },
        bucket: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

schema.plugin(toJSON);
schema.plugin(paginate);

export const Media = model<Media>('Media', schema);
