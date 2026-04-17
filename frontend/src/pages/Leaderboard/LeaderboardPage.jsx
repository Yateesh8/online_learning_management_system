import React, { useState, useEffect, useMemo } from "react";
import API from "../../api/api";
import Avatar from "../../components/common/Avatar";
import { socket } from "../../socket/socket";

const PodiumItem = ({ student, rank, color }) => {
  const isFirst = rank === 1;
  return (
    <div className="fade-up" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 12,
      padding: '24px 16px',
      background: isFirst ? 'var(--surface)' : 'transparent',
      border: isFirst ? '1px solid var(--border)' : 'none',
      width: isFirst ? 160 : 140,
      zIndex: isFirst ? 2 : 1,
      transform: isFirst ? 'translateY(-20px)' : 'none'
    }}>
      <div style={{ position: 'relative' }}>
         <div style={{ 
           width: isFirst ? 80 : 64, 
           height: isFirst ? 80 : 64, 
           border: `2px solid ${color}`, 
           padding: 2, 
           background: 'var(--surface)' 
         }}>
           <Avatar name={student.user?.name} size={isFirst ? 74 : 58} />
         </div>
         <div style={{ 
           position: 'absolute', 
           bottom: -8, 
           right: -4, 
           background: color, 
           color: 'white', 
           width: 28, 
           height: 28, 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'center', 
           fontSize: 12, 
           fontWeight: 800,
           border: '1px solid white'
         }}>
           {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
         </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--primary)' }}>{student.user?.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{student.progress}% Complete</div>
      </div>
    </div>
  );
};

export default function LeaderboardPage({ user }) {
  const [board, setBoard] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res;
        if (user?.role === 'INSTRUCTOR') {
          res = await API.get("/dashboard/instructor");
          setCourses(res.data.courses);
          if (res.data.courses.length > 0) setSelectedCourseId(res.data.courses[0]._id);
        } else {
          res = await API.get("/enrollments/my-courses");
          setCourses(res.data);
          if (res.data.length > 0) setSelectedCourseId(res.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [user]);

  // Fetch leaderboard when course changes
  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchLB = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/dashboard/leaderboard/${selectedCourseId}`);
        setBoard(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLB();
  }, [selectedCourseId]);

  // Real-time updates
  useEffect(() => {
    const handler = (data) => {
       if (data.courseId === selectedCourseId) {
          setBoard(prev => {
             const exist = prev.find(p => p.user._id === data.userId);
             if (exist) {
                const updated = prev.map(p => p.user._id === data.userId ? {...p, progress: data.progress} : p);
                return updated.sort((a,b) => b.progress - a.progress).map((u, i) => ({...u, rank: i+1}));
             }
             return prev;
          });
       }
    };
    socket.on("progressUpdated", handler);
    return () => socket.off("progressUpdated", handler);
  }, [selectedCourseId]);

  const selectedCourseName = useMemo(() => {
    return courses.find(c => c._id === selectedCourseId)?.title || "Select Course";
  }, [courses, selectedCourseId]);

  const top3 = useMemo(() => board.slice(0, 3), [board]);
  const others = useMemo(() => board.slice(3), [board]);

  return (
    <div className="page fade-up">
      <div className="mb-24" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>Hall of Fame</h2>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Celebrate our top learners and their progress.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
           <select className="form-input" style={{ minWidth: 200, padding: '10px 16px', cursor: 'pointer' }} value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
              <option value="" disabled>Choose a course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
           </select>
        </div>
      </div>

      {!selectedCourseId && (
        <div className="card text-center" style={{ padding: '80px 24px' }}>
           <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
           <h3 style={{ fontWeight: 400, color: 'var(--primary)' }}>Choose Your Path</h3>
           <p style={{ color: 'var(--text-secondary)' }}>Select a course from the dropdown above to view its top performers.</p>
        </div>
      )}

      {selectedCourseId && board.length === 0 && !loading && (
        <div className="card text-center" style={{ padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <h3 style={{ fontWeight: 400, color: 'var(--primary)' }}>Silent Waters</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No students have progress recorded for this course yet.</p>
        </div>
      )}

      {selectedCourseId && board.length > 0 && (
        <>
          {/* Podium Area */}
          <div className="mb-24" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-end', 
            gap: 16, 
            padding: '48px 0',
            borderBottom: '1px solid var(--border)',
            marginBottom: 48
          }}>
            {top3[1] && <PodiumItem student={top3[1]} rank={2} color="#94a3b8" />}
            {top3[0] && <PodiumItem student={top3[0]} rank={1} color="#f59e0b" />}
            {top3[2] && <PodiumItem student={top3[2]} rank={3} color="#d97706" />}
          </div>

          <div className="section-header mb-16">
             <div className="section-title">Global Rankings · {selectedCourseName}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {others.map((s, i) => (
              <div key={s.user?._id} className="card fade-up" style={{ 
                padding: "16px 24px", 
                display: 'flex', 
                alignItems: 'center', 
                gap: 20,
                animationDelay: `${i * 0.1}s` 
              }}>
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 12, 
                  fontWeight: 800,
                  color: 'var(--text-secondary)'
                }}>
                  #{s.rank}
                </div>
                <Avatar name={s.user?.name} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.user?.name}</div>
                  <div style={{ width: '100%', maxWidth: 300 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>Progress</span>
                      <span>{s.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--surface-alt)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                      <div style={{ width: `${s.progress}%`, height: '100%', background: 'var(--text)', transition: 'var(--transition)' }}></div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 13 }}>LEVEL UP</div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rising Star</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
