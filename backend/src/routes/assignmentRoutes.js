const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  createAssignment,
  getAssignments,
} = require("../controllers/assignmentController");

router.post("/", protect, authorizeRoles("INSTRUCTOR"), createAssignment);
router.get("/:courseId", protect, getAssignments);

module.exports = router;