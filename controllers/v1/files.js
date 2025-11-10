/* eslint-disable no-console */
const path = require("path");
const multer = require("multer");
const { put } = require("@vercel/blob");

// allow only jpeg/jpg/png
const allowedMimeTypes = [".png", ".jpg", "image/jpeg"];
const filetypes = /jpeg|jpg|png/;

const maxCount = 10;

// in-memory: we'll upload buffers to Blob
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = filetypes.test(file.mimetype);
    const extname = allowedMimeTypes.includes(ext);
    if (mimetype && extname) return cb(null, true);
    return cb(new Error("Only jpeg/jpg/png files allowed"));
  },
}).array("files", maxCount);

exports.uploadFiles = (req, res) => {
  upload(req, res, async (err) => {
    if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
      console.info("file upload failed", err);
      return res.status(500).json({ code: 500, message: "File upload failed" });
    }
    try {
      const files = req.files || [];
      const results = [];

      for (const f of files) {
        const key = `secret-time/uploads/${Date.now()}-${f.originalname}`.replace(/\s+/g, "-");
        // Node 20 has global Blob; convert buffer → Blob
        const blob = new Blob([f.buffer], { type: f.mimetype });
        const { url } = await put(key, blob, {
          access: "public",
          contentType: f.mimetype,
          token: process.env.RITE_TOKEN || process.env.BLOB_WRITE_TOKEN,
        });
        results.push({ url, key, mimetype: f.mimetype, size: f.size });
      }

      return res.status(200).json({ code: 200, message: "Files uploaded", data: results });
    } catch (e) {
      console.error("Blob upload error", e);
      return res.status(500).json({ code: 500, message: "Blob upload error", error: String(e) });
    }
  });
};
