const express = require("express");
const { processImage } = require("../controllers/processImageController");

const router = express.Router();
router.post("/", processImage);

module.exports = router;