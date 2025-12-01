import { Router } from "express";
import { upload, handleUpload } from "../../controllers/uploadImageController.js";

const router = Router();
router.post("/upload", upload.array("images", 100), handleUpload);

export default router;
