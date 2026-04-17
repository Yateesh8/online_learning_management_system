import React, { useState, useEffect } from "react";
import API from "../../api/api";
import NotifPanel from "./NotifPanel";
import { socket } from "../../socket/socket";

export default function Topbar({ page }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifs(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNotifs();
    
    // Real-time listener
    socket.on("newNotification", (data) => {
      setNotifs(prev => [data, ...prev]);
    });

    // Simple polling as fallback
    const interval = setInterval(fetchNotifs, 10000);
    return () => {
      clearInterval(interval);
      socket.off("newNotification");
    };
  }, []);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="page-title">{page}</div>
      </div>

      <div className="topbar-right">
        <div className="search-bar" style={{ 
          background: 'var(--surface2)', 
          border: 'none', 
          borderRadius: '20px', 
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <svg className="nav-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', color: 'var(--text-secondary)'}}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input placeholder="Search courses, lectures..." style={{ fontSize: '13px', width: '220px' }} />
        </div>

        <div className="relative">
          <button className="icon-btn relative-btn" onClick={() => setNotifOpen(!notifOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && <div className="notif-badge" style={{position:'absolute', top: 4, right: 6, background: 'var(--primary)', width: 8, height: 8, borderRadius: '50%'}} />}
          </button>

          {notifOpen && <NotifPanel notifs={notifs} setNotifs={setNotifs} onClose={() => setNotifOpen(false)} />}
        </div>
      </div>
    </div>
  );
}
