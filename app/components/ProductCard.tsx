"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import { Product, useCart } from "./CartProvider";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-dusty-pink/15 transition-shadow duration-500"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-cream flex flex-col items-center justify-center p-6 transition-transform duration-700 group-hover:scale-105">
              <Sparkles
                size={28}
                className="text-rose-gold/20 mb-3"
                strokeWidth={1}
              />
              <p className="text-rose-gold/30 text-[10px] tracking-[0.25em] uppercase font-medium">
                {product.category}
              </p>
            </div>
          )}

          {/* Sale badge removed */}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-heading text-[13px] sm:text-lg text-charcoal mb-2 sm:mb-3 truncate">
              {product.name}
            </h3>
          </div>

          <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-2.5 2xl:gap-0 mt-1 sm:mt-0">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-[13px] sm:text-lg font-semibold text-charcoal">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[9px] sm:text-sm text-charcoal/30 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 w-full 2xl:w-auto px-2 py-1.5 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-xs font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                added
                  ? "bg-green-100 text-green-700"
                  : "bg-charcoal text-cream hover:bg-rose-gold"
              }`}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check size={10} className="sm:w-3 sm:h-3" /> Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1"
                  >
                    <ShoppingBag size={10} className="sm:w-3 sm:h-3" /> Add
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
