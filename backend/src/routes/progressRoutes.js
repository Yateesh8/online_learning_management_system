const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const { markLectureComplete } = require("../controllers/progressController");

// Accessible to all enrolled roles testing courses
router.post("/markLectureComplete", protect, authorizeRoles("STUDENT", "INSTRUCTOR", "ADMIN"), markLectureComplete);

module.exports = router;
