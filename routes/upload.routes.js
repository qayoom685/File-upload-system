// routes/upload.routes.js
const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer");
const { uploadFile, deleteFile } = require("../controllers/file.controller");

// Multiply use: field name must match .single name
router.post("/", (req, res, next) => {
  const mw = upload("file"); // single file field "file"
  mw(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, uploadFile);

// Delete endpoint (path should be encoded)
router.delete("/:path", deleteFile);

module.exports = router;
