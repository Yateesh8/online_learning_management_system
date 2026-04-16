const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

// Configuration for local file storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|mp4|mkv|pdf|csv|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  if (extname && (mimetype || file.mimetype === 'application/octet-stream')) {
    return cb(null, true);
  } else {
    cb(new Error("Supported formats: Images, Videos, PDFs, CSV, and Excel only!"));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   POST /api/upload
router.post("/", protect, upload.single("media"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

module.exports = router;
