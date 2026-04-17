import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/dashboard/analytics");
        setMetrics(res.data.metrics);
        setChartData(res.data.chartData);
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="page fade-up">Loading metrics...</div>;

  return (
    <div className="page fade-up">
      <div className="mb-24">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Platform Analytics</div>
        <div style={{ color: "var(--text3)", fontSize: 14 }}>Real-time usage and performance insights</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
           <div style={{ fontSize: 13, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Users</div>
           <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{metrics?.totalUsers || 0}</div>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
           <div style={{ fontSize: 13, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Active Courses</div>
           <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>{metrics?.totalCourses || 0}</div>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
           <div style={{ fontSize: 13, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Global Enrollments</div>
           <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>{metrics?.totalEnrollments || 0}</div>
        </div>
      </div>

      <div className="card p-24" style={{ padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Top Enrolled Courses</div>
        {chartData.length > 0 ? (
          <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{fill: "var(--text3)", fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: "var(--text3)", fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="students" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>No enrollment data available for charting.</div>
        )}
      </div>
    </div>
  );
}
