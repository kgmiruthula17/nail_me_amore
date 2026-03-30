"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Package, LayoutDashboard, LogOut } from "lucide-react";
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
    // Very simple auth check using localStorage
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else if (pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  if (loading) return null;

  // Don't show admin nav on login page
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-cream pt-28">{children}</div>;
  }

  if (!isAuthenticated) return null;

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
              <Link href="/admin">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/admin"
                      ? "bg-rose-gold/10 text-rose-gold"
                      : "text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal"
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              </Link>
              
              <Link href="/admin/products">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/admin/products"
                      ? "bg-rose-gold/10 text-rose-gold"
                      : "text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal"
                  }`}
                >
                  <Package size={16} />
                  Products
                </button>
              </Link>
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
