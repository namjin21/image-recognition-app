import { generateImageLabels } from "../services/rekognitionService.js";
import { setAnalysis, updateStatus } from "../services/dynamoService.js";
import { generateStory } from "../services/llmService.js";

export const analyzeImage = async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    
    if (!imageId) {
        return res.status(400).json({ error: "Missing partition key: imageId" });
    }

    try {
        const labels = await generateImageLabels(userId, imageId);
        const {category, mood, story} = await generateStory(labels);
        await setAnalysis(userId, imageId, labels, category, mood, story);

        res.json({ message: "Image processed", imageId, labels, category, mood, story });
    } catch (error) {
        console.error("Error analyzing image:", error);
        await updateStatus(imageId, "failed");
        res.status(500).json({ error: error.message });
    }
};