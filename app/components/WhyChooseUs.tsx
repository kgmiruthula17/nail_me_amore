"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import {
  Gem,
  RefreshCw,
  Clock,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "Handmade Quality",
    description: "Each nail is meticulously handcrafted with premium materials for a flawless finish.",
  },
  {
    icon: RefreshCw,
    title: "Reusable",
    description: "Designed to be reused up to 15+ times with proper care. Sustainable beauty.",
  },
  {
    icon: Clock,
    title: "Long Lasting",
    description: "Up to 2 weeks of wear with our professional-grade adhesive system.",
  },
  {
    icon: Truck,
    title: "PAN India Shipping",
    description: "Free shipping across India. Delivered safely to your doorstep within 5-7 days.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-soft-gray relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #E8B4B8 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Why Us
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            The Amore Difference
          </h2>
          <p className="text-charcoal/40 text-sm max-w-md mx-auto">
            We believe luxury nails should be effortless, sustainable, and
            accessible to everyone.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm hover:shadow-lg hover:shadow-dusty-pink/10 transition-all duration-500 h-full border border-white/50"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-light-pink/50 mb-5">
                  <feature.icon
                    size={24}
                    className="text-rose-gold"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-heading text-lg text-charcoal mb-2">
                  {feature.title}
                </h3>
                <p className="text-charcoal/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
