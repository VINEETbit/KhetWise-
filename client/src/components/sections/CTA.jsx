import React from "react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section
      id="contact"
      className="bg-[#04110B] px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-950 to-[#071B11] p-10 text-center sm:p-16">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
            The Future of Farming
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold sm:text-5xl">
            Turn agricultural data into smarter decisions.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-white/60">
            KhetWise brings machine learning and agriculture together
            to create a smarter farming experience.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

            {/* Go to AI Models section */}
            <a
              href="#ai-models"
              className="inline-flex rounded-full bg-lime-300 px-7 py-3.5 font-semibold text-[#04110B] transition hover:bg-lime-200"
            >
              Explore AI Models →
            </a>

            {/* Go to Dashboard */}
            <Link
              to="/dashboard"
              className="inline-flex rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white transition hover:border-lime-300/40 hover:text-lime-300"
            >
              Open Dashboard
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}

export default CTA;