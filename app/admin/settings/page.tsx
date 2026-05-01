"use client";

import { useState } from "react";
import { Lock, Check, AlertCircle } from "lucide-react";
import AnimatedSection from "../../components/AnimatedSection";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Client-side validation
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password." });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedSection>
      <div className="max-w-xl mx-auto">
        <h1 className="font-heading text-3xl text-charcoal mb-8">Settings</h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-dusty-pink/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-rose-gold/10 rounded-full flex justify-center items-center">
              <Lock className="text-rose-gold" size={18} />
            </div>
            <div>
              <h2 className="font-heading text-lg text-charcoal">Change Password</h2>
              <p className="text-xs text-charcoal/50">Update your admin password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-cream border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-gold transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-cream border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-gold transition-colors"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-cream border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-gold transition-colors"
                required
                minLength={8}
              />
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <Check size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream py-3 rounded-xl text-sm font-medium hover:bg-rose-gold transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </AnimatedSection>
  );
}
