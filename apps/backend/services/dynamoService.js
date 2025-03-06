const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE;

const storeInitialMetadata = async (imageId, s3Key, originalFileName) => {
    const metadata = {
        imageId,
        s3Key,
        originalFileName,
        labels: [],
        processStatus: 'pending',
        uploadedAt: new Date().toISOString(),
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

const setLabels = async (imageId, labels) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { imageId },
        UpdateExpression: "SET processStatus = :processStatus, labels = :labels",
        ExpressionAttributeValues: {
            ":processStatus": "done",
            ":labels": labels
        }
    };

    try {
        const command = new UpdateCommand(params);
        await dynamoDB.send(command);
        console.log("Metadata updated successfully.");
    } catch (error) {
        console.error("Error updating metadata:", error);
    }
}

const updateStatus = async (imageId, processStatus) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { imageId },
        UpdateExpression: "SET processStatus = :processStatus",
        ExpressionAttributeValues: {
            ":processStatus": processStatus
        }
    };

    try {
        const command = new UpdateCommand(params);
        await dynamoDB.send(command);
        console.log(`Status updated successfully: ${status}`);
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

const getMetadata = async (imageId) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { imageId },
    })

    result = await dynamoDB.send(command);
    console.log(result)
    return result.Item;
};

module.exports = { storeInitialMetadata, setLabels, updateStatus, getMetadata };