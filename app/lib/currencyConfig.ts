// ─── Country & Currency Configuration ────────────────────────────────────────
// All product prices are stored in INR in the database.
// Conversion happens on the client side using the rates below.
// Update rates periodically to keep them accurate.

export interface Country {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  flag: string;
  rate: number; // 1 INR = X foreign currency
}

export const COUNTRIES: Country[] = [
  // South Asia
  { code: "IN", name: "India", currency: "INR", symbol: "₹", flag: "🇮🇳", rate: 1 },
  { code: "LK", name: "Sri Lanka", currency: "LKR", symbol: "Rs", flag: "🇱🇰", rate: 3.55 },
  { code: "NP", name: "Nepal", currency: "NPR", symbol: "रू", flag: "🇳🇵", rate: 1.6 },
  { code: "BD", name: "Bangladesh", currency: "BDT", symbol: "৳", flag: "🇧🇩", rate: 1.31 },
  { code: "PK", name: "Pakistan", currency: "PKR", symbol: "₨", flag: "🇵🇰", rate: 3.32 },

  // Middle East
  { code: "AE", name: "UAE", currency: "AED", symbol: "د.إ", flag: "🇦🇪", rate: 0.044 },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", symbol: "﷼", flag: "🇸🇦", rate: 0.045 },
  { code: "QA", name: "Qatar", currency: "QAR", symbol: "﷼", flag: "🇶🇦", rate: 0.043 },
  { code: "KW", name: "Kuwait", currency: "KWD", symbol: "د.ك", flag: "🇰🇼", rate: 0.0037 },
  { code: "BH", name: "Bahrain", currency: "BHD", symbol: "BD", flag: "🇧🇭", rate: 0.0045 },
  { code: "OM", name: "Oman", currency: "OMR", symbol: "OMR", flag: "🇴🇲", rate: 0.0046 },

  // Americas
  { code: "US", name: "United States", currency: "USD", symbol: "$", flag: "🇺🇸", rate: 0.012 },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "C$", flag: "🇨🇦", rate: 0.016 },
  { code: "MX", name: "Mexico", currency: "MXN", symbol: "MX$", flag: "🇲🇽", rate: 0.20 },
  { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$", flag: "🇧🇷", rate: 0.069 },

  // Europe
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", flag: "🇬🇧", rate: 0.0095 },
  { code: "EU", name: "Europe (EUR)", currency: "EUR", symbol: "€", flag: "🇪🇺", rate: 0.011 },
  { code: "CH", name: "Switzerland", currency: "CHF", symbol: "CHF", flag: "🇨🇭", rate: 0.011 },
  { code: "SE", name: "Sweden", currency: "SEK", symbol: "kr", flag: "🇸🇪", rate: 0.12 },

  // Asia Pacific
  { code: "AU", name: "Australia", currency: "AUD", symbol: "A$", flag: "🇦🇺", rate: 0.018 },
  { code: "NZ", name: "New Zealand", currency: "NZD", symbol: "NZ$", flag: "🇳🇿", rate: 0.020 },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$", flag: "🇸🇬", rate: 0.016 },
  { code: "MY", name: "Malaysia", currency: "MYR", symbol: "RM", flag: "🇲🇾", rate: 0.053 },
  { code: "TH", name: "Thailand", currency: "THB", symbol: "฿", flag: "🇹🇭", rate: 0.41 },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥", flag: "🇯🇵", rate: 1.74 },
  { code: "KR", name: "South Korea", currency: "KRW", symbol: "₩", flag: "🇰🇷", rate: 16.5 },
  { code: "PH", name: "Philippines", currency: "PHP", symbol: "₱", flag: "🇵🇭", rate: 0.67 },
  { code: "ID", name: "Indonesia", currency: "IDR", symbol: "Rp", flag: "🇮🇩", rate: 190 },

  // Africa
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R", flag: "🇿🇦", rate: 0.22 },
  { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦", flag: "🇳🇬", rate: 18.5 },
  { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh", flag: "🇰🇪", rate: 1.55 },
];

export const DEFAULT_COUNTRY_CODE = "IN";

// ─── Shipping ────────────────────────────────────────────────────────────────
// Stored in INR. International = $20 USD equivalent ≈ ₹1,680
export const SHIPPING_INR = {
  india: 90,
  international: 1680,
};

// Free shipping deleted.

// ─── Discount Tiers ──────────────────────────────────────────────────────────
// Ordered from highest to lowest so we can match the best tier first
export interface DiscountTier {
  minQty: number;
  percent: number;
  label: string;
}

export const DISCOUNT_TIERS: DiscountTier[] = [
  { minQty: 3, percent: 20, label: "20% off on 3+ sets" },
  { minQty: 2, percent: 10, label: "10% off on 2 sets" },
];

// ─── Custom Order Base Price (in INR) ────────────────────────────────────────
export const CUSTOM_ORDER_BASE_INR = 3750; // ≈ $45 USD

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Find a country by its code. Falls back to India.
 */
export function getCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}

/**
 * Convert an INR amount to the target country's currency.
 */
export function convertPrice(amountINR: number, country: Country): number {
  return amountINR * country.rate;
}

/**
 * Format a converted price with the correct currency symbol.
 * Uses 2 decimal places for most currencies, 0 for JPY/KRW/IDR/NGN.
 */
export function formatPrice(amount: number, country: Country): string {
  const noDecimalCurrencies = ["JPY", "KRW", "IDR", "NGN"];
  const decimals = noDecimalCurrencies.includes(country.currency) ? 0 : 2;
  const formatted = amount.toFixed(decimals);

  // Add thousand separators
  const parts = formatted.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${country.symbol}${parts.join(".")}`;
}

/**
 * Convenience: convert from INR and format in one step.
 */
export function displayPrice(amountINR: number, country: Country): string {
  return formatPrice(convertPrice(amountINR, country), country);
}

/**
 * Get the shipping cost in the target currency.
 */
export function getShipping(country: Country, subtotalINR: number): { amount: number; free: boolean } {
  const isIndia = country.code === "IN";

  if (isIndia) {
    return {
      amount: convertPrice(SHIPPING_INR.india, country),
      free: false,
    };
  }

  return {
    amount: convertPrice(SHIPPING_INR.international, country),
    free: false,
  };
}

/**
 * Get the best applicable discount for a given total quantity.
 */
export function getDiscount(totalQuantity: number): DiscountTier | null {
  for (const tier of DISCOUNT_TIERS) {
    if (totalQuantity >= tier.minQty) {
      return tier;
    }
  }
  return null;
}

/**
 * Get a motivational upsell message for the next discount tier.
 */
export function getUpsellMessage(totalQuantity: number): string | null {
  if (totalQuantity >= 3) return null; // Already at max discount
  if (totalQuantity === 2) return "Add 1 more set to unlock 20% off!";
  if (totalQuantity === 1) return "Add 1 more set to get 10% off!";
  return null;
}
