import React from "react";
import API from "../../api/api";

export default function NotifPanel({ notifs, setNotifs, onClose }) {
  
  const handleRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifs(notifs.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="notif-panel card fade-up" style={{ position: "absolute", top: 50, right: 0, width: 340, padding: 0, zIndex: 100, border: '1px solid var(--border)', overflow:'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: 'var(--text-secondary)' }}>×</button>
      </div>
      
      <div style={{maxHeight: 350, overflowY: 'auto'}}>
        {notifs.length === 0 ? (
           <div style={{fontSize: 13, color: "var(--text-secondary)", padding: 32, textAlign: 'center'}}>
             You're all caught up!
           </div>
        ) : (
           notifs.map((n) => (
             <div key={n._id} style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', background: n.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)', display: 'flex', gap: 12, opacity: n.isRead ? 0.7 : 1}}>
                <div style={{minWidth: 8, height: 8, borderRadius: '50%', background: n.isRead ? 'transparent' : 'var(--primary)', marginTop: 6}} />
                <div>
                   <div style={{fontWeight: 600, fontSize: 13, marginBottom: 4}}>{n.title}</div>
                   <div style={{fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4}}>{n.message}</div>
                   <div style={{fontSize: 10, color: 'var(--text3)', marginTop: 8}}>
                      {new Date(n.createdAt).toLocaleDateString()} 
                      {!n.isRead && <span style={{marginLeft: 12, color: 'var(--primary)', cursor: 'pointer'}} onClick={() => handleRead(n._id)}>Mark as read</span>}
                   </div>
                </div>
             </div>
           ))
        )}
      </div>
    </div>
  );
}