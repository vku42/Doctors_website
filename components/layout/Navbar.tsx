"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const useWhiteText = isHomePage && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        useWhiteText
          ? "bg-transparent py-4 sm:py-5"
          : isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-b border-slate-100/80 py-2.5 sm:py-3"
          : "bg-white/95 backdrop-blur-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border-b border-slate-100 py-3 sm:py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              useWhiteText
                ? "bg-white/10 group-hover:bg-white/20 border border-white/20"
                : "bg-accent/10 group-hover:bg-accent/20 border border-accent/15"
            }`}>
              <Stethoscope className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${useWhiteText ? "text-white" : "text-accent"}`} />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-heading font-extrabold text-sm sm:text-base tracking-tight transition-colors ${
                useWhiteText ? "text-white" : "text-primary"
              }`}>
                Dr. Sharma&apos;s
              </span>
              <span className={`font-heading font-medium text-[10px] sm:text-xs tracking-widest uppercase transition-colors ${
                useWhiteText ? "text-white/60" : "text-accent"
              }`}>
                Clinic
              </span>
            </div>
          </Link>

          {/* Desktop Nav links (hidden on mobile — bottom nav handles it) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? useWhiteText
                        ? "text-white bg-white/10"
                        : "text-accent bg-accent/8"
                      : useWhiteText
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className={`absolute inset-0 rounded-xl -z-10 ${
                        useWhiteText ? "bg-white/10" : "bg-accent/8"
                      }`}
                      transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Book button (desktop) + Mobile compact book pill */}
          <div className="flex items-center gap-2">
            {/* Desktop book button */}
            <Link
              href="/book"
              className={`hidden md:inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                useWhiteText
                  ? "bg-white text-primary hover:bg-slate-50"
                  : "bg-accent text-white hover:bg-accent/90 shadow-accent/25"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>

            {/* Mobile: small pill button (since no hamburger needed with bottom nav) */}
            <Link
              href="/book"
              className={`md:hidden inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                useWhiteText
                  ? "bg-white/15 text-white border border-white/25 backdrop-blur-sm"
                  : "bg-accent text-white shadow-[0_2px_10px_rgba(0,180,166,0.35)]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Book
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
