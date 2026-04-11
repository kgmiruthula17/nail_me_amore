"use client";

import { motion } from "framer-motion";
import { useCart } from "../components/CartProvider";
import AnimatedSection from "../components/AnimatedSection";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, User, Phone, Mail } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          total: grandTotal,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            imageUrl: item.image || null,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order.");
      }

      const orderData = await response.json();

      // Clear the local cart
      clearCart();

      // Redirect to success page
      router.push(`/checkout/success`);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty and user just landed here somehow
  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-cream flex flex-col items-center justify-center">
        <h2 className="text-2xl font-heading text-charcoal mb-4">Your cart is empty</h2>
        <Link href="/shop" className="text-rose-gold hover:underline">
          Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="mb-10 flex items-center justify-between" blur>
          <div>
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-charcoal/40 hover:text-rose-gold transition-colors mb-4 group"
            >
              <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Cart
            </Link>
            <h1 className="font-heading text-4xl text-charcoal">Secure Checkout</h1>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <AnimatedSection delay={0.1}>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-dusty-pink/10 space-y-6">
                <div>
                  <h3 className="font-heading text-xl text-charcoal mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-sm text-charcoal/60 font-medium ml-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User size={16} className="text-charcoal/20" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-cream/30 border border-dusty-pink/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-gold transition-all duration-300 text-charcoal placeholder-charcoal/30"
                          placeholder="Jane Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-charcoal/60 font-medium ml-1">Mobile Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone size={16} className="text-charcoal/20" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-cream/30 border border-dusty-pink/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-gold transition-all duration-300 text-charcoal placeholder-charcoal/30"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm text-charcoal/60 font-medium ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={16} className="text-charcoal/20" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-cream/30 border border-dusty-pink/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-gold transition-all duration-300 text-charcoal placeholder-charcoal/30"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm text-charcoal/60 font-medium ml-1">Delivery Address</label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
                          <MapPin size={16} className="text-charcoal/20" />
                        </div>
                        <textarea
                          name="address"
                          required
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-cream/30 border border-dusty-pink/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-gold transition-all duration-300 text-charcoal placeholder-charcoal/30 resize-none"
                          placeholder="Your full delivery address including Pincode"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <div className="pt-4 border-t border-dusty-pink/15">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="w-full bg-charcoal text-cream py-4 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-rose-gold transition-colors duration-500 shadow-lg shadow-charcoal/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Confirm Order
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </AnimatedSection>
          </div>

          {/* Checkout Summary Area */}
          <div className="lg:col-span-1">
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-dusty-pink/10 sticky top-28">
                <h3 className="font-heading text-xl text-charcoal mb-4 border-b border-dusty-pink/15 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 min-w-[4rem] rounded-lg overflow-hidden bg-cream relative border border-charcoal/5">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Sparkles size={14} className="text-rose-gold/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-charcoal truncate">{item.name}</h4>
                        <p className="text-xs text-charcoal/40">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-charcoal mt-1">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm border-t border-dusty-pink/15 pt-4">
                  <div className="flex justify-between text-charcoal/50">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/50">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t border-charcoal/10 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-charcoal text-base">
                      <span>Total to Pay</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
