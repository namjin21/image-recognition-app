import { generateImageLabels } from "../services/rekognitionService.js";
import { getOptimizedS3Key, setAnalysis, updateStatus } from "../services/dynamoService.js";
import { generateStory } from "../services/llmService.js";
import { generatePreSignedUrl } from "../utils/s3Utils.js";

const urlExpiry = 3600;

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
        const optimizedKey = await getOptimizedS3Key(userId, imageId);
        const optimizedPresignedUrl = await generatePreSignedUrl(process.env.S3_BUCKET_NAME, optimizedKey, urlExpiry);

        res.json({ 
            message: "Image processed", 
            imageId, 
            labels, 
            category, 
            mood, 
            story,
            optimizedKey,
            optimizedPresignedUrl
         });
    } catch (error) {
        console.error("Error analyzing image:", error);
        await updateStatus(imageId, "failed");
        res.status(500).json({ error: error.message });
    }
};