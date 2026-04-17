import React from "react";

export default function Avatar({ name, color, size = 36 }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="avatar" style={{ width: size, height: size, background: color || "var(--accent)", borderRadius: size * 0.28 }}>
      {initials}
    </div>
  );
}
