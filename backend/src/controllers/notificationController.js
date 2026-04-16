const Notification = require("../models/Notification");
const Enrollment = require("../models/Enrollment");

// GET ALL NOTIFICATIONS FOR USER
exports.getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK NOTIFICATION AS READ
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Not found" });
    res.json(notif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BROADCAST ANNOUNCEMENT TO ENROLLED CLASS
exports.broadcastAnnouncement = async (req, res) => {
  try {
    const { courseId, title, message } = req.body;
    if (!courseId || !title || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    // find all students enrolled in the course
    const enrollments = await Enrollment.find({ course: courseId });

    const notificationsToInsert = enrollments.map((en) => ({
      user: en.user,
      title,
      message,
      course: courseId,
    }));

    if (notificationsToInsert.length > 0) {
      await Notification.insertMany(notificationsToInsert);

      // Emit real-time notification to all connected students in the course room
      if (global.io) {
        global.io.to(courseId).emit("newNotification", {
          courseId,
          title,
          message,
          createdAt: new Date(),
          isRead: false
        });
      }
    }

    res.status(201).json({ message: `Announcement broadcasted to ${notificationsToInsert.length} students.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
