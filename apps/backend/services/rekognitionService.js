const AWS = require("aws-sdk");

const rekognition = new AWS.Rekognition();

const analyzeImage = async (fileKey, bucketName) => {
    const params = {
        Image: { S3Object: { Bucket: bucketName, Name: fileKey } },
    };

    const result = await rekognition.detectLabels(params).promise();
    return result.Labels.map(label => ({
        Name: label.Name,
        Confidence: label.Confidence,
    }));
};

module.exports = { analyzeImage };
