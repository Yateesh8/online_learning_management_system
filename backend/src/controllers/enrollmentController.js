const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ENROLL IN COURSE (Student only)
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Instructors are allowed to enroll in their own courses for testing
    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    res.status(500).json({ message: error.message });
  }
};

// GET MY COURSES
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate("course");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};