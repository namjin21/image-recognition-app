const { getMetadata } = require("../services/dynamoService");

const fetchMetadata = async (req, res) => {
    try {
        const { imageId } = req.query;
        if (!imageId) return res.status(400).json({ error: "Missing imageId" });

        const metadata = await getMetadata(imageId);
        res.json(metadata || { message: "No metadata found" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { fetchMetadata };
