import React from "react";

export default function Tag({ label, color }) {
  return (
    <span className="tag" style={{ background: color + "20", color }}>
      {label}
    </span>
  );
}