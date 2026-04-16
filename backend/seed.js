const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

// Load models
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Enrollment = require("./src/models/Enrollment");

const mockCourseTitles = [
  { t: "Web Development Fundamentals", c: "Web Dev", i: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400" },
  { t: "Database Design & SQL", c: "Database", i: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
  { t: "Machine Learning with Python", c: "AI/ML", i: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400" },
  { t: "Data Structures in Java", c: "CS Fundamentals", i: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400" },
  { t: "Cloud Engineering with AWS", c: "Cloud", i: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" },
  { t: "UI/UX Masterclass", c: "Design", i: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400" },
  { t: "Cybersecurity Bootcamp", c: "Security", i: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400" },
  { t: "GraphQL & Apollo Server", c: "Web Dev", i: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400" },
  { t: "Modern CSS Architecture", c: "Web Dev", i: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400" },
  { t: "Docker & Kubernetes Basics", c: "Cloud", i: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400" },
  { t: "Rust for Beginners", c: "CS Fundamentals", i: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400" },
  { t: "Deep Learning Neural Networks", c: "AI/ML", i: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400" },
  { t: "MongoDB Performance Tuning", c: "Database", i: "https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=400" },
  { t: "Figma Prototyping", c: "Design", i: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400" },
  { t: "Ethical Hacking 101", c: "Security", i: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400" },
  { t: "Next.js Production Deployments", c: "Web Dev", i: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400" },
  { t: "Serverless Architecture", c: "Cloud", i: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" },
  { t: "NoSQL Database Patterns", c: "Database", i: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
  { t: "Applied AI Algorithms", c: "AI/ML", i: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400" },
  { t: "Agile Project Management", c: "CS Fundamentals", i: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400" },
  { t: "Color Theory for Web", c: "Design", i: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400" },
  { t: "Penetration Testing Tools", c: "Security", i: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400" },
  { t: "System Design Interviews", c: "CS Fundamentals", i: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400" },
  { t: "Azure Architect Strategies", c: "Cloud", i: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" },
  { t: "Vite + Vue3 Essentials", c: "Web Dev", i: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400" },
  { t: "Natural Language Processing", c: "AI/ML", i: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400" },
  { t: "Fullstack E-Commerce", c: "Web Dev", i: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400" },
  { t: "Redis Caching Strategies", c: "Database", i: "https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=400" }
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/learning_management_system";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB...");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log("Cleared existing data.");

    // Create password hash implicitly via hook
    const admin = new User({ name: "System Admin", email: "admin@lms.com", password: "password123", role: "ADMIN" });
    await admin.save();

    // Create Instructors
    const instructor1 = new User({ name: "Alan Turing", email: "alan@lms.com", password: "password123", role: "INSTRUCTOR" });
    const instructor2 = new User({ name: "Grace Hopper", email: "grace@lms.com", password: "password123", role: "INSTRUCTOR" });
    await instructor1.save();
    await instructor2.save();

    // Create Students
    const student1 = new User({ name: "Yateesh", email: "yateesh@lms.com", password: "password123", role: "STUDENT" });
    const student2 = new User({ name: "Sarah Jane", email: "sarah@lms.com", password: "password123", role: "STUDENT" });
    const student3 = new User({ name: "Robert Chase", email: "robert@lms.com", password: "password123", role: "STUDENT" });
    await student1.save();
    await student2.save();
    await student3.save();

    const createdCourses = [];

    for (let c of mockCourseTitles) {
      const course = await Course.create({
        title: c.t,
        description: `This is a comprehensive course covering the fundamentals of ${c.t}. Learn advanced architectures and deploy high performance code.`,
        instructor: Math.random() > 0.5 ? instructor1._id : instructor2._id,
        image: c.i,
        category: c.c,
        price: Number((Math.random() * 100 + 19.99).toFixed(2)),
        duration: Math.floor(Math.random() * 20) + 5,
        rating: (Math.random() * 1 + 4).toFixed(1),
        enrolled: Math.floor(Math.random() * 500) + 50,
      });
      createdCourses.push(course);
    }

    const enrollments = [];
    for (let course of createdCourses) {
      if (Math.random() > 0.1) {
         enrollments.push({ user: student1._id, course: course._id, progress: Math.floor(Math.random() * 100) });
      }
    }
    
    // Add some random enrollments for other students
    enrollments.push({ user: student2._id, course: createdCourses[0]._id, progress: 12 });
    enrollments.push({ user: student3._id, course: createdCourses[1]._id, progress: 100 });

    await Enrollment.create(enrollments);

    const Lecture = require("./src/models/Lecture");
    await Lecture.deleteMany({});
    const lecturesToInsert = [];
    
    for (let course of createdCourses) {
       for (let i = 1; i <= 3; i++) {
          lecturesToInsert.push({
             title: `Module ${i}: Core Concepts of ${course.title.split(" ")[0] || "Topic"}`,
             videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
             duration: Math.floor(Math.random() * 10) + 5,
             course: course._id,
             order: i
          });
       }
    }
    await Lecture.insertMany(lecturesToInsert);

    console.log(`Database Seeded with ${createdCourses.length} Courses!`);
    console.log("------------------------------------------");
    console.log("Admin Email: admin@lms.com");
    console.log("Instructor Email: alan@lms.com");
    console.log("Student Email: yateesh@lms.com");
    console.log("Global Password: password123");
    console.log("------------------------------------------");

    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
