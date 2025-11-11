// middlewares/multer.js
const multer = require("multer");
const path = require("path");

const tmpStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (allowedMimeTypes) => (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type"), false);
};

const upload = (fieldName, options = {}) => {
  const allowed = options.allowed || [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "image/png",
    "image/jpeg",
  ];
  const maxSize = options.maxSize || parseInt(process.env.MAX_FILE_SIZE || "5242880", 10);

  return multer({
    storage: tmpStorage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter(allowed),
  }).single(fieldName);
};

module.exports = { upload };
