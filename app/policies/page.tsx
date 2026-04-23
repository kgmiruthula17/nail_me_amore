"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Image as ImageIcon, Ruler } from "lucide-react";

export default function PoliciesPage() {
  const policies = [
    {
      icon: <ShieldAlert className="w-6 h-6 text-rose-gold" />,
      title: "No Returns or Refunds",
      desc: "Due to the custom and hygienic nature of press-on nails, we strictly enforce a no exchange, return, or refund policy. All sales are final.",
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-dusty-pink" />,
      title: "Color Variations",
      desc: "While we strive for color accuracy in our product photography, there might be a slight change in colors due to screen settings, lighting, and other factors outside our control.",
    },
    {
      icon: <Ruler className="w-6 h-6 text-charcoal/70" />,
      title: "Measurement Responsibility",
      desc: "Providing correct measurements is entirely the responsibility of the customer. We are not responsible for nails that do not fit due to incorrect measurements provided.",
    },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <AnimatedSection className="text-center mb-16" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Important Information
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            Store Policies
          </h1>
          <p className="text-charcoal/60 text-sm max-w-lg mx-auto">
            Please review our store policies carefully before making a purchase. By placing an order, you agree to these terms.
          </p>
        </AnimatedSection>

        {/* Policies Grid */}
        <div className="space-y-6">
          {policies.map((policy, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-dusty-pink/10 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0 border border-dusty-pink/20">
                  {policy.icon}
                </div>
                <div>
                  <h3 className="font-heading text-xl text-charcoal mb-2">
                    {index + 1}. {policy.title}
                  </h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    {policy.desc}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Contact Note */}
        <AnimatedSection delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-sm text-charcoal/60">
              Have questions about styling or sizing?{" "}
              <Link href="/contact" className="text-rose-gold hover:underline underline-offset-4">
                Contact us
              </Link>{" "}
              before placing your order.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
