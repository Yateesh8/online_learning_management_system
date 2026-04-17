import React, { useState, useEffect } from "react";
import API from "../../api/api";

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({ users: {}, courses: 0, enrollments: 0 });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="page fade-up">
      <div className="mb-24">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          System Overview
        </div>
        <div style={{ color: "var(--text3)", fontSize: 14 }}>Admin metrics and platform status</div>
      </div>

      <div className="dashboard-grid">
        {[
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, label: "Total Users", value: stats.users.total || 0, sub: "registered accounts" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>, label: "Total Courses", value: stats.courses || 0, sub: "active on platform" },
          { icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, label: "Enrollments", value: stats.enrollments || 0, sub: "global seats filled" },
        ].map((s, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="two-col mb-24">
        <div>
          <div className="section-header mb-16">
            <div><div className="section-title">User Demographics</div></div>
          </div>
          <div className="card p-24" style={{padding: 24}}>
             <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 12}}>
                <span style={{color: 'var(--text-secondary)'}}>Students</span>
                <span style={{fontWeight: 600}}>{stats.users.students || 0}</span>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: 'var(--text-secondary)'}}>Instructors</span>
                <span style={{fontWeight: 600}}>{stats.users.instructors || 0}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
