import React from "react";
import { Link } from "react-router-dom";

import FarmHero2D from "../components/hero/Farmhero2D";

import {
  ArrowRight,
  BrainCircuit,
  Droplets,
  FlaskConical,
  LineChart,
  ScanSearch,
  Sprout,
  TrendingUp,
} from "lucide-react";

function Home() {
  const models = [
    {
      icon: Sprout,
      title: "Crop Recommendation",
      path: "/dashboard/crop",
      description:
        "Find suitable crops using agricultural and environmental conditions.",
    },
    {
      icon: Droplets,
      title: "Irrigation",
      path: "/dashboard/growth",
      description:
        "Use intelligent insights to understand irrigation requirements.",
    },
    {
      icon: FlaskConical,
      title: "Fertilizer Recommendation",
      path: "/dashboard/fertilizer",
      description:
        "Get fertilizer recommendations based on agricultural inputs.",
    },
    {
      icon: TrendingUp,
      title: "Yield Prediction",
      path: "/dashboard/yield",
      description:
        "Estimate potential crop production using machine-learning models.",
    },
    {
      icon: LineChart,
      title: "Market Price Prediction",
      path: "/dashboard/price",
      description:
        "Explore predicted crop prices and understand market opportunities.",
    },
    {
      icon: ScanSearch,
      title: "Plant Disease Detection",
      path: "/dashboard/disease",
      description:
        "Analyse crop images and identify possible plant diseases.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Enter your farm data",
      description:
        "Provide the agricultural information required by the selected KhetWise model.",
    },
    {
      number: "02",
      title: "AI analyses the data",
      description:
        "KhetWise processes your inputs using the appropriate machine-learning model.",
    },
    {
      number: "03",
      title: "Get useful insights",
      description:
        "Receive a clear prediction, recommendation or agricultural insight.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#07130d] text-white">
      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04110B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* LOGO */}

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-300 text-2xl text-[#07130d]">
              🌱
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight">
                KhetWise
              </p>

              <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40">
                SMART AGRICULTURE
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-white/60 transition hover:text-lime-300"
            >
              Features
            </a>

            <a
              href="#ai-models"
              className="text-sm text-white/60 transition hover:text-lime-300"
            >
              AI Models
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-white/60 transition hover:text-lime-300"
            >
              How It Works
            </a>

            <a
              href="#contact"
              className="text-sm text-white/60 transition hover:text-lime-300"
            >
              Contact
            </a>
          </nav>

          {/* GET STARTED */}

          <Link
            to="/login"
            className="rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-[#07130d] transition hover:bg-lime-200 hover:shadow-lg hover:shadow-lime-300/10"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section>
        <FarmHero2D />
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section
        id="features"
        className="scroll-mt-20 bg-[#07130d] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-lime-300" />

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
                Smart Agriculture
              </p>
            </div>

            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Everything you need for{" "}
              <span className="text-lime-300">
                smarter farming.
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-white/50">
              KhetWise combines agricultural data, machine learning
              and practical insights into one intelligent platform.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-lime-300/30">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                <BrainCircuit size={24} />
              </div>

              <h3 className="text-xl font-bold">
                AI-Powered Decisions
              </h3>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Use machine-learning models to turn agricultural
                data into useful farming decisions.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-lime-300/30">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                <Sprout size={24} />
              </div>

              <h3 className="text-xl font-bold">
                Crop Intelligence
              </h3>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Analyse crop, soil and environmental conditions
                to support better agricultural planning.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-lime-300/30">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                <LineChart size={24} />
              </div>

              <h3 className="text-xl font-bold">
                Predictive Insights
              </h3>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Explore predictions for yield, fertilizer,
                irrigation and agricultural market prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          AI MODELS
      ========================================================= */}

      <section
        id="ai-models"
        className="scroll-mt-20 bg-[#0a1c12] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
                AI Models
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Agricultural intelligence in one place.
              </h2>

              <p className="mt-5 leading-7 text-white/50">
                Explore the machine-learning tools available inside
                the KhetWise platform.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold transition hover:border-lime-300/40 hover:text-lime-300"
            >
              Open Dashboard
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => {
              const Icon = model.icon;

              return (
                <Link
                  key={model.title}
                  to={model.path}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-300/30 hover:bg-lime-300/[0.03]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-300/10 text-lime-300">
                      <Icon size={23} />
                    </div>

                    <ArrowRight
                      size={19}
                      className="text-white/20 transition group-hover:translate-x-1 group-hover:text-lime-300"
                    />
                  </div>

                  <h3 className="text-lg font-bold">
                    {model.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/50">
                    {model.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lime-300 transition group-hover:text-lime-200">
                    Sign in or create account <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        id="how-it-works"
        className="scroll-mt-20 bg-[#07130d] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
            How It Works
          </p>

          <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            From farm data to useful insights.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-white/50">
            KhetWise keeps the process simple — provide your inputs,
            let the model analyse them and receive the result.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"
              >
                <p className="text-4xl font-bold text-lime-300">
                  {step.number}
                </p>

                <h3 className="mt-6 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section
        id="contact"
        className="scroll-mt-20 bg-[#0a1c12] px-6 py-24"
      >
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#071a0f] p-8 text-center md:p-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-2xl">
            🌱
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
            KhetWise
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Ready to explore smarter agriculture?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/50">
            Enter the KhetWise workspace and start exploring
            agricultural AI models and predictions.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-7 py-4 text-sm font-bold text-[#07130d] transition hover:bg-lime-200"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:border-lime-300/40 hover:text-lime-300"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/10 bg-[#04110B] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} KhetWise. Smart Agriculture.
          </p>

          <Link
            to="/login"
            className="transition hover:text-lime-300"
          >
            Farmer Login
          </Link>
        </div>
      </footer>
    </main>
  );
}

export default Home;
