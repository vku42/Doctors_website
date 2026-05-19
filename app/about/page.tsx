"use client";

import { motion } from "framer-motion";
import { DoctorSection } from "@/components/home/DoctorSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Award, Heart, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#051124] min-h-screen pt-28">
      {/* Premium Hero Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[#051124] via-[#081e36] to-[#051124]">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-6 text-accent"
          >
            Clinical Leadership
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1] text-white mb-6"
          >
            About Dr. Rajesh Sharma
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            A dedicated leader in modern clinical care, combining 15+ years of diagnostic accuracy with empathetic family medicine.
          </motion.p>
        </div>
      </section>

      {/* Doctor Bio Section */}
      <DoctorSection />

      {/* Core Philosophies & Value Badges Grid */}
      <section className="py-20 bg-slate-950 relative overflow-hidden border-t border-white/[0.05]">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-40" />
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Empathetic Care</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We treat patients, not just symptoms. Every consultation begins with active listening to understand your personal health story.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Diagnostic Precision</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Rooted in deep clinical training and continuous medical education. We use evidence-based protocols to find the exact diagnosis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 flex items-center justify-center text-teal-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Preventive Medicine</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Empowering Surat families to stay healthy. We focus heavily on health screenings, vaccines, and actionable lifestyle modifications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clinical Philosophy */}
      <WhyChooseUs />
    </div>
  );
}
