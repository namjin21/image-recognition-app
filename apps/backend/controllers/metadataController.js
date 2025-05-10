import { getMetadata, getAllMetadata }  from "../services/dynamoService.js";

export const fetchMetadata = async (req, res) => {
    try {
        const { userId, imageId } = req.params;
        if (!userId) return res.status(400).json({ error: "Missing userId" });
        if (!imageId) return res.status(400).json({ error: "Missing imageId" });

        const metadata = await getMetadata(userId, imageId);
        res.json(metadata || { message: `No metadata found for imageId: ${imageId}` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const fetchAllMetadata = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ error: "Missing userId" });
    
        const allMetadata = await getAllMetadata(userId);
        res.json(allMetadata || { message: `No metadata found for userId: ${userId}` })
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve images for user' });
    }
};
