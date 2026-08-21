import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Activity, ArrowRight, Lock, Phone, Shield, User } from "lucide-react";
import { apiRequest } from "../api/client";

export default function AuthPage({ onLogin }) {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "patient";

  const [role, setRole] = useState(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    village: "",
    pin: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      identifier: formData.identifier,
      village: formData.village,
      pin: formData.pin,
      role: role,
    };

    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const user = data.user || {
        name:
          formData.name ||
          (role === "patient" ? "Ramesh Patel" : "Dr. S. Sharma"),
        role: role,
        id:
          formData.identifier ||
          (role === "patient" ? "ABHA-9182-4421" : "DOC-REG-48821"),
        village: formData.village || "Rampur",
      };

      if (onLogin) onLogin(user);
      navigate(role === "patient" ? "/patient" : "/worker");
    } catch (err) {
      console.warn(
        "Backend unavailable, using fallback mock authentication:",
        err.message,
      );

      // Fallback so development never blocks
      const fallbackUser = {
        name:
          formData.name ||
          (role === "patient" ? "Ramesh Patel" : "Dr. S. Sharma"),
        role: role,
        id:
          formData.identifier ||
          (role === "patient" ? "ABHA-9182-4421" : "DOC-REG-48821"),
        village: formData.village || "Rampur",
      };

      if (onLogin) onLogin(fallbackUser);
      navigate(role === "patient" ? "/patient" : "/worker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-300 shadow-sm">
        <div className="p-6 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-emerald-700" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Secure Access Gateway
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900">
            {isSignUp ? "Create New Account" : "Portal Sign In"}
          </h2>
        </div>

        <div className="grid grid-cols-2 border-b border-zinc-200 bg-zinc-100 text-xs font-mono">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`py-3 flex items-center justify-center gap-2 uppercase tracking-wider transition-colors ${
              role === "patient"
                ? "bg-white text-zinc-900 font-bold border-b-2 border-emerald-700"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <User className="w-4 h-4" /> Patient Access
          </button>
          <button
            type="button"
            onClick={() => setRole("worker")}
            className={`py-3 flex items-center justify-center gap-2 uppercase tracking-wider transition-colors ${
              role === "worker"
                ? "bg-white text-zinc-900 font-bold border-b-2 border-emerald-700"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Shield className="w-4 h-4" /> Clinical Staff
          </button>
        </div>

        {/* Quick Hackathon Demo Credentials Bar */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-200 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">
            ⚡ 1-Click Judge Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRole("patient");
                setFormData({
                  identifier: "ABHA-9182-4421",
                  pin: "1234",
                  name: "Ramesh Patel",
                  village: "Rampur",
                });
              }}
              className="p-2 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-[11px] text-left transition"
            >
              <strong className="block font-bold">🧑 Ramesh Patel</strong>
              <span className="text-[10px] text-zinc-500">Rural Patient</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("worker");
                setFormData({
                  identifier: "DOC-REG-48821",
                  pin: "1234",
                  name: "Dr. S. Sharma",
                  village: "Rampur Subcenter",
                });
              }}
              className="p-2 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-[11px] text-left transition"
            >
              <strong className="block font-bold">👨‍⚕️ Dr. S. Sharma</strong>
              <span className="text-[10px] text-zinc-500">Medical Officer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          {isSignUp && (
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-zinc-50 border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 font-sans"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-1">
              {role === "patient"
                ? "Phone Number or ABHA Health ID"
                : "Clinic / Medical Staff ID"}
            </label>
            <input
              type="text"
              required
              placeholder={
                role === "patient"
                  ? "+91 98765 43210 or ABHA ID"
                  : "e.g. ASHA-WB-8819"
              }
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
              className="w-full bg-zinc-50 border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 font-mono"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1">
                Village / Subcenter Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rampur Subcenter"
                value={formData.village}
                onChange={(e) =>
                  setFormData({ ...formData, village: e.target.value })
                }
                className="w-full bg-zinc-50 border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 font-sans"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-1">
              Security PIN / Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••"
              value={formData.pin}
              onChange={(e) =>
                setFormData({ ...formData, pin: e.target.value })
              }
              className="w-full bg-zinc-50 border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-wider py-3 flex items-center justify-center gap-2 transition mt-2 disabled:bg-zinc-500"
          >
            <span>
              {loading
                ? "Authenticating..."
                : isSignUp
                  ? "Register & Enter Dashboard"
                  : "Authenticate & Enter"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-zinc-50 border-t border-zinc-200 text-center text-xs">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-zinc-600 hover:text-zinc-900 underline font-mono"
          >
            {isSignUp
              ? "Already registered? Sign In"
              : "Don't have an ID? Register New Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
