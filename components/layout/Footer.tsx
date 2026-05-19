"use client";

import Link from "next/link";
import { Stethoscope, MapPin, Phone, Mail, Globe, Clock, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIsOpen = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hours = now.getHours();
      
      if (day === 0) {
        // Sunday: 10:00 AM – 12:00 PM
        setIsOpen(hours >= 10 && hours < 12);
      } else {
        // Mon-Sat: 9:00 AM – 1:00 PM | 5:00 PM – 9:00 PM (21:00)
        setIsOpen((hours >= 9 && hours < 13) || (hours >= 17 && hours < 21));
      }
    };

    checkIsOpen();
    const interval = setInterval(checkIsOpen, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="contact" className="bg-primary text-white/80 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-white">
                Dr. Sharma&apos;s Clinic
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Providing premium, compassionate healthcare to Surat families for over 15 years. Your health is our priority.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-accent transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Doctor</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="/book" className="hover:text-accent transition-colors">Book Appointment</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Services</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/services#general" className="hover:text-accent transition-colors">General Consultation</Link></li>
              <li><Link href="/services#preventive" className="hover:text-accent transition-colors">Preventive Care</Link></li>
              <li><Link href="/services#chronic" className="hover:text-accent transition-colors">Chronic Disease</Link></li>
              <li><Link href="/services#pediatric" className="hover:text-accent transition-colors">Pediatric Care</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Timing */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>Shop 12, Green Park Complex, Adajan, Surat — 395009</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>drsharma@clinic.com</span>
              </li>
            </ul>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-accent" />
                <h4 className="text-white text-sm font-semibold">Clinic Timings</h4>
                <div className="ml-auto flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-success' : 'bg-red-500'}`}></span>
                  </span>
                  <span className="text-xs font-medium text-white">{isOpen ? 'Open Now' : 'Closed'}</span>
                </div>
              </div>
              <ul className="text-xs space-y-2">
                <li className="flex justify-between">
                  <span>Mon - Sat</span>
                  <span>9:00 AM – 1:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span></span>
                  <span>5:00 PM – 9:00 PM</span>
                </li>
                <li className="flex justify-between text-accent/80 pt-1">
                  <span>Sunday</span>
                  <span>10:00 AM – 12:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Dr. Sharma&apos;s Clinic. All rights reserved.</p>
          <p>Website by <a href="#" className="text-white hover:text-accent font-medium transition-colors">Vehon</a> — AI-Era Clinic Websites</p>
        </div>
      </div>
    </footer>
  );
}
