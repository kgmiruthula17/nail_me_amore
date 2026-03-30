"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #FAF7F5 0%, #F7E1E3 30%, #E8B4B8 60%, #D4A0A7 100%)",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-20 animate-float"
        style={{
          background: "radial-gradient(circle, white 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-15 animate-float-slow"
        style={{
          background: "radial-gradient(circle, white 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <AnimatedSection blur>
          <Sparkles
            size={32}
            className="text-white/60 mx-auto mb-6"
            strokeWidth={1}
          />
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.15] mb-6">
            Get Salon-Quality
            <br />
            <span className="text-white italic">Nails at Home</span>
          </h2>
          <p className="text-charcoal/50 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            No appointments. No damage. No waiting. Just beautiful nails
            whenever you want them.
          </p>

          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="bg-charcoal text-cream px-10 py-4 rounded-full text-sm tracking-widest uppercase font-medium shadow-xl shadow-charcoal/20 hover:shadow-2xl hover:shadow-charcoal/30 transition-shadow duration-500 cursor-pointer"
            >
              Explore Collection
            </motion.button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
