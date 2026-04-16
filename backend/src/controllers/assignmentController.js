const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

// CREATE ASSIGNMENT (Instructor)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, type, timeLimit, questions } = req.body;

    if (!title || !description || !courseId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      dueDate,
      type,
      timeLimit,
      questions
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ASSIGNMENTS BY COURSE
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};