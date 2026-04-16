const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "STUDENT" });
    const instructors = await User.countDocuments({ role: "INSTRUCTOR" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({
      users: { total: totalUsers, students, instructors },
      courses: totalCourses,
      enrollments: totalEnrollments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
