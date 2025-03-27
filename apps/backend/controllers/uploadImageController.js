const multer = require("multer");
const { uploadToS3 } = require("../services/s3Service");
const { storeInitialMetadata } = require("../services/dynamoService");
const { generatePreSignedUrl } = require("../utils/s3Utils");

// Set up Multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

const handleUpload = async (req, res) => {
    console.log(req.user.id);
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        if (!req.user || !req.user.id) {
            return res.status(400).json({error: "Could not verify user or user id does not exist"});
        }

        const userId = req.user.id;
        const uploadResults = await Promise.all(
            req.files.map(async (file) => {
                const { originalname, buffer, mimetype } = file;
                const { uniqueId, s3Key } = await uploadToS3(buffer, originalname, mimetype, userId);
                await storeInitialMetadata(uniqueId, s3Key, originalname, userId);

                const presignedUrl = await generatePreSignedUrl(process.env.S3_BUCKET_NAME, s3Key, 3600);
                return {
                    imageId: uniqueId,
                    s3Key,
                    originalFileName: originalname,
                    presignedUrl,
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
