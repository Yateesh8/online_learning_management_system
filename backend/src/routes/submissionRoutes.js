const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  submitAssignment,
} = require("../controllers/submissionController");

router.post("/", protect, authorizeRoles("STUDENT"), submitAssignment);

module.exports = router;