"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SizeGuidePage() {
  const sizes = [
    { name: "XS", dims: "14, 10, 11, 10, 8mm" },
    { name: "S", dims: "15, 11, 12, 11, 9mm" },
    { name: "M", dims: "16, 12, 13, 12, 9mm" },
    { name: "L", dims: "17, 13, 14, 13, 10mm" },
    { name: "Custom", dims: "Measure your own nails" },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        {/* Header */}
        <AnimatedSection className="text-center mb-16" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Find Your Perfect Fit
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            Size & Shape Guide
          </h1>
          <p className="text-charcoal/60 text-sm max-w-lg mx-auto">
            Use our comprehensive guide to select the perfect shape and size
            for your next set of luxury press-on nails.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Size Guide */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-dusty-pink/10 h-full">
              <h2 className="font-heading text-2xl text-charcoal mb-6 border-b border-dusty-pink/30 pb-4">
                Size Measurements
              </h2>
              <div className="space-y-4">
                {sizes.map((size, i) => (
                  <motion.div
                    key={size.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-cream/50"
                  >
                    <span className="font-heading text-lg font-medium text-charcoal">
                      {size.name}
                    </span>
                    <span className="text-sm text-charcoal/60 tracking-wider">
                      {size.dims}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 p-5 bg-rose-gold/5 rounded-2xl border border-rose-gold/10">
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  <strong className="font-medium text-charcoal">How to measure:</strong> Use a soft measuring tape horizontally across the widest part of your natural nail bed.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Shape Guide */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-dusty-pink/10 h-full flex flex-col">
              <h2 className="font-heading text-2xl text-charcoal mb-6 border-b border-dusty-pink/30 pb-4">
                Available Shapes
              </h2>
              <div className="relative flex-grow flex items-center justify-center min-h-[400px] bg-cream/30 rounded-2xl overflow-hidden border border-charcoal/5">
                <Image
                  src="/shape-guide.png"
                  alt="Nail Shape Guide"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
