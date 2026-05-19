"use client";

import { motion } from "framer-motion";
import { Zap, Smartphone, Bot, Leaf, ShieldAlert } from "lucide-react";

const features = [
  {
    title: "Same-Day Instant Slots",
    description: "Skip the stressful queues. Book online instantly and secure your physical consultation slot on the very same day.",
    icon: Zap,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  },
  {
    title: "Digital-First Clinical Experience",
    description: "Convenient electronic prescriptions, direct digital appointment reminders, and follow-ups on WhatsApp.",
    icon: Smartphone,
    color: "text-accent bg-accent/10 border-accent/25",
  },
  {
    title: "24/7 AI Health Assistant",
    description: "Get answers to general healthcare queries, check symptom basics, and interact with our intelligent clinical bot anytime.",
    icon: Bot,
    color: "text-teal-400 bg-teal-400/10 border-teal-400/25",
  },
  {
    title: "Empathetic Holistic Focus",
    description: "We focus on clinical diagnostic accuracy and long-term wellness routines tailored specifically to your lifestyle.",
    icon: Leaf,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  },
];

export function WhyChooseUs() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    currentTarget.style.setProperty("--mouse-x", `${x}px`);
    currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="py-28 bg-[#030d1a] text-white relative overflow-hidden">
      {/* Dark Dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-dark opacity-60 pointer-events-none" />

      {/* Premium ambient decorative floating blobs */}
      <motion.div 
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-accent/10 filter blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/25 filter blur-[120px] pointer-events-none" 
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-white/[0.04] border border-white/[0.08] text-teal-300 rounded-full text-xs font-bold tracking-wider uppercase mb-4"
          >
            Clinical Philosophy
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight mb-5"
          >
            Why Patients Choose Our Clinic
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-400"
          >
            We merge advanced clinical diagnostics with traditional, empathetic family care values.
          </motion.p>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseMove={handleMouseMove}
                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-accent/40 hover:bg-white/[0.04] transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,180,166,0.1)] relative overflow-hidden"
              >
                {/* Spotlight background overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 180, 166, 0.15), transparent 80%)`,
                  }}
                />

                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />

                <div className="flex gap-6 items-start relative z-10">
                  {/* Glowing Icon Frame */}
                  <div className={`w-12 h-12 rounded-2xl ${feature.color} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
