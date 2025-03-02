const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION });

// Wrap the client with DynamoDBDocumentClient for easy interactions
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE;

const storeMetadata = async (fileKey, labels) => {
    const metadata = {
        imageId: fileKey,
        labels,
        uploadedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: metadata,
    });

    await dynamoDB.send(command); // Execute the command
    return metadata;
};

const getMetadata = async (fileKey) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { imageId: fileKey },
    })

    result = await dynamoDB.send(command);
    console.log(result)
    return result.Item;
};

module.exports = { storeMetadata, getMetadata };