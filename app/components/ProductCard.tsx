"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Sparkles, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product, useCart } from "./CartProvider";
import { useCountry } from "./CountryProvider";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { displayPrice } = useCountry();
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedShape, setSelectedShape] = useState("Medium Coffin");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const shapes = ["Medium Square", "Medium Oval", "Medium Stiletto", "Medium Almond", "Medium Coffin", "Long Square", "Long Oval", "Long Stiletto", "Long Almond", "Long Coffin", "XL Square"];
  const sizes = ["XS", "S", "M", "L", "Custom"];

  const handleAddToCart = () => {
    setShowModal(true);
  };

  const handleConfirmAddToCart = () => {
    addToCart(product, selectedShape, selectedSize, quantity);
    setShowModal(false);
    setAdded(true);
    setQuantity(1); // Reset
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
                {displayPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[9px] sm:text-sm text-charcoal/30 line-through">
                  {displayPrice(product.originalPrice)}
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

      {/* Add To Cart Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md relative z-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-heading text-2xl text-charcoal mb-2 pr-6 leading-tight">{product.name}</h2>
              <p className="text-rose-gold font-medium mb-6 text-sm">{displayPrice(product.price)}</p>

              {/* Options */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-2 font-medium">Shape</label>
                  <select
                    value={selectedShape}
                    onChange={(e) => setSelectedShape(e.target.value)}
                    className="w-full border border-dusty-pink/30 rounded-xl px-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold appearance-none bg-cream/40 transition-shadow cursor-pointer"
                  >
                    {shapes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 font-medium">
                      Size 
                    </label>
                    <Link href="/size-guide" target="_blank" className="text-[10px] text-rose-gold hover:text-charcoal transition-colors uppercase tracking-wider underline underline-offset-2">Size Guide</Link>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-300 border ${selectedSize === s ? 'border-rose-gold bg-rose-gold text-white font-medium shadow-md shadow-rose-gold/20' : 'border-dusty-pink/30 text-charcoal/60 hover:border-rose-gold/50 bg-white'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-2 font-medium">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-dusty-pink/30 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:border-charcoal/30 transition-colors cursor-pointer">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-charcoal font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full border border-dusty-pink/30 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:border-charcoal/30 transition-colors cursor-pointer">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmAddToCart}
                className="w-full mt-8 bg-charcoal text-cream hover:bg-rose-gold py-4 rounded-full text-xs uppercase tracking-widest font-medium transition-colors duration-300 shadow-xl shadow-charcoal/10"
              >
                Add to Cart - {displayPrice(product.price * quantity)}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
