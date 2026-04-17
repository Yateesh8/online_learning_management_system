import React, { useState, useEffect } from "react";
import API from "../../api/api";
import ProgressBar from "../../components/common/ProgressBar";
import Tag from "../../components/common/Tag";

export default function CourseDetail({ course, setPage }) {
  const [enrolled, setEnrolled] = useState(false);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    if(!course) return;
    const fetchL = async () => {
      try {
        const res = await API.get("/lectures/" + course._id);
        setLectures(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchL();
  }, [course]);

  if (!course) return null;

  return (
    <div className="page fade-up">
      <button
        className="btn btn-ghost btn-sm mb-24"
        style={{ marginBottom: 24 }}
        onClick={() => setPage("courses")}
      >
        ← Back to Courses
      </button>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "var(--surface2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              <img src={course.image} alt="course" style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </div>
            <div>
              <Tag label={course.category} color={"var(--primary)"} />
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 800,
                  marginTop: 6,
                  marginBottom: 4,
                }}
              >
                {course.title}
              </div>
              <div style={{ fontSize: 13, color: "var(--text3)" }}>
                by {course.instructor?.name || "Instructor"}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 15,
              color: "var(--text2)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {course.description}
          </div>

          <div
            className="card"
            style={{ padding: "20px 24px", marginBottom: 24 }}
          >
            <div style={{ display: "flex", gap: 32 }}>
              {[
                [<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>, lectures.length + " Lectures"],
                [<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, course.duration + "m"],
                [<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>, course.rating + " Rating"],
                [<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, course.enrolled.toLocaleString() + " Students"],
              ].map(([icon, text]) => (
                <div key={text} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, display: "flex", justifyContent: "center" }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-title mb-12" style={{ marginBottom: 12 }}>
            Lecture List
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            {lectures.length === 0 && <div style={{padding: 24, fontSize: 13}}>No lectures added yet.</div>}
            {lectures.map((lec, i) => (
              <div
                key={lec._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 20px",
                  borderBottom: i < lectures.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--surface2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div className={`lecture-check ${lec.completed ? "done" : ""}`}>
                  {lec.completed ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {lec.title}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                  {lec.duration} min
                </div>
                {lec.completed && <Tag label="Done" color="var(--success)" />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "sticky", top: 80, alignSelf: "start" }}>
          <div className="card" style={{ padding: "24px", overflow: "hidden" }}>
            <div style={{ marginBottom: 20 }}>
              <div className="progress-label" style={{ marginBottom: 8 }}>
                <span className="progress-text" style={{ fontSize: 14 }}>
                  Your Progress
                </span>
                <span
                  className="progress-pct"
                  style={{ fontSize: 16, fontWeight: 800 }}
                >
                  {course.progress || 0}%
                </span>
              </div>
              <ProgressBar value={course.progress || 0} color={"var(--primary)"} />
            </div>

            <button
              className={`btn ${enrolled ? "btn-secondary" : "btn-primary"} w-full`}
              style={{ justifyContent: "center", marginBottom: 12 }}
              onClick={async () => {
                try {
                  if (!enrolled) {
                     await API.post("/enrollments", { courseId: course._id });
                  }
                  setEnrolled(true);
                  setPage("lecture");
                } catch (e) {
                  // If 400 Already enrolled code, silently continue to lecture
                  if (e.response && e.response.status === 400) {
                     setEnrolled(true);
                     setPage("lecture");
                  } else {
                     console.log(e);
                  }
                }
              }}>
              {enrolled ? "✓ Enrolled · Continue" : "Enroll Now — Free"}
            </button>

            <div
              style={{
                fontSize: 12,
                color: "var(--text3)",
                textAlign: "center",
              }}
            >
              Full lifetime access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
