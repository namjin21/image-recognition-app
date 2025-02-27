const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
    const fileKey = `uploads/${uuidv4()}-${fileName}`;

    await s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: mimeType,
    }).promise();

    return fileKey;
};

module.exports = { uploadToS3 };