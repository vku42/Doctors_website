"use client";

import { motion } from "framer-motion";
import { 
  HeartPulse, ShieldCheck, Activity, Baby, Wind, FileText, 
  ArrowRight, CheckCircle2, ShieldAlert, Sparkles, PhoneCall
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const detailedServices = [
  {
    id: "general",
    title: "General Consultation",
    subtitle: "Acute Illness & Infection Care",
    description: "Expert diagnostics and customized treatments for acute medical concerns. Dr. Sharma provides comprehensive evaluations to help you recover quickly.",
    icon: HeartPulse,
    image: "/images/services/general.png",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    features: [
      "Seasonal flu, viral fevers, and common colds",
      "Gastrointestinal disorders & food poisoning",
      "Urinary tract infections (UTIs)",
      "Skin rashes, allergies, and bite treatments"
    ]
  },
  {
    id: "preventive",
    title: "Preventive Care",
    subtitle: "Health Screenings & Vaccinations",
    description: "Prioritize wellness with strategic health monitoring. We provide targeted lab diagnostics and adult immunizations to prevent medical conditions before they start.",
    icon: ShieldCheck,
    image: "/images/services/preventive.png",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    features: [
      "Comprehensive annual health checkups",
      "Cardiovascular risk evaluations",
      "Adult vaccinations (Flu, Pneumonia, Hep B)",
      "Dietary analysis & lifestyle optimization guidance"
    ]
  },
  {
    id: "chronic",
    title: "Chronic Disease Management",
    subtitle: "Continuous Health Control Protocols",
    description: "Comprehensive management for lifestyle and metabolic disorders. Dr. Sharma designs customized monitoring schedules and medication plans to minimize long-term risks.",
    icon: Activity,
    image: "/images/services/chronic.png",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    features: [
      "Type 1 & Type 2 Diabetes care plan management",
      "Hypertension (High Blood Pressure) control",
      "Thyroid disorder diagnosis & balancing",
      "Hyperlipidemia (High Cholesterol) tracking"
    ]
  },
  {
    id: "pediatric",
    title: "Pediatric Consultation",
    subtitle: "Gentle Healthcare for Children",
    description: "Caring clinical attention for children and teenagers. We focus on physical development checkups, immunization, and treating common childhood infections in a warm environment.",
    icon: Baby,
    image: "/images/services/pediatric.png",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    features: [
      "Child development milestones checking",
      "Common pediatric infections & stomach bugs",
      "Childhood asthma & respiratory allergy care",
      "General dietary guidance for children"
    ]
  },
  {
    id: "respiratory",
    title: "Respiratory Care",
    subtitle: "Asthma, Bronchitis & Allergy Management",
    description: "Effective clinical strategies for lung and airway health. We diagnose, treat, and help manage acute respiratory distress, wheezing, and chronic coughs.",
    icon: Wind,
    image: "/images/services/respiratory.png",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    features: [
      "Asthma monitoring & customized inhaler planning",
      "Acute bronchitis & chest infection treatment",
      "Chronic allergic rhinitis therapy",
      "Nebulization support for breathing distress"
    ]
  },
  {
    id: "certificates",
    title: "Medical Certificates",
    subtitle: "Official Fitness & Checkup Documentation",
    description: "Thorough, professional health assessments for documentation. Get validated medical certificates for employment, driving licenses, travel, or academic purposes.",
    icon: FileText,
    image: "/images/services/certificates.png",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    features: [
      "Official corporate employment fitness screening",
      "Pre-travel health evaluations & stamps",
      "Academic/sports team physical fitness testing",
      "Sickness leaves & recovery validation records"
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-[#fbfcfd] min-h-screen pt-28 pb-20">
      
      {/* Page Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[#051124] to-[#081e36] text-white">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-6 text-accent"
          >
            Clinical Scope
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1] text-white mb-6"
          >
            Our Medical Services
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Comprehensive diagnostics and customized treatment plans tailored to keep Surat families healthy.
          </motion.p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-grid-light opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <div className="space-y-24">
            {detailedServices.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}
                >
                  {/* Left Column - Image (Swaps order on even/odd items) */}
                  <div className={`lg:col-span-6 relative h-[380px] rounded-3xl overflow-hidden border border-slate-100 shadow-xl group ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}>
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-750"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating Icon Badge */}
                    <div className={`absolute top-6 left-6 w-14 h-14 rounded-2xl ${service.bg} border ${service.border} backdrop-blur-md flex items-center justify-center shadow-lg`}>
                      <Icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                  </div>

                  {/* Right Column - Text & Features */}
                  <div className={`lg:col-span-6 flex flex-col justify-center ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}>
                    <span className={`text-xs font-bold tracking-widest uppercase ${service.color} mb-3`}>
                      {service.subtitle}
                    </span>
                    <h2 className="text-3xl font-black text-primary font-heading mb-4">
                      {service.title}
                    </h2>
                    <p className="text-text-grey text-base sm:text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {service.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm font-semibold text-text-dark">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/book"
                        className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent/90 text-white px-7 h-12 text-sm font-bold shadow-md hover:shadow-lg transition-all"
                      >
                        Book Slot Now <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-white text-text-dark border border-slate-200 hover:bg-slate-50 px-7 h-12 text-sm font-bold transition-colors"
                      >
                        Ask a Question
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden mt-12 rounded-t-[3rem]">
        <div className="absolute inset-0 bg-grid-dark opacity-35 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
          <Sparkles className="w-8 h-8 text-accent mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-6">Need Immediate Clinical Assistance?</h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Book your slot online instantly or dial our clinical desk number directly. We are committed to your wellbeing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent/95 text-white px-8 h-14 font-bold shadow-lg hover:scale-[1.02] transition-all"
            >
              Book Physical Slot
            </Link>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center rounded-full bg-white/10 text-white border border-white/10 hover:bg-white/15 px-8 h-14 font-bold transition-colors"
            >
              <PhoneCall className="w-4 h-4 mr-2" /> Call Clinical Desk
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
