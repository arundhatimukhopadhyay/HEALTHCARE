import React, { useState } from "react";
import {
  Activity,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("patient"); // 'patient' or 'worker'
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const navigate = useNavigate();

  // Password strength logic (0 to 4)
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  // Quick Demo Autofill Handler
  const handleQuickDemo = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "patient") {
      setEmail("patient.alex@healthcare.io");
      setPassword("Patient@2026");
      setFullName("Alex Morgan");
    } else {
      setEmail("dr.rajesh@healthcare.io");
      setPassword("Staff@2026");
      setFullName("Dr. Rajesh Kumar");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Dynamic Animated Grid & Glowing Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      {/* Floating Ambient Glowing Light Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Main Glassmorphism Form Card */}
      <div className="w-full max-w-lg bg-slate-900/80 border-2 border-cyan-500/70 ring-4 ring-cyan-500/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl relative z-10">
        
        {/* Top Floating Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Health ID Access v2.4</span>
          </div>

          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> System Live
          </span>
        </div>

        {/* Brand Icon Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500" />
            <div className="relative p-3.5 bg-slate-950 border-2 border-cyan-400 rounded-2xl text-cyan-300">
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
            {isSignUp ? "Create Access Pass" : "Portal Access"}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs font-medium">
            {isSignUp
              ? "Register a verified biometric medical identification profile."
              : "Authenticate your credentials to open your dashboard."}
          </p>
        </div>

        {/* Interactive Role Switcher */}
        <div className="relative bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-1.5 mb-6 flex items-center">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              role === "patient"
                ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Patient Portal
          </button>
          <button
            type="button"
            onClick={() => setRole("worker")}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              role === "worker"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Healthcare Staff
          </button>
        </div>

        {/* Input Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border-2 border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Verified Email / Health ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="name@healthcare.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border-2 border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                Security Password
              </label>
              {!isSignUp && (
                <a href="#forgot" className="text-[10px] font-bold text-cyan-400 hover:underline">
                  Forgot Password?
                </a>
              )}
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border-2 border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Dynamic Password Strength Indicator Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5 w-full">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        strength >= step
                          ? strength === 1
                            ? "bg-rose-500 shadow-sm shadow-rose-500"
                            : strength === 2
                            ? "bg-amber-400 shadow-sm shadow-amber-400"
                            : strength === 3
                            ? "bg-teal-400 shadow-sm shadow-teal-400"
                            : "bg-cyan-400 shadow-md shadow-cyan-400 animate-pulse"
                          : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-right font-mono font-bold text-slate-400">
                  {strength === 1 && <span className="text-rose-400">Weak Security</span>}
                  {strength === 2 && <span className="text-amber-400">Moderate Security</span>}
                  {strength === 3 && <span className="text-teal-400">Strong Encryption</span>}
                  {strength === 4 && <span className="text-cyan-400">Cyber-Grade Protection</span>}
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Demo Fill Controls */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Demo Test:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("patient")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg transition"
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("worker")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-lg transition"
              >
                Staff
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={() => navigate(role === "patient" ? "/patient" : "/worker")}
            className="w-full mt-2 group relative overflow-hidden rounded-xl p-[2px] focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-600 rounded-xl" />
            <div className="relative w-full bg-slate-950 group-hover:bg-transparent transition duration-300 py-3 rounded-[10px] flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider text-cyan-300 group-hover:text-slate-950">
              <span>{isSignUp ? "Register Account" : "Access Portal"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center justify-center gap-1.5 mx-auto"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isSignUp
              ? "Already hold a verified Health ID? Sign In"
              : "Need a new account? Create Health ID"}
          </button>
        </div>
      </div>
    </div>
  );
}