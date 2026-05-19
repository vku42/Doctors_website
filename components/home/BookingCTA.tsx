"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarRange, Phone, Sparkles, Clock } from "lucide-react";

export function BookingCTA() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Diagonal grid bg */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <motion.div
          onMouseMove={handleMouse}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="group relative overflow-hidden bg-gradient-to-br from-[#071a30] via-[#0d2a4a] to-[#071a30] rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(10,37,64,0.4)] p-10 md:p-16"
        >
          {/* Interactive spotlight */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
            style={{
              background: `radial-gradient(600px circle at ${smoothX.get()}px ${smoothY.get()}px, rgba(0,180,166,0.12), transparent 80%)`,
            }}
          />

          {/* Background elements */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/15 filter blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold/8 filter blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left */}
            <div className="text-white text-center lg:text-left max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent text-[10px] font-black tracking-widest uppercase mb-6"
              >
                <Sparkles className="w-3 h-3" /> Live Schedule Active
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-[1.1] mb-5"
              >
                Take Control of<br />
                <span className="text-gradient-animated">Your Health Today.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8"
              >
                Secure your consultation in under 60 seconds. Real-time slot availability updated instantly.
              </motion.p>

              {/* Quick info chips */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center lg:justify-start gap-3"
              >
                {[
                  { icon: <Clock className="w-3.5 h-3.5" />, text: "Same-Day Availability" },
                  { icon: <CalendarRange className="w-3.5 h-3.5" />, text: "60-Second Booking" },
                  { icon: <Phone className="w-3.5 h-3.5" />, text: "WhatsApp Reminders" },
                ].map((chip, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/8 rounded-full text-xs text-slate-300 font-semibold">
                    <span className="text-accent">{chip.icon}</span>
                    {chip.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Action box */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="shrink-0 w-full sm:w-auto"
            >
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-4 min-w-[280px]">
                <Link
                  href="/book"
                  className="group relative w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-accent hover:bg-accent/90 text-white px-7 h-14 text-base font-extrabold btn-glow transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] overflow-hidden"
                >
                  <span className="absolute inset-0 shimmer" />
                  <CalendarRange className="w-5 h-5 relative z-10 group-hover:rotate-6 transition-transform duration-300" />
                  <span className="relative z-10">Book Appointment Now</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <a
                  href="tel:+919876543210"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-white/20 px-7 h-12 text-sm font-bold transition-all duration-300"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  Call: +91 98765 43210
                </a>

                <p className="text-center text-[11px] text-slate-500 font-medium">
                  Mon–Sat: 9 AM–1 PM · 5–9 PM &nbsp;|&nbsp; Sun: 10 AM–12 PM
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
