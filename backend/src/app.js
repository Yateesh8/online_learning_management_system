const express = require("express");
const errorMiddleware = require("./middlewares/errorMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lectures", require("./routes/lectureRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// mount static path
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// error middleware
app.use(errorMiddleware);

module.exports = app;
