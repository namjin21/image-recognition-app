const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");

// Initialize the Rekognition client
const rekognition = new RekognitionClient({ region: process.env.AWS_REGION });

const analyzeImage = async (imageId) => {
  try {
    const params = {
        Image: {
            S3Object: {
                Bucket: process.env.S3_BUCKET_NAME, // Ensure this is defined
                Name: imageId, // The key of the image in S3
            },
        },
        MaxLabels: 10, // Limit the number of labels returned
        MinConfidence: 75, // Confidence threshold for labels
    };

    const command = new DetectLabelsCommand(params);
    const data = await rekognition.send(command);
    return data.Labels; // Return detected labels
  } catch (error) {
    console.error("Error calling Rekognition API:", error);
    throw error; // Ensure errors propagate properly
  }
};

module.exports = { analyzeImage };
