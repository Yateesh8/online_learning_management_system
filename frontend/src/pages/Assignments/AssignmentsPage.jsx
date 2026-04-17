import React, { useState, useEffect } from "react";
import API from "../../api/api";

export default function AssignmentsPage({ user }) {
  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState("");
  const [assignments, setAssignments] = useState([]);

  // Instructor Builder States
  const [showBuilder, setShowBuilder] = useState(false);
  const [newType, setNewType] = useState("TEXT");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);

  // Student Submitting States
  const [submitting, setSubmitting] = useState(null);
  const [url, setUrl] = useState(""); // For TEXT
  const [quizAnswers, setQuizAnswers] = useState({}); // For QUIZ: { questionIndex: chosenOptionIndex }

  useEffect(() => {
    // Fetch courses the user is involved with
    const fetchCourses = async () => {
      try {
        if (user.role === "INSTRUCTOR") {
          const res = await API.get("/dashboard/instructor");
          setCourses(res.data.courses);
          if (res.data.courses.length > 0) setActiveCourseId(res.data.courses[0]._id);
        } else if (user.role === "STUDENT") {
          const res = await API.get("/dashboard/student");
          setCourses(res.data.courses.map(e => e.course));
          if (res.data.courses.length > 0) setActiveCourseId(res.data.courses[0].course._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    if (!activeCourseId) return;
    const fetchA = async () => {
      try {
        const res = await API.get(`/assignments/${activeCourseId}`);
        setAssignments(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchA();
  }, [activeCourseId]);

  // --- Instructor Functions ---
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 }]);
  };

  const updateQuestion = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const submitNewAssignment = async () => {
    try {
      const payload = {
        title: newTitle,
        description: newDesc,
        courseId: activeCourseId,
        type: newType,
        timeLimit: newType === "QUIZ" ? parseInt(timeLimit) || 0 : null,
        questions: newType === "QUIZ" ? questions : [],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
      };
      
      const res = await API.post("/assignments", payload);
      setAssignments([...assignments, res.data]);
      
      // Reset
      setShowBuilder(false);
      setNewTitle("");
      setNewDesc("");
      setNewType("TEXT");
      setQuestions([]);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Student Functions ---
  const submitTextAssignment = async (id) => {
    try {
      await API.post(`/submissions`, { assignmentId: id, submissionUrl: url });
      setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: "submitted" } : a));
      setSubmitting(null);
      setUrl("");
    } catch(e) { console.error(e); }
  };

  const submitQuizAssignment = async (id) => {
    try {
      const res = await API.post(`/submissions`, { assignmentId: id, answers: quizAnswers });
      
      setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: "submitted", grade: res.data.grade } : a));
      setSubmitting(null);
    } catch(e) { console.error(e); }
  };

  return (
    <div className="page fade-up pb-24">
      <div className="mb-24" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Assignments &amp; Quizzes</div>
          <div style={{ color: "var(--text3)", fontSize: 14 }}>
            Manage coursework and tests
          </div>
        </div>

        <div style={{display: 'flex', gap: 12}}>
          {courses.length > 0 && (
            <select className="form-input" value={activeCourseId} onChange={e => setActiveCourseId(e.target.value)}>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          )}

          {user?.role === "INSTRUCTOR" && courses.length > 0 && (
            <button className="btn btn-primary" onClick={() => setShowBuilder(!showBuilder)}>
              {showBuilder ? "Cancel Builder" : "+ New Assignment"}
            </button>
          )}
        </div>
      </div>

      {!activeCourseId && <div className="card p-24" style={{padding: 24, fontSize: 13}}>You need active courses to view assignments.</div>}

      {showBuilder && user?.role === "INSTRUCTOR" && activeCourseId && (
        <div className="card mb-24" style={{padding: 24, background: "var(--surface2)"}}>
          <div className="section-title mb-16">Assignment Studio</div>
          <div style={{display: 'flex', gap: 12, marginBottom: 16}}>
            <input className="form-input" placeholder="Assignment Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{flex: 1}}/>
            <select className="form-input" value={newType} onChange={e => setNewType(e.target.value)}>
              <option value="TEXT">Text Submission</option>
              <option value="QUIZ">Interactive Quiz</option>
            </select>
          </div>
          
          <textarea className="form-input mb-16" placeholder="Instructions/Description..." value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} style={{width: '100%', resize: 'vertical'}} />

          {newType === "QUIZ" && (
             <div className="mb-16">
               <div style={{fontSize: 14, fontWeight: 600, marginBottom: 8}}>Quiz Configuration</div>
               <input className="form-input mb-16" type="number" placeholder="Time Limit (Minutes)" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} style={{width: 200}}/>
               
               {questions.map((q, qIndex) => (
                 <div key={qIndex} className="card p-16 mb-16" style={{padding: 16, border: '1px solid var(--border)'}}>
                    <input className="form-input mb-12" placeholder={`Question ${qIndex + 1}`} value={q.questionText} onChange={e => updateQuestion(qIndex, 'questionText', e.target.value)} style={{width: '100%'}}/>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12}}>
                      {q.options.map((opt, oIndex) => (
                         <div key={oIndex} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                           <input type="radio" checked={q.correctOptionIndex === oIndex} onChange={() => updateQuestion(qIndex, 'correctOptionIndex', oIndex)}/>
                           <input className="form-input btn-sm" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} style={{flex: 1}}/>
                         </div>
                      ))}
                    </div>
                 </div>
               ))}
               <button className="btn btn-secondary btn-sm" onClick={addQuestion}>+ Add Target Question</button>
             </div>
          )}

          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
             <button className="btn btn-primary" onClick={submitNewAssignment} disabled={!newTitle || !newDesc}>Deploy to Course</button>
          </div>
        </div>
      )}

      {assignments.length === 0 && activeCourseId && !showBuilder && <div className="card p-24" style={{padding: 24, fontSize: 13}}>No assignments active for this course.</div>}

      {assignments.map(a => (
        <div key={a._id} className="card assignment-card card-hover mb-12">
          <div className="assignment-header">
            <div>
              <div className="assignment-title" style={{display: 'flex', alignItems: 'center', gap: 8}}>
                {a.title} 
                {a.type === "QUIZ" && <span style={{fontSize: 10, background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: 12}}>QUIZ</span>}
              </div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>📚 Course Overview</div>
            </div>
            {user?.role === "STUDENT" && (
              <span className={`status-badge ${a.status === "submitted" ? "status-submitted" : "status-pending"}`}>
                {a.status === "submitted" ? "✓ Submitted" : "⏳ Pending"}
              </span>
            )}
            {user?.role === "INSTRUCTOR" && (
              <span className={`status-badge`} style={{background: 'var(--surface2)', color: 'var(--text)'}}>Active Task</span>
            )}
          </div>

          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14 }}>{a.description}</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>
               Due: {new Date(a.dueDate).toLocaleDateString()}
               {a.type === "QUIZ" && a.timeLimit && ` · Limit: ${a.timeLimit} mins`}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: 'center' }}>
              {a.grade !== undefined && <div style={{ color: "var(--success)", fontWeight: 600 }}>Grade: {a.grade}%</div>}
              
              {user?.role === "STUDENT" && a.status !== "submitted" && (
                <button className="btn btn-sm btn-primary" onClick={() => setSubmitting(submitting === a._id ? null : a._id)}>
                  {a.type === "QUIZ" ? "Take Quiz" : "Submit Link"}
                </button>
              )}
            </div>
          </div>

          {/* Student Testing UI */}
          {submitting === a._id && (
            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              {a.type === "TEXT" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="form-input" placeholder="Google Drive or Github Repository URL" value={url} onChange={e => setUrl(e.target.value)} style={{flex: 1}} />
                  <button className="btn btn-sm btn-primary" onClick={() => submitTextAssignment(a._id)}>Confirm</button>
                </div>
              ) : (
                <div>
                  <div style={{fontWeight: 600, marginBottom: 16}}>Quiz Mode Started</div>
                  {a.questions.map((q, i) => (
                     <div key={i} style={{marginBottom: 16}}>
                        <div style={{fontSize: 14, marginBottom: 8}}>{i + 1}. {q.questionText}</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                           {q.options.map((o, optIdx) => (
                              <label key={optIdx} style={{fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
                                 <input type="radio" name={`quiz-${a._id}-q${i}`} onChange={() => setQuizAnswers({...quizAnswers, [i]: optIdx})} />
                                 {o}
                              </label>
                           ))}
                        </div>
                     </div>
                  ))}
                  <button className="btn btn-sm btn-primary" onClick={() => submitQuizAssignment(a._id)}>Submit Answers</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
