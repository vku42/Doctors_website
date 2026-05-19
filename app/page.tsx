"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { DoctorSection } from "@/components/home/DoctorSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BookingCTA } from "@/components/home/BookingCTA";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Premium scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #00B4A6, #C9A84C, #38bdf8)",
          boxShadow: "0 0 10px rgba(0,180,166,0.5)",
        }}
      />

      {/* Dark hero + stats overlap */}
      <div className="bg-[#040e1c]">
        <HeroSection />
        <StatsSection />
      </div>

      {/* Light mid-sections */}
      <ServicesPreview />
      <DoctorSection />
      <WhyChooseUs />

      {/* Dark testimonials */}
      <TestimonialsSection />

      {/* Light CTA */}
      <BookingCTA />
    </>
  );
}
