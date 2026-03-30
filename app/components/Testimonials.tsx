"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Absolutely stunning nails! The quality is incredible — they look exactly like a salon manicure. I've been getting so many compliments!",
  },
  {
    name: "Ananya Gupta",
    location: "Delhi",
    rating: 5,
    text: "Best press-on nails I've ever tried. The fit is perfect, and they lasted me a full 10 days without any lifting. Will definitely reorder!",
  },
  {
    name: "Meera Patel",
    location: "Bangalore",
    rating: 5,
    text: "I was skeptical about press-ons, but these changed my mind completely. The designs are so elegant, and the packaging is beautiful.",
  },
  {
    name: "Riya Jain",
    location: "Jaipur",
    rating: 4,
    text: "Love the champagne gold set! Perfect for my engagement photos. The customer service team was super helpful with sizing too.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rating
              ? "fill-rose-gold text-rose-gold"
              : "fill-none text-charcoal/15"
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Love Letters
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            What Our Girls Say
          </h2>
          <p className="text-charcoal/40 text-sm max-w-md mx-auto">
            Real reviews from real customers who love their Nail Me Amore experience.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={testimonial.name}
              delay={index * 0.1}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:shadow-dusty-pink/10 transition-all duration-500 border border-dusty-pink/10"
              >
                <StarRating rating={testimonial.rating} />
                <p className="text-charcoal/60 text-sm leading-relaxed mt-4 mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      background: `linear-gradient(135deg, #E8B4B8, #B76E79)`,
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-charcoal/35">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
