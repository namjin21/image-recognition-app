const multer = require("multer");
const { uploadToS3 } = require("../services/s3Service");
const { storeInitialMetadata } = require("../services/dynamoService")

// Set up Multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

const handleUpload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        const uploadResults = await Promise.all(
            req.files.map(async (file) => {
                const { originalname, buffer, mimetype } = file;
                const { uniqueId, s3Key } = await uploadToS3(buffer, originalname, mimetype);
                await storeInitialMetadata(uniqueId, s3Key, originalname);

                return {
                    imageId: uniqueId,
                    s3Key,
                    originalFileName: originalname
                }
            })
        )

        res.status(200).json({ 
            message: "Image uploaded successfully",
            images: uploadResults
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { upload, handleUpload };
