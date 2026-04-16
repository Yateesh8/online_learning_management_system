const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  getNotifications,
  markAsRead,
  broadcastAnnouncement,
} = require("../controllers/notificationController");

// Fetch active users notifications
router.get("/", protect, getNotifications);

// Mark read
router.put("/:id/read", protect, markAsRead);

// Instructor broadcast feature
router.post("/announce", protect, authorizeRoles("INSTRUCTOR", "ADMIN"), broadcastAnnouncement);

module.exports = router;
