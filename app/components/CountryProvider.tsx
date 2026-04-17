"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type Country,
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  getCountry,
  convertPrice as convertPriceFn,
  formatPrice as formatPriceFn,
  displayPrice as displayPriceFn,
  getShipping as getShippingFn,
  getDiscount as getDiscountFn,
  getUpsellMessage as getUpsellMessageFn,
  type DiscountTier,
} from "../lib/currencyConfig";

interface CountryContextType {
  country: Country;
  setCountryCode: (code: string) => void;
  countries: Country[];
  isIndia: boolean;
  /** Convert INR amount to selected currency (numeric) */
  convertPrice: (amountINR: number) => number;
  /** Format a converted amount with currency symbol */
  formatPrice: (amount: number) => string;
  /** Convert from INR and format — one-step convenience */
  displayPrice: (amountINR: number) => string;
  /** Get shipping for current country */
  getShipping: (subtotalINR: number) => { amount: number; free: boolean };
  /** Get applicable discount tier */
  getDiscount: (totalQty: number) => DiscountTier | null;
  /** Get upsell message for next discount tier */
  getUpsellMessage: (totalQty: number) => string | null;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const STORAGE_KEY = "nail-me-amore-country";

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<string>(DEFAULT_COUNTRY_CODE);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && COUNTRIES.some((c) => c.code === stored)) {
        setCountryCodeState(stored);
      }
    } catch {
      // localStorage not available
    }
    setHydrated(true);
  }, []);

  const setCountryCode = useCallback((code: string) => {
    setCountryCodeState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // localStorage not available
    }
  }, []);

  const country = getCountry(countryCode);
  const isIndia = country.code === "IN";

  const convertPrice = useCallback(
    (amountINR: number) => convertPriceFn(amountINR, country),
    [country]
  );

  const formatPriceCtx = useCallback(
    (amount: number) => formatPriceFn(amount, country),
    [country]
  );

  const displayPrice = useCallback(
    (amountINR: number) => displayPriceFn(amountINR, country),
    [country]
  );

  const getShipping = useCallback(
    (subtotalINR: number) => getShippingFn(country, subtotalINR),
    [country]
  );

  const getDiscount = useCallback(
    (totalQty: number) => getDiscountFn(totalQty),
    []
  );

  const getUpsellMessage = useCallback(
    (totalQty: number) => getUpsellMessageFn(totalQty),
    []
  );

  // Prevent hydration mismatch — render children only after client-side hydration
  if (!hydrated) {
    return (
      <CountryContext.Provider
        value={{
          country: getCountry(DEFAULT_COUNTRY_CODE),
          setCountryCode,
          countries: COUNTRIES,
          isIndia: true,
          convertPrice: (a) => a,
          formatPrice: (a) => `₹${a.toFixed(2)}`,
          displayPrice: (a) => `₹${a.toFixed(2)}`,
          getShipping: () => ({ amount: 90, free: false }),
          getDiscount,
          getUpsellMessage,
        }}
      >
        {children}
      </CountryContext.Provider>
    );
  }

  return (
    <CountryContext.Provider
      value={{
        country,
        setCountryCode,
        countries: COUNTRIES,
        isIndia,
        convertPrice,
        formatPrice: formatPriceCtx,
        displayPrice,
        getShipping,
        getDiscount,
        getUpsellMessage,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
