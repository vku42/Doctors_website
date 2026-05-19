"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Award, Star, ThumbsUp } from "lucide-react";

const stats = [
  { value: 2000, suffix: "+", label: "Patients Treated", icon: Users, duration: 2, color: "from-teal-400 to-emerald-400", glow: "rgba(52,211,153,0.3)" },
  { value: 15, suffix: "+", label: "Years Experience", icon: Award, duration: 1.5, color: "from-amber-400 to-yellow-300", glow: "rgba(251,191,36,0.3)" },
  { value: 4.9, suffix: "★", label: "Google Rating", icon: Star, duration: 2, decimals: 1, color: "from-yellow-400 to-orange-300", glow: "rgba(251,191,36,0.3)" },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: ThumbsUp, duration: 2, color: "from-sky-400 to-blue-400", glow: "rgba(56,189,248,0.3)" },
];

function AnimatedCounter({ value, suffix, duration, decimals = 0 }: { value: number; suffix: string; duration: number; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(value * ease);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(value);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="relative z-30 -mt-10 sm:-mt-20 pb-0">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#0a1728]/90 backdrop-blur-2xl border border-white/[0.07] rounded-2xl sm:rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Shimmer top border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`group relative flex flex-col items-center justify-center text-center px-4 py-7 sm:px-6 sm:py-10 cursor-default
                    ${i < 2 ? "border-b lg:border-b-0 border-white/[0.05]" : ""}
                    ${i % 2 === 0 ? "border-r border-white/[0.05]" : ""}
                    lg:border-r lg:last:border-r-0
                    hover:bg-white/[0.03] transition-colors duration-300
                  `}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${stat.glow}, transparent 70%)` }}
                  />

                  {/* Icon */}
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-md" />
                  </div>

                  {/* Counter */}
                  <div className={`text-3xl sm:text-5xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-1.5 sm:mb-2 leading-none`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={stat.duration} decimals={stat.decimals} />
                  </div>

                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
