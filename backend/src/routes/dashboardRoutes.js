const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  getStudentDashboard,
  getInstructorDashboard,
  getCourseLeaderboard,
  getAnalytics,
} = require("../controllers/dashboardController");

// student
router.get("/student", protect, authorizeRoles("STUDENT"), getStudentDashboard);

// instructor
router.get("/instructor", protect, authorizeRoles("INSTRUCTOR"), getInstructorDashboard);

// leaderboard (both can access)
router.get("/leaderboard/:courseId", protect, getCourseLeaderboard);

// analytics
router.get("/analytics", protect, getAnalytics);

module.exports = router;