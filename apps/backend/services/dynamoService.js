import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { generateGetPresignedUrl } from "../utils/s3Utils.js";

// Initialize the DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const urlExpiry = 3600;

export const storeInitialMetadata = async (
  imageId,
  originalS3Key,
  optimizedS3Key,
  originalFileName,
  userId
) => {
  const metadata = {
    imageId,
    originalS3Key,
    optimizedS3Key,
    originalFileName,
    labels: [],
    processStatus: "pending",
    uploadedAt: new Date().toISOString(),
    userId,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: metadata,
  });

  try {
    await dynamoDB.send(command); // Execute the command
    return metadata;
  } catch (error) {
    console.error("Error storing initial metadata:", error);
  }
};

export const setAnalysis = async (userId, imageId, labels, category, mood, story, optimizedS3Key) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId, imageId },
    UpdateExpression: "SET processStatus = :processStatus, labels = :labels, category = :category, mood = :mood, story = :story, optimizedS3Key = :optimizedS3Key",
    ExpressionAttributeValues: {
      ":processStatus": "processed",
      ":labels": labels,
      ":category": category,
      ":mood": mood,
      ":story": story,
      ":optimizedS3Key": optimizedS3Key,
    },
  };

  try {
    const command = new UpdateCommand(params);
    await dynamoDB.send(command);
    console.log("Metadata updated successfully.");
  } catch (error) {
    console.error("Error updating metadata:", error);
  }
};

export const updateStatus = async (imageId, processStatus) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { imageId },
    UpdateExpression: "SET processStatus = :processStatus",
    ExpressionAttributeValues: {
      ":processStatus": processStatus,
    },
  };

  try {
    const command = new UpdateCommand(params);
    await dynamoDB.send(command);
    console.log(`Status updated successfully: ${status}`);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

export const getMetadata = async (userId, imageId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId, imageId },
  });

  result = await dynamoDB.send(command);
  return result.Item;
};

export const getAllMetadata = async (userId) => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };
  const command = new QueryCommand(params);

  try {
    const data = await client.send(command);
    const metadata = data.Items || [];
    const imagesData = await Promise.all(
      metadata.map(async (item) => {
        const signedUrl = await generateGetPresignedUrl(
          process.env.S3_BUCKET_NAME,
          item.optimizedS3Key,
          urlExpiry
        );
        return {
          id: item.imageId,
          url: signedUrl,
          originalFileName: item.originalFileName,
          labels: item.labels || [],
          category: item.category,
          mood: item.mood,
          story: item.story,
          status: item.processStatus || "pending",
        };
      })
    );

    return imagesData;
  } catch (error) {
    console.error("Error fetching user images:", error);
  }
};

export const getOriginalS3Key = async (userId, imageId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId, imageId },
  });

  try {
    const result = await dynamoDB.send(command);
    return result.Item.originalS3Key;
  } catch (error) {
    console.error("Error getting original s3 key:", error);
  }
};

export const getOptimizedS3Key = async (userId, imageId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId, imageId },
  });

  try {
    const result = await dynamoDB.send(command);
    return result.Item.optimizedS3Key;
  } catch (error) {
    console.error("Error getting optimized s3 key:", error);
  }
};

export const deleteImagesMetadata = async (imageIds, userId) => {
  const deleteRequests = imageIds.map((imageId) => ({
    DeleteRequest: {
      Key: { userId: { S: userId }, imageId: { S: imageId } },
    },
  }));

  const deleteChunks = [];
  while (deleteRequests.length > 0) {
    deleteChunks.push(deleteRequests.splice(0, 25)); // DynamoDB batch write max = 25
  }

  await Promise.all(
    deleteChunks.map((chunk) =>
      dynamoDB.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [TABLE_NAME]: chunk,
          },
        })
      )
    )
  );
};