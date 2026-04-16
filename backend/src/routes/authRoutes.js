const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../utils/validators");
const protect = require("../middlewares/authMiddleware"); // ✅ FIX

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});
router.get("/me", protect, getMe);

module.exports = router;