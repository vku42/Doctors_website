"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Priya Mehta",
    location: "Adajan, Surat",
    initials: "PM",
    text: "Dr. Sharma diagnosed my thyroid imbalance accurately after two years of constant fatigue and misdiagnosis. His thorough, clinical attention to detail is truly extraordinary.",
    rating: 5,
    color: "from-emerald-500 to-teal-500",
    tag: "Thyroid Care",
  },
  {
    name: "Rahul Patel",
    location: "Vesu, Surat",
    initials: "RP",
    text: "The digital booking system is incredibly seamless! Got my slot in minutes. The clinic environment is clean, extremely professional, and well-designed. Outstanding care.",
    rating: 5,
    color: "from-accent to-sky-500",
    tag: "Online Booking",
  },
  {
    name: "Sunita Shah",
    location: "Citylight, Surat",
    initials: "SS",
    text: "He is the most trustworthy family physician in Surat. Dr. Sharma handles every case with unmatched patience and a holistic approach. I highly recommend him for chronic diseases.",
    rating: 5,
    color: "from-amber-500 to-gold",
    tag: "Chronic Care",
  },
  {
    name: "Amit Desai",
    location: "Pal, Surat",
    initials: "AD",
    text: "I was nervous about my diabetes management but Dr. Sharma created such a comprehensive care plan that my levels are now completely controlled. A life-changing experience.",
    rating: 5,
    color: "from-violet-500 to-purple-500",
    tag: "Diabetes",
  },
  {
    name: "Kavita Joshi",
    location: "Katargam, Surat",
    initials: "KJ",
    text: "Best pediatric care in Surat. My children feel at ease with Dr. Sharma immediately. He explains everything clearly to both parents and kids. Absolutely wonderful doctor.",
    rating: 5,
    color: "from-rose-500 to-pink-500",
    tag: "Pediatrics",
  },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((i) => (i + 1) % testimonials.length);

  const visibleIndices = [
    (active - 1 + testimonials.length) % testimonials.length,
    active,
    (active + 1) % testimonials.length,
  ];

  return (
    <section className="py-28 bg-[#040e1c] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,180,166,0.08),transparent_70%)]" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/25 text-accent rounded-full text-xs font-black tracking-widest uppercase mb-5"
          >
            <Star className="w-3 h-3 fill-accent" /> Patient Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white mb-5 leading-tight"
          >
            Real People.{" "}
            <span className="text-gradient-animated">Real Results.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-slate-400 font-semibold">4.9 / 5 · 280+ Reviews</span>
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-6 min-h-[380px] perspective-1000">
          {visibleIndices.map((idx, pos) => {
            const t = testimonials[idx];
            const isCenter = pos === 1;
            return (
              <motion.div
                key={`${idx}-${pos}`}
                initial={false}
                animate={{
                  scale: isCenter ? 1 : 0.88,
                  opacity: isCenter ? 1 : 0.45,
                  z: isCenter ? 50 : 0,
                  filter: isCenter ? "blur(0px)" : "blur(1px)",
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-md shrink-0 ${!isCenter ? "hidden lg:block" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <TiltCard>
                  <div className="relative bg-[#0a1728]/80 backdrop-blur-xl border border-white/[0.07] rounded-3xl p-8 shadow-2xl group h-full">
                    {/* Top shimmer */}
                    <div className={`absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r ${t.color} opacity-60`} />
                    
                    {/* Giant quote */}
                    <Quote className="absolute top-5 right-6 w-12 h-12 text-white/[0.04]" />

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Tag */}
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r ${t.color} bg-opacity-10 text-[10px] font-black tracking-widest uppercase text-white/70 mb-4`}>
                      {t.tag}
                    </div>

                    {/* Text */}
                    <p className="text-slate-300 text-base leading-relaxed mb-8 font-medium">
                      &ldquo;{t.text}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-5 border-t border-white/[0.05]">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-black shadow-lg shrink-0`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-white font-extrabold text-sm">{t.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          Verified · {t.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-accent/20 hover:border-accent/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-accent/20 hover:border-accent/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
