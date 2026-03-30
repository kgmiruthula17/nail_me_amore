"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import AnimatedSection from "../../components/AnimatedSection";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminAuth", "true");
        router.push("/admin");
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[60vh]">
      <AnimatedSection className="w-full max-w-md">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-dusty-pink/10 text-center">
          <div className="w-16 h-16 bg-rose-gold/10 rounded-full flex justify-center items-center mx-auto mb-6">
            <Lock className="text-rose-gold" size={24} />
          </div>
          
          <h1 className="font-heading text-3xl text-charcoal mb-2">Admin Portal</h1>
          <p className="text-sm text-charcoal/50 mb-8">
            Please enter your password to access the dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Password (hint: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-gold transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-left pl-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream py-3 rounded-xl text-sm font-medium hover:bg-rose-gold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </AnimatedSection>
    </div>
  );
}
