import React, { useState, useEffect } from "react";
import API from "../../api/api";
import ProgressBar from "../../components/common/ProgressBar";
import Avatar from "../../components/common/Avatar";
import { socket } from "../../socket/socket";

export default function StudentDashboard({ user, setPage }) {
  const [enrollments, setEnrollments] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [liveProgress, setLiveProgress] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/student");
        setEnrollments(res.data.courses);
        setTotalCourses(res.data.totalCourses);
        
        // Initialize live progress state from DB progress
        const initialProgress = {};
        res.data.courses.forEach(enroll => {
          initialProgress[enroll.course._id] = enroll.progress;
        });
        setLiveProgress(initialProgress);

        // Fetch leaderboard for the first enrolled course as a demo, or overall.
        // Actually, backend has /dashboard/leaderboard/:courseId
        if (res.data.courses.length > 0) {
          const lbRes = await API.get(`/dashboard/leaderboard/${res.data.courses[0].course._id}`);
          setLeaderboard(lbRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    // Listen for progress updates from socket
    const handler = (data) => {
      if(data.courseId && data.progress) {
        setLiveProgress(prev => ({
          ...prev,
          [data.courseId]: data.progress
        }));
      }
    };
    socket.on("progressUpdated", handler);
    return () => socket.off("progressUpdated", handler);
  }, []);

  const progressVals = Object.values(liveProgress);
  const avg = progressVals.length ? Math.round(progressVals.reduce((a, b) => a + b, 0) / progressVals.length) : 0;
  const completed = progressVals.filter(p => p >= 90).length;

  return (
    <div className="page fade-up">
      <div className="mb-24">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          Good morning, {user.name.split(" ")[0]}
        </div>
        <div style={{ color: "var(--text3)", fontSize: 14 }}>You're on a 7-day streak · Keep it up!</div>
      </div>

      <div className="dashboard-grid">
        {[
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>, label: "Enrolled Courses", value: totalCourses, sub: "current taken" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Completed", value: completed, sub: "courses finished" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, label: "Avg Progress", value: `${avg}%`, sub: "across all courses" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, label: "Day Streak", value: "7", sub: "days in a row" },
        ].map((s, i) => (
          <div key={i} className="stat-card card fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-header mb-16">
            <div>
              <div className="section-title">Enrolled Courses</div>
              <div className="section-sub">Live progress tracking <span className="live-dot" style={{ marginLeft: 6 }} /></div>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => setPage("courses")}>View All</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {enrollments.slice(0, 4).map((enroll, i) => {
              const c = enroll.course;
              const p = liveProgress[c._id] || 0;
              return (
              <div key={c._id} className="card p-24" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img src={c.image} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.category}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--primary)" }}>{Math.round(p)}%</div>
                </div>
                <ProgressBar value={p} color={"var(--primary)"} />
              </div>
            )})}
          </div>
        </div>

        <div>
          <div className="section-header mb-16">
            <div><div className="section-title">Leaderboard</div><div className="section-sub">Top performers in first course</div></div>
          </div>

          <div className="card">
            {leaderboard.length === 0 && <div className="p-24" style={{fontSize: 13, padding: 24}}>No leaderboard data yet.</div>}
            {leaderboard.slice(0, 5).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <div className="rank-badge" style={{
                  background: i === 0 ? "var(--primary)" : i === 1 ? "var(--primary-light)" : i === 2 ? "var(--accent-light)" : "var(--surface)",
                  color: i === 0 ? "white" : i === 1 ? "var(--text)" : i === 2 ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: 500, fontSize: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%"
                }}>
                  {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${s.rank}`}
                </div>
                <Avatar name={s.user.name} color={"var(--primary)"} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.user.name}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--primary)" }}>{s.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
