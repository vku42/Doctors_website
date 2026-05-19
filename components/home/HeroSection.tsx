"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Star, ShieldCheck, Clock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const WORDS = ["Trusted Care.", "Expert Healing.", "Your Wellness.", "Sacred Mission."];

function TypewriterWords() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[index];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else {
      setDeleting(false);
      setIndex((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="text-gradient-animated inline-block min-w-[2ch]">
      {displayed}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}

function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full bg-accent/20 pointer-events-none"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

const particles = [
  { delay: 0, size: 6, x: "10%", y: "20%" },
  { delay: 1, size: 4, x: "85%", y: "15%" },
  { delay: 2, size: 8, x: "70%", y: "70%" },
  { delay: 0.5, size: 5, x: "25%", y: "75%" },
  { delay: 1.5, size: 6, x: "50%", y: "85%" },
  { delay: 3, size: 4, x: "90%", y: "50%" },
  { delay: 2.5, size: 7, x: "5%", y: "60%" },
];

const trustItems = [
  { icon: "15+", label: "Years Practice", color: "text-accent", bg: "bg-accent/10" },
  { icon: <Star className="w-4 h-4 fill-gold text-gold" />, label: "4.9 ★ Rating", color: "text-gold", bg: "bg-gold/10" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "MBBS, MD", color: "text-teal-400", bg: "bg-teal-400/10" },
  { icon: <Clock className="w-4 h-4" />, label: "Same-Day Slots", color: "text-sky-400", bg: "bg-sky-400/10" },
];

const infoChips = [
  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, text: "Online Appointment Available" },
  { icon: <Sparkles className="w-3.5 h-3.5 text-accent" />, text: "AI Health Assistant 24/7" },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.4], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.94]);
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-[100svh] pt-16 sm:pt-24 pb-0 flex flex-col justify-center overflow-hidden bg-[#040e1c] text-white">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,180,166,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(201,168,76,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_90%,rgba(10,37,64,0.6),transparent_70%)]" />
        <motion.div
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 60, 0], scale: [1, 1.15, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-5%] w-[55%] h-[55%] rounded-full bg-accent/12 filter blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#163a5f]/60 filter blur-[160px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_60%,rgba(4,14,28,0.8)_100%)]" />
      </div>

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
      </div>

      {/* ── Main content ── */}
      <motion.div
        style={{ y: smoothY, opacity, scale }}
        className="container relative z-10 mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center py-8 sm:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-7xl mx-auto w-full">

          {/* ── MOBILE ONLY: Compact doctor card (hidden on lg+) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 backdrop-blur-sm"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
              <Image
                src="/images/dr-sharma.png"
                alt="Dr. Rajesh Sharma"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-sm">Dr. Rajesh Sharma</p>
              <p className="text-slate-400 text-xs">MBBS, MD · General Physician</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-bold">Next Slot: Today, 5:30 PM</span>
              </div>
            </div>
            <Link
              href="/book"
              className="shrink-0 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold shadow-[0_4px_15px_rgba(0,180,166,0.4)] active:scale-95 transition-transform"
            >
              Book
            </Link>
          </motion.div>

          {/* ── LEFT: Text copy (7 cols on lg) ── */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5 sm:space-y-7">

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.05] border border-accent/25 text-accent text-[10px] sm:text-xs font-bold tracking-widest uppercase backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Trusted Family Clinic · Surat, Gujarat
            </motion.div>

            {/* Headline */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.2rem,8vw,4.5rem)] font-black font-heading tracking-tight leading-[1.05] text-white"
              >
                Your Health,<br />
                <TypewriterWords />
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base lg:text-lg text-slate-300/85 max-w-lg leading-relaxed"
              >
                Personalized, evidence-based healthcare with{" "}
                <strong className="text-white font-extrabold">Dr. Rajesh Sharma (MBBS, MD)</strong>.
                Serving Surat families for over 15 years.
              </motion.p>
            </div>

            {/* CTA Buttons — stacked on mobile, row on sm+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
            >
              <Link
                href="/book"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl sm:rounded-full bg-accent text-white px-8 h-14 text-base font-extrabold overflow-hidden shadow-[0_8px_30px_rgba(0,180,166,0.35)] transition-all duration-300 active:scale-95 w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-[#00d4c5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Calendar className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Book Consultation</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl sm:rounded-full bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.12] px-8 h-14 text-base font-semibold backdrop-blur-sm transition-all duration-300 active:scale-95 w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                Our Services
              </Link>
            </motion.div>

            {/* Trust row — 2×2 on mobile, 4 across on sm+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.52 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-5 border-t border-white/[0.07] w-full"
            >
              {trustItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.58 + i * 0.08 }}
                  className="flex items-center gap-2"
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${item.bg} flex items-center justify-center ${item.color} text-xs sm:text-sm font-black shrink-0`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-300 leading-tight">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Doctor visual — DESKTOP ONLY (5 cols) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-5 relative h-[560px] items-center justify-center"
          >
            {/* Rotating ring decorations */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-accent/15 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute w-[460px] h-[460px] rounded-full border border-dashed border-white/5 pointer-events-none"
            />

            {/* Doctor card */}
            <div className="relative w-[340px] h-[460px]">
              {/* Floating slot badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[48%] left-[-65px] z-30 bg-[#0a1e36]/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-[0_20px_50px_rgba(0,180,166,0.25)] border border-accent/20 flex items-center gap-3"
              >
                <div className="relative">
                  <div className="bg-accent/20 p-2.5 rounded-xl text-accent">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0a1e36]" />
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">● Live</p>
                  <p className="text-xs font-black text-white">Next: Today, 5:30 PM</p>
                </div>
              </motion.div>

              {/* Image frame */}
              <div className="relative w-full h-full rounded-t-[10rem] rounded-b-[2rem] bg-gradient-to-b from-slate-800/30 to-slate-900/50 border border-white/10 overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 rounded-t-[10rem] rounded-b-[2rem] border-2 border-accent/0 group-hover:border-accent/30 transition-all duration-700 z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040e1c] via-transparent to-[#040e1c]/20 z-10" />
                <Image
                  src="/images/dr-sharma.png"
                  alt="Dr. Rajesh Sharma"
                  fill
                  sizes="340px"
                  priority
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Info chips at bottom */}
                <div className="absolute z-20 bottom-5 left-4 right-4 space-y-2">
                  {infoChips.map((chip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.15 }}
                      className="bg-[#051124]/90 backdrop-blur-xl border border-white/[0.07] rounded-xl p-2.5 flex items-center gap-2.5"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{chip.icon}</div>
                      <span className="text-[11px] font-semibold text-slate-200">{chip.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator (desktop only) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
        </motion.div>
      </motion.div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#040e1c] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
