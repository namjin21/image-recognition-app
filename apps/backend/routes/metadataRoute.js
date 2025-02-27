const express = require("express");
const { fetchMetadata } = require("../controllers/metadataController");

const router = express.Router();
router.get("/", fetchMetadata);

module.exports = router;