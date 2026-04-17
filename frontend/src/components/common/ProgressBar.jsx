import React from "react";

export default function ProgressBar({ value, color }) {
  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-fill" style={{ width: `${value}%`, background: color || "var(--accent)" }} />
    </div>
  );
}