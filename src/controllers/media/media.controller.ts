import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../../middlewares/authMiddleware';
import catchAsync from '../../utils/asyncWrapper';
import sharp from 'sharp';
import * as fs from 'fs';
import multer from 'multer';
import { uploadImageToS3 } from '@/utils/media';
import { MediaManager } from '@/controllers/media/media.manager';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export class MediaController {
    public router = Router();

    private _authMiddleware = new AuthMiddleware();
    private _mediaManager = new MediaManager();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            '/',
            catchAsync(this._authMiddleware.auth(['admin_manageEvents'])),
            catchAsync(upload.single('file')),
            catchAsync(this.uploadMedia.bind(this))
        );
    }

    private uploadMedia = async (request: Request, response: Response) => {
        fs.access('./uploads', async error => {
            if (error) {
                fs.mkdirSync('./uploads');
            }
        });
        const { buffer, originalname } = request.file as Express.Multer.File;
        const ref = `${originalname}.webp`;
        const filePath = `./uploads/${ref}`;
        await sharp(buffer).webp({ quality: 80 }).toFile(filePath);
        const uploadImageData = await uploadImageToS3(filePath);
        fs.unlinkSync(filePath);
        const media = await this._mediaManager.createMedia({
            location: uploadImageData.Location,
            key: uploadImageData.Key,
            bucket: uploadImageData.Bucket,
            eTag: uploadImageData.ETag,
        });
        response.send(media);
    };
}
