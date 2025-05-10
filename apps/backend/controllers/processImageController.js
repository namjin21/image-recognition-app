import { analyzeImage } from "../services/rekognitionService.js";
import { setLabels, updateStatus } from "../services/dynamoService.js";

export const processImage = async (req, res) => {
    const { userId, imageId } = req.body;
    if (!imageId) {
        return res.status(400).json({ error: "Missing partition key: imageId" });
    }

    try {
        const labels = await analyzeImage(userId, imageId);
        await setLabels(userId, imageId, labels);
        res.json({ message: "Image processed", imageId, labels });
    } catch (error) {
        console.error("Error processing image:", error);
        await updateStatus(imageId, "failed");
        res.status(500).json({ error: error.message });
    }
};