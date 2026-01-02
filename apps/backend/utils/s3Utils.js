import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function generateGetPresignedUrl(bucketName, objectKey, expiresInSeconds) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: expiresInSeconds,
  });

  return signedUrl;
}

export async function generateUploadPresignedUrl(bucketName, objectKey, contentType, expiresInSeconds) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: expiresInSeconds,
  });

  return signedUrl;
}

export function convertToOptimizedS3Key(originalS3Key) {
  return originalS3Key
    .replace('/original/', '/optimized/')
    .replace(/\.[^.]+$/, ".webp");
}