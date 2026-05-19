"use client";

import { motion } from "framer-motion";
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, 
  AlertCircle, Sparkles, Building2, Map 
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "general",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const checkIsOpen = () => {
      const now = new Date();
      const day = now.getDay();
      const hours = now.getHours();
      
      if (day === 0) {
        setIsOpen(hours >= 10 && hours < 12);
      } else {
        setIsOpen((hours >= 9 && hours < 13) || (hours >= 17 && hours < 21));
      }
    };
    checkIsOpen();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate API dispatch
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", phone: "", email: "", subject: "general", message: "" });
    }, 1200);
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen pt-28">
      
      {/* Page Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[#051124] to-[#081e36] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-6 text-accent"
          >
            Connect With Us
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1] text-white mb-6"
          >
            Contact Our Clinic
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Get in touch for medical inquiries, health documentation requests, or clinical consultations support.
          </motion.p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-grid-light opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Contact details / Schedule Card (5 columns) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Timing Box with Live indicator */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-black text-xl text-primary">Clinic Timings</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                    <span className="relative flex h-2 w-2">
                      {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-success' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-xs font-bold text-primary">{isOpen ? 'Open Now' : 'Closed'}</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm font-semibold text-text-dark">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span>Monday - Saturday (Morning)</span>
                    <span className="text-primary font-bold">9:00 AM – 1:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span>Monday - Saturday (Evening)</span>
                    <span className="text-primary font-bold">5:00 PM – 9:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 text-accent">
                    <span>Sunday</span>
                    <span className="font-extrabold">10:00 AM – 12:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Direct Details Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6">
                <h3 className="font-heading font-black text-xl text-primary mb-2">Direct Contact</h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Call Phone</h4>
                    <p className="text-base font-bold text-primary">+91 98765 43210</p>
                    <p className="text-xs text-slate-400 font-medium">Available during clinical hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">WhatsApp Chat</h4>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-primary hover:text-accent transition-colors">
                      +91 98765 43210
                    </a>
                    <p className="text-xs text-slate-400 font-medium">Quick replies for scheduling</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Send Email</h4>
                    <p className="text-base font-bold text-primary">drsharma@clinic.com</p>
                    <p className="text-xs text-slate-400 font-medium">Reports and official enquiries</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Clinic Address</h4>
                    <p className="text-sm font-bold text-primary leading-relaxed">
                      Shop 12, Green Park Complex, Adajan, Surat — 395009
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side: Message Form (7 columns) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-xl relative">
                <h3 className="font-heading font-black text-2xl text-primary mb-2">Send a Message</h3>
                <p className="text-sm text-text-grey font-medium mb-8">
                  Have a general inquiry or need help? Fill out the form below and our medical team will get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-slate-100 focus:border-accent bg-slate-50/50 outline-none text-primary font-semibold text-sm transition-all focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-slate-100 focus:border-accent bg-slate-50/50 outline-none text-primary font-semibold text-sm transition-all focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-slate-100 focus:border-accent bg-slate-50/50 outline-none text-primary font-semibold text-sm transition-all focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Subject Of Enquiry</label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-slate-100 focus:border-accent bg-slate-50/50 outline-none text-primary font-bold text-sm transition-all focus:bg-white"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="reports">Lab Reports / Records</option>
                      <option value="billing">Billing / Corporate Schemes</option>
                      <option value="feedback">Feedback / Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we assist you?"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full p-4 rounded-xl border border-slate-100 focus:border-accent bg-slate-50/50 outline-none text-primary font-medium text-sm transition-all focus:bg-white resize-none"
                    />
                  </div>

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Thank you! Your message has been received. We will get in touch shortly.</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full h-12 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    {status === "submitting" ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mock Map / Location Area */}
      <section className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
              <Map className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg">Looking for directions?</h3>
              <p className="text-sm text-slate-400">Located centrally in Adajan, Surat next to Green Park Complex.</p>
            </div>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent/95 text-white px-7 h-12 text-sm font-bold shadow-lg hover:scale-[1.02] transition-all shrink-0"
          >
            Open in Google Maps
          </a>
        </div>
      </section>

    </div>
  );
}
