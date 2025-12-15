import multer from "multer";
import { storeInitialMetadata } from "../services/dynamoService.js";
import { convertToOptimizedS3Key, generateGetPresignedUrl, generateUploadPresignedUrl } from "../utils/s3Utils.js";
import { v4 as uuidv4 } from "uuid";

// Set up Multer for file handling
export const upload = multer({ storage: multer.memoryStorage() });

// export const handleUpload = async (req, res) => {
//     console.log(req.user.id);
//     try {
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ error: "No images uploaded" });
//         }

//         if (!req.user || !req.user.id) {
//             return res.status(400).json({error: "Could not verify user or user id does not exist"});
//         }

//         const userId = req.user.id;
//         const uploadResults = await Promise.all(
//             req.files.map(async (file) => {
//                 const { originalname, buffer, mimetype } = file;
//                 const { uniqueId, originalS3Key } = await uploadToS3(buffer, originalname, mimetype, userId);
//                 const optimizedS3Key = convertToOptimizedS3Key(originalS3Key);
//                 await storeInitialMetadata(uniqueId, originalS3Key, optimizedS3Key, originalname, userId);

//                 const presignedUrl = await generatePreSignedUrl(process.env.S3_BUCKET_NAME, optimizedS3Key, 3600);
//                 return {
//                     imageId: uniqueId,
//                     originalFileName: originalname,
//                     presignedUrl,
//                 }
//             })
//         )

//         res.status(200).json({ 
//             message: "Image uploaded successfully",
//             images: uploadResults
//          });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


export const getPresignedUploadUrl = async (req, res) => {
    try {
      const { fileName, fileType } = req.body;
  
      if (!fileName || !fileType) {
        return res.status(400).json({ error: "fileName and fileType required" });
      }
  
      const userId = req.user.id;
      const uniqueId = uuidv4();
      const ext = fileName.split(".").pop();
  
      const originalS3Key = `${userId}/original/${uniqueId}.${ext}`;
  
      const uploadUrl = await generateUploadPresignedUrl(process.env.S3_BUCKET_NAME, originalS3Key, fileType);
      console.log(`uploadUrl: ${uploadUrl}`)
  
      // optimized key (아직 파일 없음)
      const optimizedS3Key = convertToOptimizedS3Key(originalS3Key);
  
      res.status(200).json({
        uploadUrl,
        originalS3Key,
        optimizedS3Key,
        imageId: uniqueId,
      });
    } catch (err) {
      console.error("Error creating presigned URL:", err);
      res.status(500).json({ error: "Failed to create presigned URL" });
    }
};

// S3 업로드 끝난 후 metadata 저장 + return optimized image presigned URL
export const finalizeUpload = async (req, res) => {
    try {
        const { imageId, originalS3Key, originalFileName } = req.body;
    
        if (!imageId || !originalS3Key || !originalFileName) {
          return res.status(400).json({ error: "Invalid payload" });
        }
    
        const userId = req.user.id;
    
        const optimizedS3Key = convertToOptimizedS3Key(originalS3Key);
    
        // DynamoDB에 최초 메타데이터 저장
        await storeInitialMetadata(imageId, originalS3Key, optimizedS3Key, originalFileName, userId);
    
        // optimized 이미지에 대한 presigned GET URL
        const optimizedPresignedUrl = await generateGetPresignedUrl(
          process.env.S3_BUCKET_NAME,
          optimizedS3Key,
          3600
        );
    
        res.status(200).json({
            message: "Upload finalized",
            imageId,
            optimizedPresignedUrl,
            optimizedS3Key,
        });
    } catch (err) {
        console.error("Error finalizing upload:", err);
        res.status(500).json({ error: "Failed to finalize upload" });
    }
};