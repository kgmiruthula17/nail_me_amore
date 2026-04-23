"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function UsageGuidePage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        {/* Header */}
        <AnimatedSection className="text-center mb-16" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Step-by-Step Tutorial
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            How to Apply & Remove
          </h1>
          <p className="text-charcoal/60 text-sm max-w-xl mx-auto">
            Achieve a flawless, salon-quality manicure at home in minutes. Follow these simple steps for application and safe removal.
          </p>
        </AnimatedSection>

        {/* Usage Guide Image */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-dusty-pink/10">
            <div className="relative w-full aspect-[3/4] md:aspect-auto md:min-h-[800px] bg-cream/30 rounded-2xl overflow-hidden border border-charcoal/5">
              <Image
                src="/usage-guide.jpeg"
                alt="Usage Guide - How to Apply and Remove"
                fill
                className="object-contain p-2 md:p-4"
                sizes="(max-width: 768px) 100vw, 1000px"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Pro Tips */}
        <AnimatedSection delay={0.4}>
            <div className="mt-16 p-8 md:p-10 bg-gradient-to-br from-rose-gold/5 to-dusty-pink/10 rounded-3xl border border-rose-gold/10">
                <h3 className="font-heading text-2xl text-charcoal mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-rose-gold" /> Pro Tips for Longer Wear
                </h3>
                <ul className="space-y-4">
                    <li className="flex gap-3 text-sm text-charcoal/70 leading-relaxed">
                        <span className="text-rose-gold font-bold">•</span>
                        <span><strong>Prep is Key:</strong> Ensuring your natural nails are completely free of oils and adequately buffed is the secret to a long-lasting manicure.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-charcoal/70 leading-relaxed">
                        <span className="text-rose-gold font-bold">•</span>
                        <span><strong>Avoid Water Initially:</strong> Try not to wash your hands or shower for at least 2 hours after applying to let the adhesive set completely.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-charcoal/70 leading-relaxed">
                        <span className="text-rose-gold font-bold">•</span>
                        <span><strong>Never Force Removal:</strong> <AlertCircle size={14} className="inline text-red-400 mx-1 mb-1" /> Never rip or tear the nails off as this can damage your natural nail layer. Always soak them first.</span>
                    </li>
                </ul>
            </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
