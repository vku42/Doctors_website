"use client";

import { motion } from "framer-motion";
import { HeartPulse, ShieldCheck, Activity, Baby, Wind, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    id: "general",
    title: "General Consultation",
    description: "Expert diagnosis and compassionate treatment for acute illnesses, infections, and seasonal health concerns.",
    icon: HeartPulse,
    image: "/images/services/general.png",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "preventive",
    title: "Preventive Care",
    description: "Comprehensive health checkups, personalized screenings, and vaccines to keep you healthy long-term.",
    icon: ShieldCheck,
    image: "/images/services/preventive.png",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    id: "chronic",
    title: "Chronic Disease Management",
    description: "Dedicated monitoring and support for conditions like diabetes, hypertension, and thyroid disorders.",
    icon: Activity,
    image: "/images/services/chronic.png",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    id: "pediatric",
    title: "Pediatric Consultation",
    description: "Compassionate, gentle healthcare for infants, toddlers, and adolescents in a warm environment.",
    icon: Baby,
    image: "/images/services/pediatric.png",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "respiratory",
    title: "Respiratory Care",
    description: "Advanced management for asthma, breathing difficulties, chronic allergies, and bronchitis.",
    icon: Wind,
    image: "/images/services/respiratory.png",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    id: "certificates",
    title: "Medical Certificates",
    description: "Thorough physical checkups and official fitness certificates for work, sports, or travel.",
    icon: FileText,
    image: "/images/services/certificates.png",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export function ServicesPreview() {
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    currentTarget.style.setProperty("--mouse-x", `${x}px`);
    currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="services" className="py-28 bg-[#fbfcfd] relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-light pointer-events-none" />

      {/* Decorative ambient blurred spots */}
      <motion.div 
        animate={{
          y: [0, 40, -20, 0],
          x: [0, 20, -10, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-accent/5 filter blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{
          y: [0, -30, 30, 0],
          x: [0, -20, 20, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl pointer-events-none" 
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Elegant Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-wider uppercase mb-4"
          >
            Clinical Specialties
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-primary leading-tight mb-5"
          >
            Comprehensive Medical Care
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-text-grey"
          >
            Tailored clinical strategies combining modern diagnostic precision with compassionate patient care.
          </motion.p>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link 
                  href={`/services#${service.id}`}
                  onMouseMove={handleMouseMove}
                  className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:border-accent/40 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Spotlight background overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none z-10"
                    style={{
                      background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 180, 166, 0.08), transparent 80%)`,
                    }}
                  />

                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-accent-light transition-all duration-500 z-20" />
                  
                  {/* Image Header (Full bleed) */}
                  <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-750 ease-out"
                    />
                    
                    {/* Shadow overlay gradient at bottom of image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

                    {/* Absolute positioning arrow element floating inside image */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:text-accent transition-all duration-300 z-10 shadow-md">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    {/* Floating Badge representing the icon, positioned bottom-right of picture */}
                    <div className={`absolute bottom-4 right-4 w-11 h-11 rounded-2xl ${service.bg} border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 z-10`}>
                      <Icon className={`w-5 h-5 ${service.color}`} />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-7 flex-1 flex flex-col items-start justify-between relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-text-dark mb-3 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base text-text-grey leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center text-sm font-bold text-accent mt-auto group-hover:translate-x-1 transition-transform duration-300">
                      Learn More <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Explore All CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/services" 
            className="group inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/95 text-white px-9 h-14 font-bold shadow-[0_4px_15px_rgba(10,37,64,0.15)] transition-all duration-300 hover:scale-[1.02]"
          >
            View All Services 
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
