import React from "react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;