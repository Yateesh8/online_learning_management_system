const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");

// STUDENT DASHBOARD
exports.getStudentDashboard = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate(
      "course",
    );

    res.json({
      totalCourses: enrollments.length,
      courses: enrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// INSTRUCTOR DASHBOARD
exports.getInstructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    });

    const totalStudents = enrollments.length;

    res.json({
      totalCourses: courses.length,
      totalStudents,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// COURSE LEADERBOARD
exports.getCourseLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;

    const leaderboard = await Enrollment.find({ course: courseId })
      .populate("user", "name email")
      .sort({ progress: -1 });

    const ranked = leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item.toObject(),
    }));
    res.json(ranked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PLATFORM ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    
    // Group enrollments by course (top N) for charting
    const enrollmentsByCourse = await Enrollment.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "courseData" } },
      { $unwind: "$courseData" },
      { $project: { name: "$courseData.title", students: "$count" } }
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalCourses,
        totalEnrollments
      },
      chartData: enrollmentsByCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
