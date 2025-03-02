const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");

// Initialize the Rekognition client
const rekognition = new RekognitionClient({ region: process.env.AWS_REGION });

const analyzeImage = async (fileKey) => {
  try {
    const params = {
        Image: {
            S3Object: {
                Bucket: process.env.S3_BUCKET_NAME, // Ensure this is defined
                Name: fileKey, // The key of the image in S3
            },
        },
        MaxLabels: 10, // Limit the number of labels returned
        MinConfidence: 75, // Confidence threshold for labels
    };

    const command = new DetectLabelsCommand(params);
    const data = await rekognition.send(command);
    console.log("Rekognition Response:", JSON.stringify(data, null, 2));
    return data.Labels; // Return detected labels
  } catch (error) {
    console.error("Error calling Rekognition API:", error);
    throw error; // Ensure errors propagate properly
  }
};

// const analyzeImage = async (fileKey, bucketName) => {
//     const params = {
//         Image: { S3Object: { Bucket: bucketName, Name: fileKey } },
//     };

//     const result = await rekognition.detectLabels(params).promise();
//     return result.Labels.map(label => ({
//         Name: label.Name,
//         Confidence: label.Confidence,
//     }));
// };

module.exports = { analyzeImage };
