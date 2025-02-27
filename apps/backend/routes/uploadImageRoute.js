const express = require("express");
const { upload, handleUpload } = require("../controllers/uploadImageController");

const router = express.Router();
router.post("/", upload.single("image"), handleUpload);

module.exports = router;
