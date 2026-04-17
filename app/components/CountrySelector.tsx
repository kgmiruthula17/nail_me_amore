"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import { useCountry } from "./CountryProvider";

const REGIONS: { label: string; codes: string[] }[] = [
  { label: "South Asia", codes: ["IN", "LK", "NP", "BD", "PK"] },
  { label: "Middle East", codes: ["AE", "SA", "QA", "KW", "BH", "OM"] },
  { label: "Americas", codes: ["US", "CA", "MX", "BR"] },
  { label: "Europe", codes: ["GB", "EU", "CH", "SE"] },
  { label: "Asia Pacific", codes: ["AU", "NZ", "SG", "MY", "TH", "JP", "KR", "PH", "ID"] },
  { label: "Africa", codes: ["ZA", "NG", "KE"] },
];

export default function CountrySelector() {
  const { country, setCountryCode, countries } = useCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide text-charcoal/70 hover:text-charcoal border border-charcoal/10 hover:border-charcoal/20 transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm"
        aria-label="Select country"
        id="country-selector-toggle"
      >
        <span className="text-sm leading-none">{country.flag}</span>
        <span className="hidden sm:inline">{country.currency}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-full mt-2 w-72 max-h-[70vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl shadow-charcoal/10 border border-dusty-pink/15 z-50 custom-scrollbar"
            id="country-selector-dropdown"
          >
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <Globe size={14} className="text-rose-gold" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 font-medium">
                  Select Region
                </span>
              </div>

              {REGIONS.map((region) => {
                const regionCountries = region.codes
                  .map((code) => countries.find((c) => c.code === code))
                  .filter(Boolean);

                if (regionCountries.length === 0) return null;

                return (
                  <div key={region.label} className="mb-2">
                    <div className="px-3 py-1.5">
                      <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal/30 font-medium">
                        {region.label}
                      </span>
                    </div>
                    {regionCountries.map((c) => {
                      if (!c) return null;
                      const isActive = c.code === country.code;
                      return (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCountryCode(c.code);
                            setOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-dusty-pink/10 text-charcoal"
                              : "text-charcoal/60 hover:bg-cream hover:text-charcoal"
                          }`}
                        >
                          <span className="text-base leading-none">{c.flag}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium truncate block">
                              {c.name}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-semibold tracking-wider ${
                              isActive ? "text-rose-gold" : "text-charcoal/30"
                            }`}
                          >
                            {c.symbol} {c.currency}
                          </span>
                          {isActive && (
                            <motion.div
                              layoutId="country-active"
                              className="w-1.5 h-1.5 rounded-full bg-rose-gold"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Compact version for use in mobile menus
 */
export function CountrySelectorMobile() {
  const { country, setCountryCode, countries } = useCountry();

  return (
    <div className="space-y-2">
      <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 font-medium flex items-center gap-2">
        <Globe size={12} />
        Region & Currency
      </span>
      <select
        value={country.code}
        onChange={(e) => setCountryCode(e.target.value)}
        className="w-full bg-white/50 border border-dusty-pink/20 rounded-xl px-4 py-2.5 text-sm text-charcoal outline-none focus:ring-1 focus:ring-rose-gold transition-all appearance-none cursor-pointer"
        id="country-selector-mobile"
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name} ({c.symbol} {c.currency})
          </option>
        ))}
      </select>
    </div>
  );
}
