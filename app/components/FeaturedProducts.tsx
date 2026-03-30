"use client";

import AnimatedSection from "./AnimatedSection";
import ProductCard from "./ProductCard";
import { useProducts } from "./CartProvider";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 6);

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Curated Collection
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            Bestsellers
          </h2>
          <p className="text-charcoal/40 text-sm max-w-md mx-auto">
            Our most loved designs, handpicked for you. Each set is crafted
            with precision and care.
          </p>
        </AnimatedSection>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex justify-center items-center"
            >
              <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-rose-gold animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              {featured.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All CTA */}
        <AnimatedSection className="text-center mt-14" delay={0.3}>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 text-sm tracking-widest uppercase font-medium text-charcoal/50 hover:text-rose-gold transition-colors duration-300 border-b border-charcoal/15 hover:border-rose-gold pb-1 cursor-pointer"
            >
              View All Products
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
