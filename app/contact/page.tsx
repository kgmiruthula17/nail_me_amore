"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import { Send, MapPin, CheckCircle } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-12" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Get in Touch
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            We&apos;d Love to Hear
            <br />
            <span className="italic text-rose-gold">From You</span>
          </h1>
          <p className="text-charcoal/40 text-sm max-w-md mx-auto">
            Have a question, custom order request, or just want to say hi?
            Drop us a message and we&apos;ll get back to you within 24 hours.
          </p>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-dusty-pink/10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12"
                >
                  <CheckCircle
                    size={48}
                    className="text-green-500 mx-auto mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-heading text-2xl text-charcoal mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-charcoal/40">
                    Thank you for reaching out. We&apos;ll get back to you soon ♡
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[10px] tracking-[0.25em] uppercase text-charcoal/35 font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-5 py-3.5 rounded-xl border border-charcoal/10 focus:border-dusty-pink focus:ring-2 focus:ring-dusty-pink/20 outline-none transition-all duration-300 text-sm text-charcoal placeholder:text-charcoal/20 bg-cream/50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[10px] tracking-[0.25em] uppercase text-charcoal/35 font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="priya@example.com"
                      className="w-full px-5 py-3.5 rounded-xl border border-charcoal/10 focus:border-dusty-pink focus:ring-2 focus:ring-dusty-pink/20 outline-none transition-all duration-300 text-sm text-charcoal placeholder:text-charcoal/20 bg-cream/50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[10px] tracking-[0.25em] uppercase text-charcoal/35 font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us what you need..."
                      className="w-full px-5 py-3.5 rounded-xl border border-charcoal/10 focus:border-dusty-pink focus:ring-2 focus:ring-dusty-pink/20 outline-none transition-all duration-300 text-sm text-charcoal placeholder:text-charcoal/20 resize-none bg-cream/50"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-charcoal text-cream py-4 rounded-full text-sm tracking-widest uppercase font-medium flex items-center justify-center gap-2 hover:bg-rose-gold transition-colors duration-500 cursor-pointer shadow-lg shadow-charcoal/10"
                  >
                    <Send size={14} />
                    Send Message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>

        {/* Contact Info */}
        <AnimatedSection delay={0.4}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
            <motion.a
              href="https://instagram.com/nailmeamore"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-charcoal/40 hover:text-rose-gold transition-colors duration-300"
            >
              <InstagramIcon size={16} />
              <span className="text-sm">@nailmeamore</span>
            </motion.a>

            <div className="flex items-center gap-2 text-charcoal/40">
              <MapPin size={16} strokeWidth={1.5} />
              <span className="text-sm">Ajmer, Rajasthan, India</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
