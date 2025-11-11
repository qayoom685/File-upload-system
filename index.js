require("dotenv").config();
const express = require("express");
const path = require("path");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ensure uploads folder exists
const fs = require("fs");
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use("/api/uploads", uploadRoutes);

app.get("/", (req, res) => res.send("File Upload Service"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
