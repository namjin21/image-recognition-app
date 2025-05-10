import { Router } from "express";
import { upload, handleUpload } from "../controllers/uploadImageController.js";

const router = Router();
router.post("/", upload.array("images", 10), handleUpload);

export default router;
