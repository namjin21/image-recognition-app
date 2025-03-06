const { analyzeImage } = require("../services/rekognitionService");
const { setLabels, updateStatus } = require("../services/dynamoService");

const processImage = async (req, res) => {
    const { imageId } = req.body;
    if (!imageId) {
        return res.status(400).json({ error: "Missing partition key: imageId" });
    }

    try {
        const labels = await analyzeImage(imageId);
        await setLabels(imageId, labels);
        res.json({ message: "Image processed", imageId, labels });
    } catch (error) {
        console.error("Error processing image:", error);
        await updateStatus(imageId, "failed");
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processImage };
