"use client";

import { motion } from "framer-motion";
import { CheckCircle, Award, Stethoscope, ChevronRight, GraduationCap, Building2, HeartPulse, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const credentials = [
  {
    icon: GraduationCap,
    title: "Gold Medalist",
    institution: "Grant Medical College, Mumbai",
    desc: "Academically distinguished MD in Internal Medicine with honors.",
  },
  {
    icon: Building2,
    title: "Former Senior Consultant",
    institution: "Surat City Multispecialty Hospital",
    desc: "Led clinical rounds & managed critical internal medicine wards.",
  },
  {
    icon: HeartPulse,
    title: "Specialist Consultant",
    institution: "Diabetes & Hypertension Management",
    desc: "15+ years of dedicated clinical research and chronic care treatment.",
  },
  {
    icon: ShieldCheck,
    title: "Active IMA Member",
    institution: "Indian Medical Association",
    desc: "Committed to maintaining ethical clinical standards and local wellness.",
  },
];

export function DoctorSection() {
  return (
    <section id="about" className="py-28 bg-[#f8fafc] overflow-hidden relative">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-light pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Premium Styled Image & Floating Glass Badges */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 flex justify-center relative"
          >
            {/* The Outer Glowing Frame */}
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-[3rem] bg-gradient-to-tr from-accent/20 via-white to-gold/25 p-3.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]">
              
              {/* Inner container containing the portrait */}
              <div className="w-full h-full rounded-[2.5rem] bg-slate-900 overflow-hidden relative shadow-inner">
                <Image 
                  src="/images/dr-sharma.png" 
                  alt="Dr. Rajesh Sharma portrait"
                  fill
                  sizes="(max-width: 768px) 384px, 450px"
                  className="object-cover object-top scale-100 hover:scale-103 transition-transform duration-700"
                />
                
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>

              {/* Floating Badge 1: Education (positioned lower to avoid overlapping the face) */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -left-6 top-[55%] bg-[#0a2540] border border-white/[0.08] rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5"
              >
                <div className="bg-accent/20 p-2.5 rounded-xl text-accent">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Education</p>
                  <p className="text-xs font-black text-white mt-0.5">MBBS, MD (Medicine)</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Experience (positioned lower to maintain alignment) */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -right-6 bottom-[10%] bg-[#0a2540] border border-white/[0.08] rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5"
              >
                <div className="bg-gold/25 p-2.5 rounded-xl text-gold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinical Practice</p>
                  <p className="text-xs font-black text-white mt-0.5">15+ Years Active</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 flex flex-col items-start"
          >
            <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-wider uppercase mb-5">
              Meet Your Physician
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-primary tracking-tight leading-tight mb-2">
              Dr. Rajesh Sharma
            </h2>
            <h3 className="text-lg sm:text-xl text-slate-500 mb-6 font-semibold">
              General Physician & Internal Medicine Specialist
            </h3>
            
            <div className="space-y-4 text-text-dark/80 leading-relaxed mb-8 text-base sm:text-lg">
              <p>
                With over a decade and a half of dedicated clinical experience, Dr. Rajesh Sharma provides compassionate, highly personalized medical diagnostics and care. 
              </p>
              <p>
                His medical philosophy centers on a comprehensive approach—identifying systemic health factors and crafting targeted recovery programs, rather than just masking symptoms.
              </p>
            </div>

            {/* Timelined Achievements */}
            <div className="space-y-6 w-full mb-10">
              {credentials.map((cred, index) => {
                const CredIcon = cred.icon;
                return (
                  <div key={index} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      <CredIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-primary group-hover:text-accent transition-colors">
                        {cred.title} <span className="text-slate-400 font-normal">| {cred.institution}</span>
                      </h4>
                      <p className="text-xs text-text-grey mt-1 leading-relaxed">
                        {cred.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link 
              href="/book" 
              className="group inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/95 text-white px-9 h-14 font-bold shadow-[0_4px_15px_rgba(10,37,64,0.15)] transition-all duration-300 hover:scale-[1.02]"
            >
              Book clinical Consultation 
              <ChevronRight className="ml-1.5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
