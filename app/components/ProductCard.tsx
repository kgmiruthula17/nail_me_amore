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
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Combine cover image + extra images for the gallery
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.extraImages || []),
  ];

  const shapes = [
    "Stiletto",
    "Arrow",
    "Square-Extreme",
    "Square-Long",
    "Square-Short",
    "Ballerina - Long",
    "Ballerina-Medium",
    "Ballerina Short",
    "Almond-Long",
    "Almond-Medium",
    "Coffin-Extreme",
    "Coffin - Deep C",
    "Oval-Long",
    "Oval-Short"
  ];
  const sizes = ["XS", "S", "M", "L", "Custom"];

  const handleAddToCart = () => {
    setSelectedImageIndex(0);
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
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-heading text-2xl text-charcoal mb-2 pr-6 leading-tight">{product.name}</h2>
              <p className="text-rose-gold font-medium mb-4 text-sm">{displayPrice(product.price)}</p>

              {/* Product Image Gallery */}
              {allImages.length > 0 && (
                <div className="mb-6">
                  {/* Main selected image */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-cream mb-3 border border-dusty-pink/10">
                    <Image
                      src={allImages[selectedImageIndex]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  {/* Thumbnail strip */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedImageIndex(i)}
                          className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                            selectedImageIndex === i
                              ? "border-rose-gold shadow-md"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="56px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Options */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-2 font-medium">Shape</label>
                  <select
                    value={selectedShape}
                    onChange={(e) => setSelectedShape(e.target.value)}
                    className="w-full border border-dusty-pink/30 rounded-xl px-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold appearance-none bg-cream/40 transition-shadow cursor-pointer"
                  >
                    <option value="" disabled hidden>Select your shape</option>
                    {shapes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 font-medium">
                      Size 
                    </label>
                    <Link href="/size-guide" target="_blank" className="text-[10px] text-rose-gold hover:text-charcoal transition-colors uppercase tracking-wider underline underline-offset-2">Shape & Size Guide</Link>
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

                {/* Additional Info */}
                <div className="space-y-4 pt-4 pb-2 border-t border-dusty-pink/20">
                  <div>
                    <h4 className="font-heading text-sm text-charcoal mb-1">Estimated delivery time ~</h4>
                    <p className="text-[11px] text-charcoal/60 leading-relaxed">
                      Each set is handmade with lot of care and love with great attention to detailing. With the undying trust and love of our regular and new clients we are almost always fully booked so our normal EDT is 2-4 weeks. We expect your patience and cooperation in order to deliver you a set that&rsquo;s pure art & magic.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm text-charcoal mb-1">What&rsquo;s inside the box? ~</h4>
                    <p className="text-[11px] text-charcoal/60 leading-relaxed">
                      A set of high quality handmade 10 Press on nails with glue & prep kit.
                    </p>
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
                whileHover={selectedShape && selectedSize ? { scale: 1.02 } : {}}
                whileTap={selectedShape && selectedSize ? { scale: 0.98 } : {}}
                onClick={handleConfirmAddToCart}
                disabled={!selectedShape || !selectedSize}
                className={`w-full mt-8 py-4 rounded-full text-xs uppercase tracking-widest font-medium transition-colors duration-300 shadow-xl shadow-charcoal/10 ${
                  selectedShape && selectedSize 
                    ? "bg-charcoal text-cream hover:bg-rose-gold cursor-pointer" 
                    : "bg-charcoal/40 text-white cursor-not-allowed"
                }`}
              >
                {!selectedShape || !selectedSize 
                  ? "Select Shape & Size" 
                  : `Add to Cart - ${displayPrice(product.price * quantity)}`}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
