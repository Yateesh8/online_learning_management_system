import React, { useState, useEffect } from "react";
import ProgressBar from "../../components/common/ProgressBar";
import API from "../../api/api";
import { socket } from "../../socket/socket";

export default function LectureViewer({ courseId }) {
  const [active, setActive] = useState(0);
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handler = (data) => {
      setLectures((prev) =>
        prev.map((lec) =>
          lec._id === data.lectureId ? { ...lec, completed: true } : lec,
        ),
      );
    };

    socket.on("progressUpdated", handler);

    return () => socket.off("progressUpdated", handler);
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await API.get(`/lectures/${courseId}`);
        setLectures(res.data);
      } catch (err) {
        console.error("Error fetching lectures", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchLectures();
  }, [courseId]);

  const markDone = async () => {
    try {
      if (!lectures[active]) return;

      const lectureId = lectures[active]._id;

      await API.post("/progress/markLectureComplete", { lectureId });

      socket.emit("lectureCompleted", { lectureId });

      setLectures((prev) =>
        prev.map((lec, i) =>
          i === active ? { ...lec, completed: true } : lec,
        ),
      );

      if (active < lectures.length - 1) {
        setTimeout(() => {
          setActive(active + 1);
        }, 800);
      }
    } catch (err) {
      console.error("Error marking complete", err);
    }
  };

  const doneCount = lectures.filter((l) => l.completed).length;

  if (isLoading) return <div style={{padding: 24, fontSize: 13}}>Loading lectures...</div>;
  if (!lectures.length) return <div className="page fade-up"><div className="card p-24" style={{padding: 24, fontSize: 14, textAlign: 'center'}}>No lectures have been uploaded for this course yet. Check back later!</div></div>;
  if (!lectures[active]) return null;

  return (
    <div className="page fade-up">
      <div className="mb-24">
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          Course Lectures
        </div>

        <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>
          {doneCount} / {lectures.length} lectures completed
        </div>

        <div style={{ marginTop: 10 }}>
          <ProgressBar value={(doneCount / lectures.length) * 100} />
        </div>
      </div>

      <div className="lecture-layout">
        <div>
          <div className="video-container mb-16" style={{ marginBottom: 20 }}>
            <iframe
              src={lectures[active].videoUrl}
              allowFullScreen
              title={lectures[active].title}
            />
          </div>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {lectures[active].title}
          </div>

          <div
            style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}
          >
            Duration: {lectures[active].duration}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className={`btn ${lectures[active].completed ? "btn-secondary" : "btn-primary"}`}
              onClick={markDone}
            >
              {lectures[active].completed ? "✓ Completed" : "Mark as Complete"}
            </button>

            {active < lectures.length - 1 && (
              <button
                className="btn btn-secondary"
                onClick={() => setActive(active + 1)}
              >
                Next Lecture →
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              fontWeight: 700,
            }}
          >
            Lecture List
          </div>

          {lectures.map((lec, i) => (
            <div
              key={lec._id}
              className={`lecture-item ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              <div className={`lecture-check ${lec.completed ? "done" : ""}`}>
                {lec.completed ? "✓" : i + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div className="lecture-item-title">{lec.title}</div>
                <div className="lecture-item-dur">{lec.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
