const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Enrollment = require("../models/Enrollment");

// SUBMIT ASSIGNMENT (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionUrl, answers } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ message: "Assignment ID required" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.type === "TEXT" && !submissionUrl) {
      return res.status(400).json({ message: "submissionUrl required for text assignments" });
    }

    if (assignment.type === "QUIZ" && !answers) {
      return res.status(400).json({ message: "answers required for quiz assignments" });
    }

    // check enrollment
    const enrolled = await Enrollment.findOne({
      user: req.user.id,
      course: assignment.course,
    });

    if (!enrolled) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    let grade = null;
    if (assignment.type === "QUIZ" && assignment.questions?.length > 0) {
      let score = 0;
      assignment.questions.forEach((q, i) => {
        if (answers[i] === q.correctOptionIndex) score++;
      });
      grade = Math.round((score / assignment.questions.length) * 100);
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      submissionUrl,
      answers,
      grade,
    });

    // emit real-time event
    if (global.io) {
      global.io.to(assignment.course.toString()).emit("submissionCreated", {
        assignmentId,
        studentId: req.user.id,
      });
    }

    res.status(201).json(submission);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already submitted" });
    }
    res.status(500).json({ message: error.message });
  }
};