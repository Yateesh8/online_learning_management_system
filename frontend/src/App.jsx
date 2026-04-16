import React, { useState, useEffect } from "react";
import API from "./api/api";
import { socket } from "./socket/socket";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";

import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/InstructorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

import CoursesPage from "./pages/Courses/CoursesPage";
import CourseDetail from "./pages/Courses/CourseDetail";
import LectureViewer from "./pages/Courses/LectureViewer";

import AssignmentsPage from "./pages/Assignments/AssignmentsPage";
import LeaderboardPage from "./pages/Leaderboard/LeaderboardPage";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";

export default function App() {
  const [auth, setAuth] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [page, setPage] = useState("dashboard");
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        setAuth(res.data.user);
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sync with course rooms for notifications
  useEffect(() => {
    if (auth && auth.role === 'STUDENT') {
      const syncRooms = async () => {
        try {
          const res = await API.get("/enrollments/my-courses");
          res.data.forEach(enrolledCourse => {
             socket.emit("joinCourse", enrolledCourse._id);
          });
        } catch (e) {
          console.error("Failed to sync sockets", e);
        }
      };
      syncRooms();
    }
  }, [auth]);



  if (loading) return <div>Loading...</div>;

  if (!auth) {
    return authMode === "login" ? (
      <LoginPage onAuth={setAuth} onSwitch={() => setAuthMode("signup")} />
    ) : (
      <SignupPage onAuth={setAuth} onSwitch={() => setAuthMode("login")} />
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        if (auth?.role === 'ADMIN') return <AdminDashboard user={auth} />;
        if (auth?.role === 'INSTRUCTOR') return <InstructorDashboard user={auth} />;
        return <StudentDashboard user={auth} setPage={setPage} />;
      case "instr-dashboard":
        return <InstructorDashboard user={auth} />;
      case "admin-dashboard":
        return <AdminDashboard user={auth} />;
      case "courses":
        return (
          <CoursesPage setPage={setPage} setActiveCourse={setActiveCourse} />
        );
      case "course-detail":
        return <CourseDetail course={activeCourse} setPage={setPage} />;
      case "lecture":
        if (!activeCourse) return <div>No course selected</div>;
        return <LectureViewer courseId={activeCourse._id} />;
      case "assignments":
        return <AssignmentsPage user={auth} />;
      case "leaderboard":
        return <LeaderboardPage user={auth} />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return auth?.role === 'ADMIN' ? <AdminDashboard user={auth} /> : (auth?.role === 'INSTRUCTOR' ? <InstructorDashboard user={auth} /> : <StudentDashboard user={auth} setPage={setPage} />);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={page}
        setPage={setPage}
        user={auth}
        onLogout={async () => {
          try {
            await API.post("/auth/logout");
          } catch(e) {}
          setAuth(null);
        }}
      />
      <div className="main-content">
        <Topbar page={page} />
        {renderPage()}
      </div>
    </div>
  );
}
