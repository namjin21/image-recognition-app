const { analyzeImage } = require("../services/rekognitionService");
const { storeMetadata } = require("../services/dynamoService");

const processImage = async (req, res) => {
    try {
        const { imageId, s3Key, originalFileName } = req.body;
        if (!imageId) {
            return res.status(400).json({ error: "Missing partition key: imageId" });
        }

        const labels = await analyzeImage(imageId);
        const metadata = await storeMetadata(imageId, s3Key, originalFileName, labels);
        res.json({ message: "Image processed", metadata });
    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processImage };
