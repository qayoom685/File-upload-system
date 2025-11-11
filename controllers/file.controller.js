const fs = require("fs");
const path = require("path");
const { bucket } = require("../services/firebase");

// Upload -> move from tmp to Firebase Storage
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const localPath = path.join(process.cwd(), req.file.path);
    const destination = `uploads/${req.file.filename}`; // path in bucket

    // Upload to Firebase Storage
    await bucket.upload(localPath, {
      destination,
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedBy: req.body.uploader || "anonymous",
        },
      },
    });

    // Make file publicly accessible? (optional) - or set signed URL below
    // await bucket.file(destination).makePublic();

    // Generate a signed URL valid for e.g., 7 days
    const file = bucket.file(destination);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: expiresAt,
    });

    // Remove local temp file
    fs.unlinkSync(localPath);

    // Optionally store metadata in DB (filename, originalname, url, uploader, size, mimetype)
    const meta = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url,
      path: destination,
      uploadedAt: new Date(),
      uploader: req.body.uploader || null,
    };

    // return uploaded file meta
    res.status(201).json({ message: "File uploaded", file: meta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
};

// Delete file from Firebase
const deleteFile = async (req, res) => {
  try {
    const filePath = req.params.path; // e.g. uploads/12345-abc.pdf
    if (!filePath) return res.status(400).json({ message: "No path specified" });

    await bucket.file(filePath).delete();
    res.json({ message: "File deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadFile, deleteFile };
