"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Info } from "lucide-react";
import Image from "next/image";
import { BookingForm } from "@/components/booking/BookingForm";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-16 relative overflow-hidden">
      {/* Visual background grid pattern */}
      <div className="absolute inset-0 bg-grid-light pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Page Header */}
        <div className="mb-12 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-wider uppercase mb-3"
          >
            Live Booking System
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-black font-heading text-primary mb-3"
          >
            Schedule Consultation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-grey text-lg max-w-xl"
          >
            Select your clinical service and preferred slot. Live updates lock your booking in 60 seconds.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Info Panel (40%) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-2/5 space-y-6"
          >
            {/* Doctor Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-2xl shrink-0 border border-slate-100 shadow-sm overflow-hidden bg-slate-900">
                <Image
                  src="/images/dr-sharma.png"
                  alt="Dr. Rajesh Sharma"
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-primary leading-snug">Dr. Rajesh Sharma</h3>
                <p className="text-accent text-sm font-bold mb-1.5">General Physician, MD</p>
                <div className="flex items-center gap-1.5 text-xs text-text-grey">
                  <span className="text-gold font-bold">★ 4.9 Rating</span>
                  <span>• 15+ Years Exp</span>
                </div>
              </div>
            </div>

            {/* Important Info Card */}
            <div className="bg-gradient-to-r from-primary to-[#163a5f] text-white rounded-3xl p-6 shadow-[0_15px_30px_-5px_rgba(10,37,64,0.25)] border border-white/[0.08] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent/10 filter blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-4 text-accent-light">
                <Info className="w-5 h-5" />
                <h3 className="font-bold text-base uppercase tracking-wider">Appointment Guide</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span>
                  <p className="leading-relaxed">Please arrive <strong className="text-white">10 minutes before</strong> your scheduled slot for registration.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span>
                  <p className="leading-relaxed">Carry your medical files and current prescriptions if this is a follow-up visit.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span>
                  <p className="leading-relaxed">Free cancellation or rescheduling is available up to 4 hours prior to appointment.</p>
                </li>
              </ul>
            </div>

            {/* Location & Timings */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100/80 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-1">Clinic Address</h4>
                  <p className="text-text-grey text-sm leading-relaxed">Shop 12, Green Park Complex, Adajan, Surat — 395009</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-1">Consultation Hours</h4>
                  <p className="text-text-grey text-sm leading-relaxed">Mon-Sat: 9:00 AM - 1:00 PM & 5:00 PM - 9:00 PM</p>
                  <p className="text-accent text-xs font-semibold mt-1">Sun: 10:00 AM - 12:00 PM (Emergency calls only)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-1">Contact Support</h4>
                  <p className="text-text-grey text-sm font-semibold">+91 98765 43210</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* RIGHT: Form Panel (60%) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-3/5"
          >
            <BookingForm />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
