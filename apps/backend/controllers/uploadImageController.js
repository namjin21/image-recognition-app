const multer = require("multer");
const { uploadToS3 } = require("../services/s3Service");

const upload = multer({ storage: multer.memoryStorage() });

const handleUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });

        const fileKey = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
        res.json({ message: "Image uploaded successfully", fileKey });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { upload, handleUpload };
