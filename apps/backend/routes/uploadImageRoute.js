const express = require("express");
const { upload, handleUpload } = require("../controllers/uploadImageController");

const router = express.Router();
router.post("/", upload.array("images", 10), handleUpload);

module.exports = router;
