import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#04110B]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-xl">
            🌱
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Khet<span className="text-lime-300">Wise</span>
            </h1>

            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Smart Agriculture
            </p>
          </div>
        </a>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <a
            href="#features"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Features
          </a>

          <a
            href="#ai-models"
            className="text-sm text-white/70 hover:text-white transition"
          >
            AI Models
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-white/70 hover:text-white transition"
          >
            How It Works
          </a>

          <a
            href="#contact"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Contact
          </a>

        </div>

        {/* Get Started */}
        <button
          onClick={() => navigate("/login")}
          className="rounded-full bg-lime-300 px-5 py-2.5 text-sm font-semibold text-[#04110B] transition hover:bg-lime-200"
        >
          Get Started
        </button>

      </div>
    </nav>
  );
}

export default Navbar;