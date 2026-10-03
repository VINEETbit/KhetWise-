import React from "react";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
      {children}
    </span>
  );
}

export default Badge;