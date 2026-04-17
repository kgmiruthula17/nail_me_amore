"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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

export default function Footer() {
  return (
    <footer className="bg-soft-gray border-t border-dusty-pink/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl text-charcoal mb-3">
              Nail Me Amore
            </h3>
            <p className="text-charcoal/50 text-sm leading-relaxed max-w-xs">
              Handcrafted luxury press-on nails, designed with love and shipped
              worldwide. Salon-quality nails, ready in minutes.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-start md:items-center">
            <h4 className="text-xs tracking-[0.2em] uppercase text-charcoal/40 mb-4 font-medium">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/cart", label: "Cart" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-charcoal/50 hover:text-rose-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-xs tracking-[0.2em] uppercase text-charcoal/40 mb-4 font-medium">
              Follow Us
            </h4>
            <motion.a
              href="https://www.instagram.com/nail_me_amore/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-charcoal/50 hover:text-rose-gold transition-colors duration-300"
            >
              <InstagramIcon />
              <span className="text-sm">@nail_me_amore</span>
            </motion.a>
            <p className="text-xs text-charcoal/30 mt-6">
              Ajmer, Rajasthan, India · Worldwide Delivery
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-dusty-pink/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal/30">
            © {new Date().getFullYear()} Nail Me Amore. All rights reserved.
          </p>
          <p className="text-xs text-charcoal/25 font-heading italic">
            Made with ♡ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
