import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const bucketName = process.env.S3_BUCKET_NAME;

export const uploadToS3 = async (fileBuffer, originalFileName, mimeType, userId) => {
    const uniqueId = uuidv4();
    const fileExtension = originalFileName.split(".").pop();
    const s3Key = `${userId}/${uniqueId}.${fileExtension}`

    console.log("s3key: ", s3Key)

    const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: mimeType,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return { uniqueId, s3Key };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
};

export const deleteImagesFromS3 = async (s3Keys) => {
    try {
        const params = {
            Bucket: bucketName,
            Delete: { Objects: s3Keys.map((key) => ({ Key: key }))},
        };
        const command = new DeleteObjectsCommand(params);
        await s3.send(command);
    } catch (error) {
        console.error("Error deleting images from S3:", error);
        throw error;
    }
}