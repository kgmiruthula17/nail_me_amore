"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const heroImages = ["/hero-img/1.png", "/hero-img/2.png"];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={heroImages[currentImageIndex]}
              alt="Hero Background"
              fill
              className="object-cover"
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/20 z-10 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        {/* Micro label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block text-[11px] tracking-[0.35em] uppercase text-cream font-semibold border border-cream/30 rounded-full px-5 py-2 mb-8">
            ✦ Handcrafted with Love ✦
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(16px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6"
        >
          Luxury Nails,
          <br />
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
            className="bg-[linear-gradient(to_right,#D4AF37,#FFB07C,#FF91A4,#FFB07C,#D4AF37)] bg-[length:200%_auto] text-transparent bg-clip-text italic drop-shadow-md"
          >
            Ready in Minutes
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-white/70 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Handcrafted press-on nails designed for the modern woman.
          Premium quality, delivered across India.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group bg-cream text-charcoal px-8 py-4 rounded-full text-sm tracking-widest uppercase font-medium flex items-center gap-3 hover:bg-rose-gold transition-colors duration-500 cursor-pointer shadow-lg shadow-charcoal/10"
            >
              Shop Now
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>
          </Link>

          <Link href="/custom-order">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full text-sm tracking-widest uppercase font-medium text-cream/90 border border-cream/30 hover:bg-white/10 hover:border-white transition-all duration-500 cursor-pointer backdrop-blur-sm shadow-lg shadow-white/5"
            >
              Custom Order
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
