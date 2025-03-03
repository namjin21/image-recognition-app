const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({ region: process.env.AWS_REGION });

const uploadToS3 = async (fileBuffer, originalFileName, mimeType) => {
    const uniqueId = uuidv4();
    const fileExtension = originalFileName.split(".").pop();
    const s3Key = `uploads/${uniqueId}.${fileExtension}`

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: uniqueId,
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

module.exports = { uploadToS3 };