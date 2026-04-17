"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Palette, Ruler, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Upload any inspiration image",
    desc: "Pinterest, Instagram, screenshots — any image works.",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-400",
  },
  {
    icon: Palette,
    title: "We match colors and designs",
    desc: "Intricate patterns, ombre, foils — replicated with precision.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    icon: Ruler,
    title: "Perfect fit, every time",
    desc: "Standard XS–XL or custom measurements for your nail bed.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-400",
  },
  {
    icon: CheckCircle,
    title: "Premium salon-quality finish",
    desc: "Gel formulas, top coat sealed and built to last 2–3 weeks.",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
];

const stats = [
  { value: "98%", label: "Design accuracy rating", accent: true },
  { value: "2-4 weeks", label: "Avg. turnaround time" },
  { value: "5+", label: "Size options XS to XL" },
  { value: "2k+", label: "Custom sets crafted", accent: true },
];

const steps = [
  { label: "Upload inspo", color: "bg-pink-50 text-pink-400" },
  { label: "Pick size", color: "bg-amber-50 text-amber-500" },
  { label: "We craft", color: "bg-blue-50 text-blue-400" },
  { label: "You slay", color: "bg-green-50 text-green-500" },
];

export default function CustomNailSection() {
  return (
    <section className="h-screen bg-white flex items-center overflow-hidden">
      <div className="max-w-6xl w-full mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-dusty-pink font-semibold tracking-widest text-xs uppercase mb-2 block">
            Your Vision, Our Canvas
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <h2 className="text-3xl md:text-4xl font-heading text-charcoal leading-tight">
              Bring Your Dream Nails to Life
            </h2>
            <p className="text-charcoal/55 text-sm leading-relaxed max-w-xs">
              Found a set on Pinterest or Instagram that you love? Upload your inspiration
              and we'll handcraft a custom set, tailored just for you.
             </p>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left — Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
          >
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-soft-gray/40 rounded-2xl px-4 py-3 border border-warm-white"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg} ${item.iconColor}`}>
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">{item.title}</p>
                  <p className="text-charcoal/50 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            <div className="pt-3">
              <Link href="/custom-order">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-charcoal text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase font-medium hover:bg-rose-gold transition-colors duration-500"
                >
                  Start Custom Order
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right — Stats + Process */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Stat Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white border border-warm-white rounded-2xl px-4 py-4">
                  <p className={`text-2xl font-heading leading-none mb-1 ${stat.accent ? "text-dusty-pink" : "text-charcoal"}`}>
                    {stat.value}
                  </p>
                  <p className="text-charcoal/45 text-xs leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Process Steps with connecting line */}
            <div className="bg-white border border-warm-white rounded-2xl px-5 py-5">
              <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-medium mb-5">
                How it works
              </p>

              <div className="relative flex items-start justify-between">
                {/* Connecting line behind the dots */}
                <div className="absolute top-3.5 left-[14px] right-[14px] h-px bg-warm-white z-0" />

                {steps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold border border-white ${step.color}`}>
                      {idx + 1}
                    </div>
                    <p className="text-[10px] text-charcoal/50 mt-2 text-center leading-tight px-1">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}