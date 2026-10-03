import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  Sprout,
  FlaskConical,
  Leaf,
  ScanSearch,
  TrendingUp,
  CloudSun,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Crop Recommendation",
    description:
      "Discover suitable crops using soil properties and environmental data.",
    icon: Sprout,
    tag: "Crop Intelligence",
    path: "/dashboard/crop",
  },
  {
    number: "02",
    title: "Soil Analysis",
    description:
      "Understand soil conditions and make informed decisions for your field.",
    icon: FlaskConical,
    tag: "Soil Intelligence",
    path: "/dashboard/crop",
  },
  {
    number: "03",
    title: "Fertilizer Guidance",
    description:
      "Get data-driven fertilizer suggestions tailored to your crop and soil.",
    icon: Leaf,
    tag: "Nutrient Management",
    path: "/dashboard/fertilizer",
  },
  {
    number: "04",
    title: "Plant Disease Detection",
    description:
      "Analyze crop images to help identify potential plant diseases.",
    icon: ScanSearch,
    tag: "Computer Vision",
    path: "/dashboard/disease",
  },
  {
    number: "05",
    title: "Yield Prediction",
    description:
      "Explore estimated crop yields using available agricultural data.",
    icon: TrendingUp,
    tag: "Predictive Analytics",
    path: "/dashboard/yield",
  },
  {
    number: "06",
    title: "Weather Insights",
    description:
      "Use weather information to support planning and day-to-day farm decisions.",
    icon: CloudSun,
    tag: "Weather Intelligence",
    path: "/dashboard/growth",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#07130d] px-5 py-24 md:px-10 md:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-[#D7F35B]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D7F35B]/20 bg-[#D7F35B]/10 px-4 py-2 text-sm text-[#D7F35B]">
            <Sprout size={16} />

            The KhetWise Ecosystem
          </div>

          <h2 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Your Farm.
            <br />

            <span className="text-[#D7F35B]">
              Powered by Intelligence.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
            Bring agricultural data and AI-powered tools together
            to make more informed farming decisions.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: (index % 3) * 0.1,
                }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={feature.path}
                  className="group relative block h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 transition-colors duration-300 hover:border-[#D7F35B]/30 hover:bg-[#D7F35B]/[0.04]"
                >
                  {/* Icon + number */}
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D7F35B]/20 bg-[#D7F35B]/10 text-[#D7F35B] transition group-hover:bg-[#D7F35B] group-hover:text-[#071A0F]">
                      <Icon size={26} />
                    </div>

                    <span className="text-sm font-medium tracking-widest text-white/20">
                      {feature.number}
                    </span>
                  </div>

                  {/* Tag */}
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#D7F35B]/70">
                    {feature.tag}
                  </p>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {feature.description}
                  </p>

                  {/* Bottom */}
                  <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
                    <span className="text-sm text-white/40 transition group-hover:text-white/60">
                      Explore capability
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="text-[#D7F35B] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
