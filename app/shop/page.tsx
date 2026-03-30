"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../components/CartProvider";
import ProductCard from "../components/ProductCard";
import AnimatedSection from "../components/AnimatedSection";
import { SlidersHorizontal, X } from "lucide-react";

const categories = [
  { value: "all", label: "All" },
  { value: "classic", label: "Classic" },
  { value: "french", label: "French" },
  { value: "glam", label: "Glam" },
  { value: "bold", label: "Bold" },
  { value: "art", label: "Art" },
];

const styles = [
  { value: "all", label: "All Lengths" },
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "under500", label: "Under ₹500" },
  { value: "500to700", label: "₹500 - ₹700" },
  { value: "above700", label: "Above ₹700" },
];

export default function ShopPage() {
  const { products, loading } = useProducts();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        categoryFilter === "all" || product.category === categoryFilter;
      const styleMatch =
        styleFilter === "all" || product.style === styleFilter;
      let priceMatch = true;
      if (priceFilter === "under500") priceMatch = product.price < 500;
      else if (priceFilter === "500to700")
        priceMatch = product.price >= 500 && product.price <= 700;
      else if (priceFilter === "above700") priceMatch = product.price > 700;
      return categoryMatch && styleMatch && priceMatch;
    });
  }, [products, categoryFilter, styleFilter, priceFilter]);

  const hasFilters =
    categoryFilter !== "all" || styleFilter !== "all" || priceFilter !== "all";

  const clearFilters = () => {
    setCategoryFilter("all");
    setStyleFilter("all");
    setPriceFilter("all");
  };

  const FilterPill = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 cursor-pointer ${
        active
          ? "bg-charcoal text-cream shadow-md"
          : "bg-white text-charcoal/50 hover:text-charcoal border border-charcoal/10 hover:border-charcoal/20"
      }`}
    >
      {label}
    </motion.button>
  );

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-[10px] tracking-[0.25em] uppercase text-charcoal/35 font-medium mb-3">
          Category
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <FilterPill
              key={cat.value}
              label={cat.label}
              active={categoryFilter === cat.value}
              onClick={() => setCategoryFilter(cat.value)}
            />
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div>
        <h4 className="text-[10px] tracking-[0.25em] uppercase text-charcoal/35 font-medium mb-3">
          Length
        </h4>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <FilterPill
              key={style.value}
              label={style.label}
              active={styleFilter === style.value}
              onClick={() => setStyleFilter(style.value)}
            />
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="text-[10px] tracking-[0.25em] uppercase text-charcoal/35 font-medium mb-3">
          Price
        </h4>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <FilterPill
              key={range.value}
              label={range.label}
              active={priceFilter === range.value}
              onClick={() => setPriceFilter(range.value)}
            />
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-rose-gold hover:text-charcoal transition-colors duration-300 flex items-center gap-1 cursor-pointer"
        >
          <X size={12} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-12" blur>
          <span className="text-[11px] tracking-[0.3em] uppercase text-rose-gold font-medium">
            Our Collection
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mt-3 mb-4">
            Shop All Designs
          </h1>
          <p className="text-charcoal/40 text-sm max-w-md mx-auto">
            Explore our complete collection of luxury press-on nails.
            Find your perfect set.
          </p>
        </AnimatedSection>

        {/* Mobile filter toggle */}
        <div className="md:hidden mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-sm text-charcoal/60 border border-charcoal/15 rounded-full px-5 py-2.5 cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasFilters && (
              <span className="bg-rose-gold text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </motion.button>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden mb-8"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-dusty-pink/10">
                <FiltersContent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Filters */}
        <AnimatedSection className="hidden md:block mb-10" delay={0.2}>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-dusty-pink/10">
            <FiltersContent />
          </div>
        </AnimatedSection>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-charcoal/35 tracking-wider uppercase">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex justify-center items-center"
            >
              <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-rose-gold animate-spin" />
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              key={`${categoryFilter}-${styleFilter}-${priceFilter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="font-heading text-2xl text-charcoal/30 mb-3">
                No products found
              </p>
              <p className="text-sm text-charcoal/30 mb-6">
                Try adjusting your filters
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-rose-gold hover:text-charcoal transition-colors duration-300 border border-rose-gold/30 rounded-full px-6 py-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
