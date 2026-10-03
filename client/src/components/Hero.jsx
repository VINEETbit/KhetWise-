import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import FarmScene from "../3d/FarmScene";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-32 md:px-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D7F35B]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Hero text */}
        <div className="mx-auto max-w-4xl text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D7F35B]/20 bg-[#D7F35B]/10 px-4 py-2 text-sm text-[#D7F35B]"
          >
            <Sparkles size={16} />
            AI-Powered Smart Agriculture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Grow Smarter.
            <br />

            <span className="text-[#D7F35B]">
              Harvest Better.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg"
          >
            Empowering farmers with artificial intelligence,
            intelligent crop recommendations, soil insights,
            and data-driven farming decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Button
              className="rounded-xl bg-[#D7F35B] px-6 py-6 font-semibold text-[#071A0F] hover:bg-[#c9e84f]"
              onClick={() =>
                document
                  .getElementById("get-started")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore KhetWise
              <ArrowRight className="ml-2" size={18} />
            </Button>

            <Button
              variant="outline"
              className="rounded-xl border-white/15 px-6 py-6 text-white hover:bg-white/5"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Leaf className="mr-2" size={18} />
              Explore AI Features
            </Button>
          </motion.div>
        </div>

        {/* 3D Farm Environment */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
className="relative mt-16 h-[550px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#B7D6EC] shadow-2xl shadow-black/30 md:h-[650px]"        >
          <FarmScene />
        </motion.div>

        <p className="mt-4 text-center text-xs tracking-wide text-white/30">
          INTERACTIVE 3D FARM ENVIRONMENT
        </p>

      </div>
    </section>
  );
}