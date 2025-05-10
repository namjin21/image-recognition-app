import express from "express";
import { deleteImages } from "../controllers/deleteImageController.js";

const router = express.Router();
router.delete("/:userId", deleteImages);

export default router;