import config from '@/config/config';
import AWS from 'aws-sdk';
import * as fs from 'fs';

export const uploadImageToS3 = async (imagePath: string): Promise<any> => {
    const s3 = new AWS.S3({
        accessKeyId: config.aws.awsS3KeyId,
        secretAccessKey: config.aws.awsS3SecretAccessKey,
    });
    const blob = fs.readFileSync(imagePath);
    const imgArray = imagePath.split('/');
    const timestamp = new Date().toISOString();

    const imgName = `${timestamp}-${imgArray[2]}`;

    const uploadedImage = await s3
        .upload({
            Bucket: config.aws.awsS3BucketName as string,
            Key: imgName,
            Body: blob,
        })
        .promise();
    return uploadedImage;
};
