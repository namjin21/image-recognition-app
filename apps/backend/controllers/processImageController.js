const { analyzeImage } = require("../services/rekognitionService");
const { storeMetadata } = require("../services/dynamoService");

const processImage = async (req, res) => {
    try {
        const { fileKey } = req.body;
        if (!fileKey) {
            return res.status(400).json({ error: "Missing file key" });
        }

        const labels = await analyzeImage(fileKey, process.env.S3_BUCKET);
        const metadata = await storeMetadata(fileKey, labels);
        res.json({ message: "Image processed", metadata });
    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processImage };
