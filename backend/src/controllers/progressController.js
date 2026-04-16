const Enrollment = require("../models/Enrollment");
const Lecture = require("../models/Lecture");

// MARK LECTURE COMPLETE
exports.markLectureComplete = async (req, res) => {
  try {
    const { lectureId } = req.body;

    if (!lectureId) {
      return res.status(400).json({ message: "Lecture ID required" });
    }

    const lecture = await Lecture.findById(lectureId).populate("course");

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (!lecture.course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: lecture.course._id,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    // avoid duplicates
    if (!enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
    }

    // calculate progress
    const totalLectures = await Lecture.countDocuments({
      course: lecture.course,
    });

    enrollment.progress =
      (enrollment.completedLectures.length / totalLectures) * 100;

    await enrollment.save();

    // emit events
    if (global.io) {
      global.io.emit("progressUpdated", {
        userId: req.user.id,
        courseId: lecture.course,
        progress: enrollment.progress,
      });

      global.io.emit("leaderboardUpdated");
      global.io.emit("analyticsUpdated");
    }

    res.json({
      message: "Lecture marked complete",
      progress: enrollment.progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
