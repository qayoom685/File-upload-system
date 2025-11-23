const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer");
const { uploadFile, deleteFile } = require("../controllers/file.controller");

router.post("/", (req, res, next) => {
  const mw = upload("file"); 
  mw(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, uploadFile);


router.delete("/:path", deleteFile);

module.exports = router;
