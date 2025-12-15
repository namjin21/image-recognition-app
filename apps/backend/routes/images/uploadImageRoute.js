import { Router } from "express";
import { getPresignedUploadUrl, finalizeUpload } from "../../controllers/uploadImageController.js";

const router = Router();
// router.post("/upload", upload.array("images", 100), handleUpload);

router.post("/presigned", getPresignedUploadUrl);
router.post("/finalize", finalizeUpload);

export default router;
