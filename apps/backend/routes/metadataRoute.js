const express = require("express");
const { fetchMetadata, fetchAllMetadata } = require("../controllers/metadataController");

const router = express.Router();
router.get("/:imageId", fetchMetadata);
router.get("/all/:userId", fetchAllMetadata);

module.exports = router;