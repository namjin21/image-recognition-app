import { generateImageLabels } from "../services/rekognitionService.js";
import { setLabels, updateStatus } from "../services/dynamoService.js";
import { generateStory } from "../services/llmService.js";

export const analyzeImage = async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    
    if (!imageId) {
        return res.status(400).json({ error: "Missing partition key: imageId" });
    }

    try {
        const labels = await generateImageLabels(userId, imageId);
        await setLabels(userId, imageId, labels);
        const story = await generateStory(labels);

        res.json({ message: "Image processed", imageId, labels, story });
    } catch (error) {
        console.error("Error analyzing image:", error);
        await updateStatus(imageId, "failed");
        res.status(500).json({ error: error.message });
    }
};