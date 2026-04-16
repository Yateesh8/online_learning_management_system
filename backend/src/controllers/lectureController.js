const Lecture = require("../models/Lecture");
const Course = require("../models/Course");

// CREATE LECTURE (Instructor only)
exports.createLecture = async (req, res) => {
  try {
    const { title, videoUrl, courseId, order } = req.body;

    if (!title || !videoUrl || !courseId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ownership check
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lecture = await Lecture.create({
      title,
      videoUrl,
      course: courseId,
      order,
    });

    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LECTURES BY COURSE
exports.getLecturesByCourse = async (req, res) => {
  try {
    const lectures = await Lecture.find({
      course: req.params.courseId,
    }).sort("order");

    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LECTURE
exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const course = await Course.findById(lecture.course);

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await lecture.deleteOne();

    res.json({ message: "Lecture deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};