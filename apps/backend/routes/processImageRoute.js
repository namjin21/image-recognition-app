import express from "express";
import { processImage } from "../controllers/processImageController.js";

const router = express.Router();
router.post("/", processImage);

export default router;