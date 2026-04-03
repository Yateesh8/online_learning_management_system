const express = require("express");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));

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
