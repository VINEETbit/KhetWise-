import React from "react";

function Button({
  children,
  onClick,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full bg-lime-300 px-6 py-3 font-semibold text-[#04110B] transition hover:bg-lime-200 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;