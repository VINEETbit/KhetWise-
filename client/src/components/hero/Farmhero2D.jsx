import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  BrainCircuit,
  Bot,
  Droplets,
  Leaf,
  LineChart,
  ScanSearch,
  Sprout,
} from "lucide-react";

import heroImage from "../../assets/hero.png";


const solutions = [
  {
    icon: Sprout,
    title: "Crop Recommendation",
    path: "/dashboard/crop",
  },
  {
    icon: LineChart,
    title: "Yield Prediction",
    path: "/dashboard/yield",
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    path: "/dashboard/growth",
  },
  {
    icon: Leaf,
    title: "Fertilizer AI",
    path: "/dashboard/fertilizer",
  },
  {
    icon: LineChart,
    title: "Market Insights",
    path: "/dashboard/price",
  },
  {
    icon: ScanSearch,
    title: "Disease Detection",
    path: "/dashboard/disease",
  },
];


function FarmHero2D() {
  return (
    <section className="relative overflow-hidden bg-[#07130d] text-white">

      {/* =====================================================
          HERO
      ====================================================== */}

      <div className="relative min-h-[720px] lg:min-h-[780px]">

        <img
          src={heroImage}
          alt="KhetWise smart agriculture"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Main overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04110B] via-[#04110B]/80 to-[#04110B]/20" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#07130d] to-transparent" />

        {/* Top darkening */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#04110B]/60 to-transparent" />


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-6 py-24 lg:min-h-[780px] lg:px-8">

          <div className="max-w-3xl">

            {/* Eyebrow */}

            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-4 py-2 backdrop-blur-md">

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-300 text-[#07130d]">
                <BrainCircuit size={15} />
              </span>

              <span className="text-sm font-medium text-white/85">
                AI-Powered Agriculture Platform
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />

              <span className="text-xs text-white/50">
                KhetWise
              </span>

            </div>


            {/* Main heading */}

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[86px]">

              Grow Smarter.
              <br />

              <span className="text-lime-300">
                Harvest Better.
              </span>

            </h1>


            {/* Tagline */}

            <div className="mt-7 flex items-center gap-3">

              <div className="h-px w-10 bg-lime-300" />

              <p className="text-lg font-semibold tracking-wide text-white sm:text-xl">
                Smart Agriculture
              </p>

            </div>


            {/* Description */}

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              KhetWise brings AI, machine learning and agricultural data
              together to help farmers make smarter decisions — from choosing
              the right crop to managing irrigation, fertilizer, yield and
              market opportunities.
            </p>


            {/* =================================================
                CTA
            ================================================= */}

            <div className="mt-9 flex flex-wrap items-center gap-4">

              {/* Explore KhetWise */}

              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-3 rounded-full bg-lime-300 px-7 py-4 text-sm font-bold text-[#07130d] shadow-xl shadow-lime-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-lime-200"
              >
                Explore KhetWise

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#07130d] text-lime-300 transition group-hover:translate-x-1">
                  <ArrowRight size={15} />
                </span>
              </Link>


              {/* How it works */}

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/15"
              >
                See How It Works
              </a>

            </div>


            {/* =================================================
                TRUST / STATS
            ================================================= */}

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/15 pt-7">

              <div>
                <p className="text-2xl font-bold">
                  6+
                </p>

                <p className="mt-1 text-xs text-white/45">
                  AI Solutions
                </p>
              </div>


              <div className="h-8 w-px bg-white/15" />


              <div>
                <p className="text-2xl font-bold">
                  ML
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Powered Predictions
                </p>
              </div>


              <div className="h-8 w-px bg-white/15" />


              <div>
                <p className="text-2xl font-bold">
                  24/7
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Agricultural Insights
                </p>
              </div>


              <div className="h-8 w-px bg-white/15" />


              <div>
                <p className="text-2xl font-bold">
                  1
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Smart Platform
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            FLOATING AI INSIGHT
        ================================================= */}

        <div className="absolute bottom-32 right-6 z-20 hidden w-[270px] rounded-2xl border border-white/15 bg-[#071b11]/80 p-5 shadow-2xl backdrop-blur-xl xl:block">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/15 text-lime-300">
                <Leaf size={19} />
              </div>

              <div>
                <p className="text-xs text-white/45">
                  AI Field Analysis
                </p>

                <p className="mt-0.5 text-sm font-semibold">
                  Crop Health
                </p>
              </div>

            </div>

            <span className="text-lg font-bold text-lime-300">
              94%
            </span>

          </div>


          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[94%] rounded-full bg-lime-300" />
          </div>


          <div className="mt-3 flex items-center justify-between text-[11px]">

            <span className="text-white/40">
              Field condition
            </span>

            <span className="font-medium text-lime-300">
              Excellent
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          SOLUTIONS
      ====================================================== */}

      <div
        id="ai-models"
        className="relative z-30 mx-auto -mt-14 max-w-7xl scroll-mt-20 px-6 lg:px-8"
      >

        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)]">

          {/* Header */}

          <div className="flex flex-col justify-between gap-3 border-b border-black/5 px-6 py-5 sm:flex-row sm:items-center sm:px-8">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                KhetWise Intelligence
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#102018]">
                Everything you need for smarter farming
              </h2>

            </div>


            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                to="/dashboard/assistant"
                className="group inline-flex items-center gap-2 rounded-full bg-[#edf5e9] px-4 py-2.5 text-sm font-bold text-emerald-900 transition hover:bg-lime-200"
              >
                <Bot size={17} />
                Ask the Farm Assistant
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
              >
                Explore all models
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </div>

          </div>


          {/* Solutions */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {solutions.map((solution, index) => {

              const Icon = solution.icon;

              return (
                <Link
                  key={solution.title}
                  to={solution.path}
                  className={`
                    group
                    flex
                    items-center
                    gap-4
                    px-6
                    py-6
                    transition
                    duration-300
                    hover:bg-[#f3f7f0]
                    ${
                      index !== solutions.length - 1
                        ? "border-b border-black/5 xl:border-b-0 xl:border-r"
                        : ""
                    }
                  `}
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5e9] text-emerald-800 transition duration-300 group-hover:scale-105 group-hover:bg-lime-200">

                    <Icon size={20} />

                  </div>


                  <div>

                    <p className="text-sm font-semibold text-[#102018]">
                      {solution.title}
                    </p>

                    <p className="mt-1 text-[11px] text-black/40">
                      AI powered
                    </p>

                  </div>

                </Link>
              );

            })}

          </div>

        </div>

      </div>


      {/* Bottom spacing */}

      <div className="h-16 bg-[#07130d]" />

    </section>
  );
}

export default FarmHero2D;
