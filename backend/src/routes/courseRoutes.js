const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
} = require("../controllers/courseController");

// Public
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Instructor only
router.post("/", protect, authorizeRoles("INSTRUCTOR"), createCourse);
router.delete("/:id", protect, authorizeRoles("INSTRUCTOR"), deleteCourse);

module.exports = router;