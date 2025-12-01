import { deleteImagesMetadata, getOptimizedS3Key, getOriginalS3Key } from "../services/dynamoService.js";
import { deleteImagesFromS3 } from "../services/s3Service.js";

export const deleteImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { imageIds } = req.body;

    if (!userId || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ error: "Missing userId or imageIds" });
    }
    
    const allS3Keys = [];

    for (const imageId of imageIds) {
      const originalKey = await getOriginalS3Key(userId, imageId);
      const optimizedKey = await getOptimizedS3Key(userId, imageId);

      if (originalKey) allS3Keys.push(originalKey);
      if (optimizedKey) allS3Keys.push(optimizedKey);
    }

    await deleteImagesFromS3(allS3Keys);
    await deleteImagesMetadata(imageIds, userId);

    return res.json({ message: `Images deleted successfully for user ${userId}` });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ error: "Failed to delete images" });
  }
};