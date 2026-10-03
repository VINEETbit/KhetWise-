import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Database, BrainCircuit, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Enter Farm Data",
    description:
      "Provide the required agricultural, soil, crop or market information.",
    icon: Database,
  },
  {
    number: "02",
    title: "AI Analyses It",
    description:
      "KhetWise processes the information using trained machine learning models.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Get a Prediction",
    description:
      "The model generates a prediction or recommendation for your situation.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Make Better Decisions",
    description:
      "Use the insights to support smarter and more informed farming decisions.",
    icon: CheckCircle2,
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#06150D] px-6 py-24 text-white md:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
            Simple Process
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            From data to
            <span className="text-emerald-300"> decision.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/50">
            KhetWise transforms agricultural data into practical
            machine-learning insights through a simple four-step process.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -6 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:border-lime-300/30 hover:bg-lime-300/[0.04]">

                  {/* Number + Icon */}
                  <div className="flex items-center justify-between">

                    <span className="text-sm font-bold tracking-widest text-lime-300">
                      {step.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-300 transition group-hover:bg-lime-300 group-hover:text-[#06150D]">
                      <Icon size={21} />
                    </div>

                  </div>

                  {/* Title */}
                  <h3 className="mt-8 text-xl font-semibold">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {step.description}
                  </p>

                  {/* Step indicator */}
                  <div className="mt-8 h-1 w-10 rounded-full bg-lime-300/30 transition-all duration-300 group-hover:w-16 group-hover:bg-lime-300" />

                </div>

                {/* Arrow between desktop cards */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <ArrowRight
                      size={20}
                      className="text-lime-300/40"
                    />
                  </div>
                )}

              </motion.div>
            );
          })}

        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 text-center"
        >
          <p className="text-sm text-white/50">
            <span className="font-semibold text-lime-300">
              One platform.
            </span>{" "}
            Multiple AI models. Smarter agricultural decisions.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

export default HowItWorks;