const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  GetCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { generatePreSignedUrl } = require("../utils/s3Utils");

// Initialize the DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const urlExpiry = 3600;

const storeInitialMetadata = async (
  imageId,
  s3Key,
  originalFileName,
  userId
) => {
  const metadata = {
    imageId,
    s3Key,
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

const setLabels = async (userId, imageId, labels) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId, imageId },
    UpdateExpression: "SET processStatus = :processStatus, labels = :labels",
    ExpressionAttributeValues: {
      ":processStatus": "processed",
      ":labels": labels,
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

const updateStatus = async (imageId, processStatus) => {
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

const getMetadata = async (userId, imageId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId, imageId },
  });

  result = await dynamoDB.send(command);
  return result.Item;
};

const getAllMetadata = async (userId) => {
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
        const signedUrl = await generatePreSignedUrl(
          process.env.S3_BUCKET_NAME,
          item.s3Key,
          urlExpiry
        );
        return {
          id: item.imageId,
          url: signedUrl,
          originalFileName: item.originalFileName,
          labels: item.labels || [],
          status: item.processStatus || "pending",
        };
      })
    );

    return imagesData;
  } catch (error) {
    console.error("Error fetching user images:", error);
  }
};

const getS3Key = async (userId, imageId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId, imageId },
  });

  try {
    result = await dynamoDB.send(command);
    return result.Item.s3Key;
  } catch (error) {
    console.error("Error getting s3 key:", error);
  }
};

const deleteImagesMetadata = async (imageIds, userId) => {
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

module.exports = {
  storeInitialMetadata,
  setLabels,
  updateStatus,
  getMetadata,
  getAllMetadata,
  getS3Key,
  deleteImagesMetadata,
};
