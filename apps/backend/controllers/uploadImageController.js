const multer = require("multer");
const { uploadToS3 } = require("../services/s3Service");
const { storeInitialMetadata } = require("../services/dynamoService")

// Set up Multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

const handleUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });

        const { originalname, buffer, mimetype } = req.file;
        const { uniqueId, s3Key } = await uploadToS3(buffer, originalname, mimetype);
        
        await storeInitialMetadata(uniqueId, s3Key, originalname)

        res.status(200).json({ 
            message: "Image uploaded successfully",
            imageId: uniqueId,
            s3Key,
            originalFileName: originalname
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { upload, handleUpload };
