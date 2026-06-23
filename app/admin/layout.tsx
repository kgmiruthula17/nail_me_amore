"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Package, LayoutDashboard, LogOut, Tags, Ruler, Settings, ShoppingCart, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth check on the login page
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    // Only check auth once on mount — not on every pathname change
    fetch("/api/auth", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // Ignore errors
    }
    setIsAuthenticated(false);
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) return null;

  // Don't show admin nav on login page
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-cream pt-28">{children}</div>;
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/styles", label: "Lengths", icon: Ruler },
    { href: "/admin/carts", label: "Carts", icon: ShoppingCart },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-soft-gray pt-28">
      <div className="max-w-7xl mx-auto px-6 pb-20">
        
        {/* Admin Navigation */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-dusty-pink/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <h2 className="font-heading text-xl text-charcoal md:px-4 border-b md:border-b-0 md:border-r border-charcoal/10 pb-3 md:pb-0 w-full md:w-auto text-center md:text-left">
              Store Admin
            </h2>
            
            <nav className="flex flex-wrap justify-center items-center gap-2">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-rose-gold/10 text-rose-gold"
                          : "text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer w-full md:w-auto"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Page Content */}
        {children}

      </div>
    </div>
  );
}
