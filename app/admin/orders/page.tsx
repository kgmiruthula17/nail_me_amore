"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "../../components/AnimatedSection";
import {
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Truck,
  ShoppingBag,
  Filter,
} from "lucide-react";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: any }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  PROCESSING: { bg: "bg-blue-50", text: "text-blue-700", icon: Package },
  SHIPPED: { bg: "bg-indigo-50", text: "text-indigo-700", icon: Truck },
  DELIVERED: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", icon: XCircle },
};

const PAYMENT_CONFIG: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700" },
  PAID: { bg: "bg-green-50", text: "text-green-700" },
  FAILED: { bg: "bg-red-50", text: "text-red-700" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    // Optimistic update — change UI immediately
    const previousOrders = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      // Revert on failure
      console.error("Failed to update order status:", err);
      setOrders(previousOrders);
      alert("Failed to update order status. Please try again.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <AnimatedSection className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal mb-1">
            Order Management
          </h1>
          <p className="text-charcoal/50 text-sm">
            View customer orders, track details, and update fulfillment status.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal/40">
          <ShoppingBag size={16} />
          <span>{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection delay={0.05}>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-dusty-pink/10 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={16} className="text-charcoal/30" />
            </div>
            <input
              type="text"
              placeholder="Search by order #, name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cream/30 border border-dusty-pink/20 rounded-xl text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-1 focus:ring-rose-gold transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-charcoal/40" />
            <div className="flex flex-wrap gap-1.5">
              {["ALL", ...STATUS_OPTIONS].map((status) => {
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                      isActive
                        ? "bg-charcoal text-white"
                        : "bg-cream/50 text-charcoal/50 hover:bg-charcoal/5 hover:text-charcoal"
                    }`}
                  >
                    {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Orders List */}
      <AnimatedSection delay={0.1}>
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-dusty-pink/10 py-20 flex justify-center items-center">
              <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-rose-gold animate-spin" />
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const paymentConf = PAYMENT_CONFIG[order.paymentStatus] || PAYMENT_CONFIG.PENDING;
              const StatusIcon = statusConf.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-dusty-pink/10 overflow-hidden transition-shadow hover:shadow-md"
                >
                  {/* Order Header — clickable to expand */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left cursor-pointer hover:bg-cream/20 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-full ${statusConf.bg} ${statusConf.text} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading text-base text-charcoal font-semibold">
                            {order.orderNumber || order.id.slice(0, 12) + "..."}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${statusConf.bg} ${statusConf.text}`}>
                            {order.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${paymentConf.bg} ${paymentConf.text}`}>
                            <CreditCard size={10} className="mr-1" />
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/40 mt-0.5">
                          {order.customerName} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="font-heading text-lg text-charcoal font-semibold">
                        ₹{order.total?.toLocaleString()}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-charcoal/30" />
                      ) : (
                        <ChevronDown size={18} className="text-charcoal/30" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-dusty-pink/10 px-5 py-5 bg-cream/10 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Details */}
                        <div className="space-y-4">
                          <h4 className="text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                            Customer Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-rose-gold/10 text-rose-gold flex items-center justify-center flex-shrink-0">
                                <User size={14} />
                              </div>
                              <div>
                                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Name</p>
                                <p className="text-sm text-charcoal font-medium">{order.customerName}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <Phone size={14} />
                              </div>
                              <div>
                                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Phone</p>
                                <p className="text-sm text-charcoal font-medium">{order.phone}</p>
                              </div>
                            </div>

                            {order.email && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                  <Mail size={14} />
                                </div>
                                <div>
                                  <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Email</p>
                                  <p className="text-sm text-charcoal font-medium">{order.email}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin size={14} />
                              </div>
                              <div>
                                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Delivery Address</p>
                                <p className="text-sm text-charcoal font-medium whitespace-pre-line">{order.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                          <h4 className="text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                            Items Ordered ({order.items?.length || 0})
                          </h4>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {order.items?.map((item: any) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between bg-white p-3 rounded-xl border border-dusty-pink/10"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-charcoal font-medium truncate">{item.name}</p>
                                  <div className="flex gap-2 mt-0.5 flex-wrap">
                                    <span className="text-[10px] text-charcoal/40">Qty: {item.quantity}</span>
                                    {item.shape && (
                                      <span className="text-[10px] text-charcoal/40">· {item.shape}</span>
                                    )}
                                    {item.size && (
                                      <span className="text-[10px] text-charcoal/40">· Size {item.size}</span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-charcoal ml-3">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Payment Info */}
                          {order.razorpayPaymentId && (
                            <div className="text-[10px] text-charcoal/30 pt-2 border-t border-dusty-pink/10">
                              <p>Payment ID: {order.razorpayPaymentId}</p>
                              <p>Razorpay Order: {order.razorpayOrderId}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="mt-6 pt-5 border-t border-dusty-pink/15">
                        <h4 className="text-xs uppercase tracking-widest text-charcoal/40 font-medium mb-3">
                          Update Status
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => {
                            const conf = STATUS_CONFIG[s];
                            const isCurrent = order.status === s;
                            const Icon = conf.icon;

                            return (
                              <button
                                key={s}
                                disabled={isCurrent || updatingId === order.id}
                                onClick={() => handleStatusUpdate(order.id, s)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer disabled:cursor-not-allowed ${
                                  isCurrent
                                    ? `${conf.bg} ${conf.text} ring-2 ring-offset-1 ring-current`
                                    : `bg-cream/50 text-charcoal/40 hover:${conf.bg} hover:${conf.text}`
                                }`}
                              >
                                {updatingId === order.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Icon size={12} />
                                )}
                                {s.charAt(0) + s.slice(1).toLowerCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-dusty-pink/10 text-center py-20">
              <p className="font-heading text-xl text-charcoal/40 mb-2">No orders found</p>
              <p className="text-sm text-charcoal/30">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your filters."
                  : "Orders will appear here once customers place them."}
              </p>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
