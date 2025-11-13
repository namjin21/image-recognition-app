import express from "express";
import { fetchMetadata, fetchAllMetadata } from "../../controllers/metadataController.js";

const router = express.Router();
router.get("/:imageId", fetchMetadata);
router.get("/", fetchAllMetadata);

export default router;