import express from "express";
import { analyzeImage } from "../../controllers/analyzeImageController.js";

const router = express.Router();
router.post("/:imageId/analyze", analyzeImage);

export default router;