const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { getAdminDashboard } = require("../controllers/adminController");

router.get("/dashboard", protect, authorizeRoles("ADMIN"), getAdminDashboard);

module.exports = router;
