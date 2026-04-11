"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../components/CartProvider";
import AnimatedSection from "../components/AnimatedSection";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } =
    useCart();

  const shipping = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-12" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Your Selection
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            Shopping Bag
          </h1>
          <p className="text-charcoal/40 text-sm">
            {totalItems > 0
              ? `${totalItems} item${totalItems !== 1 ? "s" : ""} in your bag`
              : "Your bag is empty"}
          </p>
        </AnimatedSection>

        {items.length === 0 ? (
          /* Empty State */
          <AnimatedSection className="text-center py-16" delay={0.2}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-light-pink/30 mb-6">
              <ShoppingBag
                size={32}
                className="text-dusty-pink"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="font-heading text-2xl text-charcoal/40 mb-3">
              Nothing here yet
            </h3>
            <p className="text-sm text-charcoal/30 mb-8 max-w-sm mx-auto">
              Explore our collection and find the perfect press-on nails
              for you.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group bg-charcoal text-cream px-8 py-3.5 rounded-full text-sm tracking-widest uppercase font-medium inline-flex items-center gap-2 hover:bg-rose-gold transition-colors duration-500 cursor-pointer"
              >
                Start Shopping
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            </Link>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-dusty-pink/10 flex items-center gap-5"
                  >
                    {/* Product image thumb */}
                    <div className="w-20 h-20 min-w-[5rem] rounded-xl overflow-hidden bg-cream relative border border-charcoal/5 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center">
                          <Sparkles
                            size={18}
                            className="text-rose-gold/20 mb-1"
                            strokeWidth={1}
                          />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-base text-charcoal truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-charcoal/35 capitalize mt-0.5">
                        {item.category} · {item.style}
                      </p>
                      <p className="text-sm font-semibold text-charcoal mt-1">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/40 hover:bg-charcoal hover:text-cream transition-all duration-300 cursor-pointer"
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span className="w-8 text-center text-sm font-medium text-charcoal">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/40 hover:bg-charcoal hover:text-cream transition-all duration-300 cursor-pointer"
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-sm font-semibold text-charcoal">
                        ₹{item.price * item.quantity}
                      </p>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="text-charcoal/20 hover:text-rose-gold transition-colors duration-300 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-dusty-pink/10 sticky top-28">
                <h3 className="font-heading text-xl text-charcoal mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-charcoal/50">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/50">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-charcoal/30">
                      Free shipping on orders above ₹999
                    </p>
                  )}
                  <div className="border-t border-dusty-pink/15 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-charcoal text-base">
                      <span>Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-charcoal text-cream py-4 rounded-full text-sm tracking-widest uppercase font-medium hover:bg-rose-gold transition-colors duration-500 cursor-pointer shadow-lg shadow-charcoal/10"
                  >
                    Checkout
                  </motion.button>
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-xs text-charcoal/35 hover:text-rose-gold mt-4 transition-colors duration-300"
                >
                  Continue Shopping →
                </Link>
              </div>
            </AnimatedSection>
          </div>
        )}
      </div>
    </div>
  );
}
