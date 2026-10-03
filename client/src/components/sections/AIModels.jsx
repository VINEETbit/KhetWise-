import React from "react";
import { Link } from "react-router-dom";

const models = [
  {
    number: "01",
    icon: "🌾",
    title: "Crop Recommendation",
    description:
      "Recommend suitable crops using agricultural and environmental parameters.",
    path: "/dashboard/crop",
  },
  {
    number: "02",
    icon: "📊",
    title: "Crop Yield Prediction",
    description:
      "Predict expected crop yield using historical and agricultural data.",
    path: "/dashboard/yield",
  },
  {
    number: "03",
    icon: "💧",
    title: "Irrigation Prediction",
    description:
      "Analyse field conditions to support smarter irrigation decisions.",
    path: "/dashboard/growth",
  },
  {
    number: "04",
    icon: "🧪",
    title: "Fertilizer Recommendation",
    description:
      "Recommend suitable fertilizer options based on available soil data.",
    path: "/dashboard/fertilizer",
  },
  {
    number: "05",
    icon: "📈",
    title: "Market Price Prediction",
    description:
      "Use market data to estimate future crop price trends.",
    path: "/dashboard/price",
  },
  {
    number: "06",
    icon: "🦠",
    title: "Plant Disease Detection",
    description:
      "Detect potential crop diseases from plant images.",
    path: "/dashboard/disease",
  },
];

function AIModels() {
  return (
    <section
      id="ai-models"
      className="bg-[#04110B] px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
            KhetWise Intelligence
          </p>

          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
            AI models for
            <span className="text-emerald-300">
              {" "}real farm decisions.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-white/55">
            A collection of machine learning solutions designed to
            turn agricultural data into useful insights.
          </p>
        </div>

        {/* MODELS */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <div
              key={model.number}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-lime-300/30 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/30">
                  {model.number}
                </span>

                <span className="text-3xl">
                  {model.icon}
                </span>
              </div>

              <h3 className="mt-8 text-xl font-semibold">
                {model.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {model.description}
              </p>

              {/* WORKING LINK */}
              <Link
                to={model.path}
                className="mt-6 inline-flex items-center text-sm font-semibold text-lime-300 transition group-hover:text-lime-200"
              >
                Explore model
                <span className="ml-1 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default AIModels;
