"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How to measure press-on nails?",
      answer: (
        <span>
          You can find out all the information and detailed instructions on how to measure your nails perfectly on our dedicated guide page:{" "}
          <Link href="/size-guide" className="text-rose-gold hover:underline font-medium">
            View Size & Shape Guide
          </Link>.
        </span>
      ),
    },
    {
      question: "How to apply & remove press-on nails?",
      answer: (
        <span>
          You can find out all the step-by-step information for safe application and removal at:{" "}
          <Link href="/usage-guide" className="text-rose-gold hover:underline font-medium">
            View Usage Guide
          </Link>.
        </span>
      ),
    },
    {
      question: "Are press-on nails reusable?",
      answer: "Yes, you can reuse press-on nails with proper care. To reuse press-on nails, opt for jelly glue sticker initially. Remove gently, clean, and store in a cool, dry place. Reapply with fresh sticker when needed.",
    },
    {
      question: "What is Included in the parcel?",
      answer: (
        <span className="block space-y-2">
          Our press-on nails usually come with a kit that includes:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>A set of 10 press-on nails in your chosen design</li>
            <li>1 wooden cuticle stick</li>
            <li>1 sheet of adhesive tabs</li>
            <li>1 nail glue (optional, upon request)</li>
          </ul>
        </span>
      ),
    },
    {
      question: "Processing information",
      answer: "Orders will be ready to ship or deliver within 2-4 business weeks.",
    },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <AnimatedSection className="text-center mb-16" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Have Questions?
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-charcoal/60 text-sm max-w-lg mx-auto">
            Find answers to common questions about our press-on nails, application, shipping, and more.
          </p>
        </AnimatedSection>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div 
                className={`bg-white rounded-2xl border transition-colors duration-300 overflow-hidden ${
                  openIndex === index ? "border-rose-gold/30 shadow-md" : "border-dusty-pink/10 shadow-sm hover:border-dusty-pink/30"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-heading text-lg text-charcoal pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-charcoal/40 transition-transform duration-300 shrink-0 ${
                      openIndex === index ? "rotate-180 text-rose-gold" : ""
                    }`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-charcoal/70 text-sm leading-relaxed border-t border-dusty-pink/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Contact Note */}
        <AnimatedSection delay={0.6}>
          <div className="mt-12 text-center p-8 bg-rose-gold/5 rounded-3xl border border-rose-gold/10">
            <h3 className="font-heading text-xl text-charcoal mb-2">Still need help?</h3>
            <p className="text-sm text-charcoal/60 mb-6">
              If you couldn't find the answer to your question, our support team is happy to help.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-charcoal text-white text-sm tracking-wide uppercase font-medium hover:bg-rose-gold transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
