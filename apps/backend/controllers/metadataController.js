const { getMetadata } = require("../services/dynamoService");

const fetchMetadata = async (req, res) => {
    try {
        const { fileKey } = req.query;
        if (!fileKey) return res.status(400).json({ error: "Missing file key" });

        const metadata = await getMetadata(fileKey);
        res.json(metadata || { message: "No metadata found" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { fetchMetadata };
