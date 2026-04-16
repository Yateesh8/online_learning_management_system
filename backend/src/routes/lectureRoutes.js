const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  createLecture,
  getLecturesByCourse,
  deleteLecture,
} = require("../controllers/lectureController");

// Protected
router.get("/:courseId", protect, getLecturesByCourse);
router.post("/", protect, authorizeRoles("INSTRUCTOR"), createLecture);
router.delete("/:id", protect, authorizeRoles("INSTRUCTOR"), deleteLecture);

module.exports = router;