"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, ChevronDown, ChevronUp, Clock, Package } from "lucide-react";
import AnimatedSection from "../../components/AnimatedSection";

interface CartItemData {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  shape: string;
  size: string;
  quantity: number;
}

interface CartData {
  id: string;
  visitorId: string;
  itemCount: number;
  totalValue: number;
  lastActive: string;
  createdAt: string;
  items: CartItemData[];
}

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<CartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedCart, setExpandedCart] = useState<string | null>(null);

  useEffect(() => {
    fetchCarts();
  }, [filter]);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/carts?filter=${filter}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCarts(data);
      }
    } catch (err) {
      console.error("Failed to fetch carts:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatedSection>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Visitor Carts</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Track abandoned and active shopping carts
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { value: "24h", label: "Last 24h" },
            { value: "7d", label: "Last 7 days" },
            { value: "all", label: "All time" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-rose-gold/10 text-rose-gold"
                  : "bg-white text-charcoal/60 hover:bg-charcoal/5 border border-charcoal/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-charcoal/40">Loading...</div>
      ) : carts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 shadow-sm border border-dusty-pink/10 text-center">
          <ShoppingCart className="mx-auto text-charcoal/20 mb-4" size={48} />
          <p className="text-charcoal/40 text-lg">No visitor carts found</p>
          <p className="text-charcoal/30 text-sm mt-1">
            Carts will appear here when visitors add items to their cart
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Summary bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-dusty-pink/10 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-charcoal/50">Total Carts:</span>{" "}
              <span className="font-semibold text-charcoal">{carts.length}</span>
            </div>
            <div>
              <span className="text-charcoal/50">Total Items:</span>{" "}
              <span className="font-semibold text-charcoal">
                {carts.reduce((s, c) => s + c.itemCount, 0)}
              </span>
            </div>
            <div>
              <span className="text-charcoal/50">Total Value:</span>{" "}
              <span className="font-semibold text-rose-gold">
                ₹{carts.reduce((s, c) => s + c.totalValue, 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Cart list */}
          {carts.map((cart) => (
            <div
              key={cart.id}
              className="bg-white rounded-xl shadow-sm border border-dusty-pink/10 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedCart(expandedCart === cart.id ? null : cart.id)
                }
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-cream/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-gold/10 rounded-full flex justify-center items-center">
                    <ShoppingCart className="text-rose-gold" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-charcoal">
                      {cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""} ·{" "}
                      <span className="text-rose-gold">
                        ₹{cart.totalValue.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-xs text-charcoal/40 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      Last active: {formatTime(cart.lastActive)}
                    </p>
                  </div>
                </div>
                {expandedCart === cart.id ? (
                  <ChevronUp size={18} className="text-charcoal/40" />
                ) : (
                  <ChevronDown size={18} className="text-charcoal/40" />
                )}
              </button>

              {expandedCart === cart.id && (
                <div className="border-t border-charcoal/5 px-5 py-4">
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-cream/50 rounded-lg"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-charcoal/5 rounded-lg flex justify-center items-center">
                            <Package size={16} className="text-charcoal/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-charcoal/50">
                            {item.shape} · {item.size} · Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-charcoal whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-charcoal/30 mt-3">
                    Visitor ID: {cart.visitorId.slice(0, 8)}...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AnimatedSection>
  );
}
