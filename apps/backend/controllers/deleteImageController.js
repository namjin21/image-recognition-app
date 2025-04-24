const { deleteImagesMetadata, getS3Key } = require("../services/dynamoService");
const { deleteImagesFromS3 } = require("../services/s3Service");

const deleteImages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageIds } = req.body;

    if (!userId || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ error: "Missing userId or imageIds" });
    }

    const s3Keys = await Promise.all(
      imageIds.map(async (imageId) => {
        const s3Key = await getS3Key(userId, imageId);
        return s3Key;
      })
    );

    await deleteImagesFromS3(s3Keys);
    await deleteImagesMetadata(imageIds, userId);

    return res.json({ message: `Images deleted successfully for user ${userId}` });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ error: "Failed to delete images" });
  }
};

module.exports = { deleteImages };