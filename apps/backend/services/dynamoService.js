const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE;

const storeMetadata = async (fileKey, labels) => {
    const metadata = {
        id: fileKey,
        labels,
        uploadedAt: new Date().toISOString(),
    };

    await dynamoDB.put({ TableName: TABLE_NAME, Item: metadata }).promise();
    return metadata;
};

const getMetadata = async (fileKey) => {
    const result = await dynamoDB.get({
        TableName: TABLE_NAME,
        Key: { id: fileKey },
    }).promise();

    return result.Item;
};

module.exports = { storeMetadata, getMetadata };