require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const http = require("http");
const { Server } = require("socket.io");

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;

    const server = http.createServer(app);

    // socket setup
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      },
    });

    // socket globally accessible
    global.io = io;

    // socket connection
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("joinCourse", (courseId) => {
        socket.join(courseId);
      });

      socket.on("lectureCompleted", ({ lectureId, courseId }) => {
        console.log("Lecture completed:", lectureId);

        // broadcast to that course only
        io.to(courseId).emit("progressUpdated", {
          lectureId,
          courseId,
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
