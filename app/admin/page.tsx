"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "../components/AnimatedSection";
import { IndianRupee, ShoppingCart, TrendingUp, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        setStats(data.error ? null : data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        setStats(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-rose-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatedSection className="mb-8">
        <h1 className="font-heading text-3xl text-charcoal mb-2">
          Store Overview
        </h1>
        <p className="text-charcoal/50 text-sm">
          Welcome back. Here's what's happening today.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedSection delay={0.1}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-dusty-pink/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-charcoal/60">Total Income</h3>
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <IndianRupee size={20} />
              </div>
            </div>
            <p className="font-heading text-3xl text-charcoal">₹{stats?.totalIncome.toLocaleString()}</p>
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> +12% from last month
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-dusty-pink/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-charcoal/60">Total Buys</h3>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
            </div>
            <p className="font-heading text-3xl text-charcoal">{stats?.totalBuys}</p>
            <p className="text-xs text-blue-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> +8% from last month
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-dusty-pink/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-charcoal/60">Active Sessions</h3>
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
            <p className="font-heading text-3xl text-charcoal">{stats?.activeSessions}</p>
            <p className="text-xs text-charcoal/40 font-medium mt-2">Currently online</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-dusty-pink/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-charcoal/60">Conversion Rate</h3>
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="font-heading text-3xl text-charcoal">{stats?.conversionRate}</p>
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> +1.2% from last week
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* Recent Orders Table */}
      <AnimatedSection delay={0.5}>
        <div className="bg-white rounded-2xl shadow-sm border border-dusty-pink/10 mt-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-charcoal/10">
            <h3 className="font-heading text-xl text-charcoal">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/50 text-xs uppercase tracking-wider text-charcoal/50">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {stats?.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-charcoal">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-charcoal">{order.product}</td>
                    <td className="px-6 py-4 text-sm text-charcoal/60">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-charcoal">₹{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                          'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
