import React, { useState, useEffect } from "react";
import API from "../../api/api";
import ProgressBar from "../../components/common/ProgressBar";
import Avatar from "../../components/common/Avatar";
import Tag from "../../components/common/Tag";

// Toast Notification Sub-component
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast" style={{ background: type === 'error' ? 'var(--accent)' : 'var(--primary)' }}>
      {type === 'success' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      )}
      <span>{message}</span>
    </div>
  );
};

export default function InstructorDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  const [activeCourseId, setActiveCourseId] = useState("");
  const [activeTab, setActiveTab] = useState("course"); // course, lecture, upload, broadcast
  
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceMsg, setAnnounceMsg] = useState("");
  
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Notifications
  const [toast, setToast] = useState(null);

  // New Course States
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseCat, setNewCourseCat] = useState("Web Dev");
  const [newCoursePrice, setNewCoursePrice] = useState("");
  const [newCourseImg, setNewCourseImg] = useState("");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // New Lecture States
  const [newLecTitle, setNewLecTitle] = useState("");
  const [newLecUrl, setNewLecUrl] = useState("");
  const [newLecDur, setNewLecDur] = useState("");
  const [isCreatingLec, setIsCreatingLec] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/instructor");
        setCourses(res.data.courses);
        setTotalCourses(res.data.totalCourses);
        setTotalStudents(res.data.totalStudents);
        if (res.data.courses.length > 0) setActiveCourseId(res.data.courses[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleBroadcast = async () => {
     try {
        await API.post("/notifications/announce", { courseId: activeCourseId, title: announceTitle, message: announceMsg });
        showToast("Broadcast sent to students!");
        setAnnounceTitle("");
        setAnnounceMsg("");
     } catch (e) {
        showToast("Failed to send broadcast", "error");
     }
  };

  const handleUpload = async () => {
     if (!uploadFile) return;
     setUploading(true);
     try {
        const fd = new FormData();
        fd.append("media", uploadFile);
        const res = await API.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setUploadedUrl(`http://localhost:8000${res.data}`);
        showToast("File uploaded successfully!");
     } catch (e) {
        showToast("Upload failed", "error");
     } finally {
        setUploading(false);
     }
  };

  const handleCreateCourse = async () => {
    try {
      setIsCreatingCourse(true);
      const res = await API.post("/courses", {
        title: newCourseTitle,
        description: newCourseDesc,
        category: newCourseCat,
        price: Number(newCoursePrice) || 0,
        image: newCourseImg,
        thumbnail: newCourseImg
      });
      setCourses([res.data, ...courses]);
      setActiveCourseId(res.data._id);
      setNewCourseTitle("");
      setNewCourseDesc("");
      setNewCoursePrice("");
      setNewCourseImg("");
      showToast("New course launched!");
    } catch (e) {
      showToast("Creation failed", "error");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleCreateLecture = async () => {
    if (!activeCourseId) return;
    try {
      setIsCreatingLec(true);
      await API.post("/lectures", {
        title: newLecTitle,
        videoUrl: newLecUrl,
        duration: Number(newLecDur) || 0,
        courseId: activeCourseId
      });
      setNewLecTitle("");
      setNewLecUrl("");
      setNewLecDur("");
      showToast("Lecture added to course");
    } catch (e) {
      showToast("Failed to add lecture", "error");
    } finally {
      setIsCreatingLec(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? All associated data will be lost permanently.")) return;
    try {
      await API.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
      showToast("Course deleted permanently");
      if (activeCourseId === id) setActiveCourseId(courses.length > 1 ? courses.find(c => c._id !== id)?._id : "");
    } catch (e) {
      showToast("Failed to delete course", "error");
    }
  };

  return (
    <div className="page fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-24" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontWeight: 800, color: 'var(--primary)' }}>Instructor Dashboard</h2>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Empower your students with high-quality content.</p>
        </div>
        <div style={{ padding: '8px 16px', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="live-dot"></div>
          Live Control Panel
        </div>
      </div>

      <div className="dashboard-grid">
        {[
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>, label: "Total Courses", value: totalCourses, sub: "Published", color: "var(--primary)" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, label: "Total Students", value: totalStudents, sub: "Learning now", color: "var(--accent)" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, label: "Avg Engagement", value: "84%", sub: "+12% this week", color: "#10b981" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>, label: "Avg Rating", value: "4.8", sub: "from 1.2k reviews", color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-icon" style={{ border: `1px solid ${s.color}`, color: s.color }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="two-col mb-24">
        <div>
          <div className="section-header mb-16">
            <div className="section-title">Enrolled Courses</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 24 }}>
            {courses.length === 0 && (
              <div className="card text-center" style={{ padding: 48 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
                <h4 style={{ fontWeight: 400 }}>Ready to teach?</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Create your first course to start inspiring students today.</p>
                <button className="btn btn-primary" style={{ margin: '16px auto 0' }} onClick={() => setActiveTab("course")}>Start Building</button>
              </div>
            )}
            {courses.map(c => (
              <div key={c._id} className="card" style={{ padding: "16px", display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, border: "1px solid var(--border)", background: "var(--surface-alt)", overflow: "hidden" }}>
                  {c.image ? <img src={c.image} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'}}><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> {c.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> ${c.price}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                   <button className="icon-btn" title="Edit" onClick={() => { setActiveCourseId(c._id); setActiveTab("lecture"); }} style={{ width: 36, height: 36, border: '1px solid var(--border)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                   </button>
                   <button className="icon-btn" title="Delete Course" onClick={() => handleDeleteCourse(c._id)} style={{ width: 36, height: 36, border: '1px solid var(--border)', color: '#ef4444' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-header mb-16">
            <div className="section-title">Control Center</div>
          </div>
          
          <div className="action-tabs">
            {[
              { id: 'course', label: 'Launcher' },
              { id: 'lecture', label: 'Studio' },
              { id: 'upload', label: 'Storage' },
              { id: 'broadcast', label: 'Broadcast' }
            ].map(t => (
              <div key={t.id} className={`action-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>

          <div className="card p-24" style={{ minHeight: 320 }}>
            {activeTab === 'course' && (
              <div className="fade-up">
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Course Launcher</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Configure your new learning program.</p>
                <input className="form-input mb-12 w-full" placeholder="Ex: Master React.js 2026" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} />
                <textarea className="form-input mb-12 w-full" placeholder="What will students learn?..." rows={2} value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} />
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <select className="form-input" style={{ flex: 1 }} value={newCourseCat} onChange={e => setNewCourseCat(e.target.value)}>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Design">Design</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Business">Business</option>
                  </select>
                  <input type="number" className="form-input" style={{ width: 100 }} placeholder="Price ($)" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} />
                </div>
                <input className="form-input mb-16 w-full" placeholder="Cover Image URL" value={newCourseImg} onChange={e => setNewCourseImg(e.target.value)} />
                <button className="btn btn-primary w-full" onClick={handleCreateCourse} disabled={!newCourseTitle || isCreatingCourse}>
                  {isCreatingCourse ? "Launching..." : "Deploy Course"}
                </button>
              </div>
            )}

            {activeTab === 'lecture' && (
              <div className="fade-up">
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Lecture Studio</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Inject new content into your courses.</p>
                <select className="form-input mb-12 w-full" value={activeCourseId} onChange={e => setActiveCourseId(e.target.value)}>
                   {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
                <input className="form-input mb-12 w-full" placeholder="Lecture Title" value={newLecTitle} onChange={e => setNewLecTitle(e.target.value)} />
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                   <input className="form-input" placeholder="Video URL" style={{ flex: 1 }} value={newLecUrl} onChange={e => setNewLecUrl(e.target.value)} />
                   <input type="number" className="form-input" placeholder="Mins" style={{ width: 80 }} value={newLecDur} onChange={e => setNewLecDur(e.target.value)} />
                </div>
                <button className="btn btn-primary w-full" disabled={!newLecTitle || !newLecUrl || isCreatingLec} onClick={handleCreateLecture}>
                  Push to Course
                </button>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="fade-up">
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Secure Storage</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Upload assets directly to the LMS cloud.</p>
                <div className="card" style={{ borderStyle: 'dashed', padding: '32px 20px', textAlign: 'center', marginBottom: 16 }}>
                   <input type="file" id="file-up" style={{ display: 'none' }} onChange={e => setUploadFile(e.target.files[0])} />
                   <label htmlFor="file-up" style={{ cursor: 'pointer' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{uploadFile ? uploadFile.name : "Click to browse files"}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>MP4, PDF, PNG, CSV, Excel supported</div>
                   </label>
                </div>
                <button className="btn btn-primary w-full" onClick={handleUpload} disabled={uploading || !uploadFile}>
                  {uploading ? "Uploading..." : "Upload & Generate Link"}
                </button>
                {uploadedUrl && (
                  <div style={{ marginTop: 16, padding: '12px', background: 'var(--accent-light)', borderRadius: '10px', fontSize: '11px', wordBreak: 'break-all', border: '1px solid var(--accent)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>URL: </span> {uploadedUrl}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'broadcast' && (
              <div className="fade-up">
                 <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Class Broadcast</h4>
                 <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Send a push notification to all students.</p>
                 <select className="form-input mb-12 w-full" value={activeCourseId} onChange={e => setActiveCourseId(e.target.value)}>
                    <option value="" disabled>Select a Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                 </select>
                 <input className="form-input mb-12 w-full" placeholder="Announcement Subject" value={announceTitle} onChange={e => setAnnounceTitle(e.target.value)} />
                 <textarea className="form-input mb-12 w-full" placeholder="Write your message..." rows={3} value={announceMsg} onChange={e => setAnnounceMsg(e.target.value)} />
                 <button className="btn btn-primary w-full" disabled={!announceTitle || !announceMsg || !activeCourseId} onClick={handleBroadcast}>
                    Send Blast
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}