import React, { useState, useEffect } from "react";
import API from "../../api/api";
import ProgressBar from "../../components/common/ProgressBar";
import Tag from "../../components/common/Tag";

export default function CoursesPage({ setPage, setActiveCourse }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [courses, setCourses] = useState([]);

  const categories = [
    "All",
    "Web Dev",
    "Database",
    "AI/ML",
    "CS Fundamentals",
    "Cloud",
    "Design",
    "Security",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      (filter === "All" || c.category === filter) &&
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fade-up">
      <div className="mb-24">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          Course Library
        </div>
        <div style={{ color: "var(--text3)", fontSize: 14 }}>
          {courses.length} courses available
        </div>
      </div>

      <div className="search-bar mb-16" style={{ width: "100%", maxWidth: 480, marginBottom: 16 }}>
        <span style={{ color: "var(--text3)" }}>
           <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
        </span>
        <input
          style={{marginLeft: 8}}
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-bar" style={{display: 'flex', gap: 12, marginBottom: 32, overflowX: 'auto'}}>
        {categories.map((cat) => (
          <div
            key={cat}
            className={`filter-chip ${filter === cat ? "active" : ""}`}
            style={{padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, background: filter === cat ? 'var(--primary)' : 'var(--surface)', color: filter === cat ? 'white' : 'var(--text)'}}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="course-grid">
        {filtered.length === 0 && <div className="text-muted" style={{fontSize: 14}}>No courses found.</div>}
        {filtered.map((c, i) => (
          <div
            key={c._id}
            className="course-card fade-up"
            style={{ animationDelay: `${i * 0.06}s` }}
            onClick={() => {
              setActiveCourse(c);
              setPage("course-detail");
            }}
          >
            <img src={c.image} alt={c.title} className="course-image" />
            <div className="course-content">
              <div className="course-title">{c.title}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
                by {c.instructor?.name || "Instructor"}
              </div>

              <div className="course-description">{c.description}</div>

              <div className="course-footer" style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto"}}>
                <Tag label={c.category} color={c.color || "var(--primary)"} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>${Number(c.price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}