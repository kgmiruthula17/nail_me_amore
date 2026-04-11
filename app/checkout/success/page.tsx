"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../../components/AnimatedSection";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-md w-full px-6 text-center">
        <AnimatedSection>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <CheckCircle className="w-12 h-12 text-green-500 relative z-10" />
          </motion.div>

          <h1 className="font-heading text-4xl text-charcoal mb-4">
            Order Confirmed!
          </h1>
          <p className="text-charcoal/60 mb-8">
            Thank you for shopping with Nail Me Amore. Your beautifully crafted
            press-on nails will be on their way soon. We will contact you
            shortly with updates.
          </p>

          <Link href="/shop" className="inline-block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-charcoal text-cream px-8 py-4 rounded-full text-sm tracking-widest uppercase font-medium inline-flex items-center justify-center gap-2 hover:bg-rose-gold transition-colors duration-500 shadow-lg shadow-charcoal/10"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </motion.button>
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
