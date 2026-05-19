"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Stethoscope, Calendar, Phone, Info } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Book", href: "/book", icon: Calendar, primary: true },
  { name: "Services", href: "/services", icon: Stethoscope },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1728]/95 backdrop-blur-2xl border-t border-white/[0.07] safe-area-pb">
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          if (tab.primary) {
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="flex flex-col items-center gap-0.5 -mt-5"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-2xl bg-accent shadow-[0_8px_24px_rgba(0,180,166,0.4)] flex items-center justify-center"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-[10px] font-bold text-accent mt-1">{tab.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center gap-1 py-1 px-3 relative"
            >
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute -inset-1.5 rounded-xl bg-accent/15"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-slate-400"
                  }`}
                />
              </motion.div>
              <span
                className={`text-[10px] font-bold transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-slate-500"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* iOS safe area bottom padding */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
