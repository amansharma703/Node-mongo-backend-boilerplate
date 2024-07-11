import { Media } from '@/models/media.model';
import { ObjectId } from 'mongoose';

export class MediaManager {
    public createMedia = async (media: Media): Promise<Media> => {
        return Media.create(media);
    };

    public getMediaById = async (id: ObjectId | string): Promise<Media> => {
        return Media.findById(id);
    };
}
