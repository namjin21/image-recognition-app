const {
  RekognitionClient,
  DetectLabelsCommand,
} = require("@aws-sdk/client-rekognition");
const { getS3Key } = require("./dynamoService");

// Initialize the Rekognition client
const rekognition = new RekognitionClient({ region: process.env.AWS_REGION });

const analyzeImage = async (userId, imageId) => {
  try {
    const s3Key = await getS3Key(userId, imageId);
  
    const params = {
      Image: {
        S3Object: {
          Bucket: process.env.S3_BUCKET_NAME, // Ensure this is defined
          Name: s3Key, // The key of the image in S3
        },
      },
      MaxLabels: 10, // Limit the number of labels returned
      MinConfidence: 85, // Confidence threshold for labels
    };

    const command = new DetectLabelsCommand(params);
    const data = await rekognition.send(command);
    const processedData = processRekognitionResult(data);

    console.log(processedData);
    
    return processedData;
  } catch (error) {
    console.error("Error calling Rekognition API:", error);
    throw error;
  }
};

const processRekognitionResult = (res) => {
  return res.Labels.map((label) => label.Name);
};

module.exports = { analyzeImage };
