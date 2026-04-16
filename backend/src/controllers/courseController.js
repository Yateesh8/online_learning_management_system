const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lecture = require("../models/Lecture");

// CREATE COURSE (Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, category, image } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      price: price || 0,
      thumbnail: thumbnail || "",
      category: category || "General",
      image: image || "",
      instructor: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL COURSES (Public)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE COURSE
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COURSE (Instructor/Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // only owner can delete
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Cascade delete associated data
    await Lecture.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });

    await course.deleteOne();

    res.json({ message: "Course deleted successfully along with associated data" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};