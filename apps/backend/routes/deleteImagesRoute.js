const express = require("express");
const { deleteImages } = require("../controllers/deleteImageController");

const router = express.Router();
router.delete("/:userId", deleteImages);

module.exports = router;