const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  enrollCourse,
  getMyCourses,
} = require("../controllers/enrollmentController");

// Accessible to all users for testing/demo purposes
router.post("/", protect, authorizeRoles("STUDENT", "INSTRUCTOR", "ADMIN"), enrollCourse);
router.get("/my-courses", protect, authorizeRoles("STUDENT", "INSTRUCTOR", "ADMIN"), getMyCourses);

module.exports = router;