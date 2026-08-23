import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  Lock,
  Shield,
  Users,
  WifiOff,
  Video,
  Mic,
} from "lucide-react";

export default function LandingPage({ theme }) {
  const isDark = theme !== "light";

  return (
    <div
      className={`space-y-16 py-8 font-sans transition-colors duration-200 max-w-7xl mx-auto px-4 sm:px-6 ${
        isDark ? "text-white" : "text-zinc-900"
      }`}
    >
      {/* Hero Section */}
      <section
        className={`rounded-3xl border p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden ${
          isDark
            ? "border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "border-zinc-200 bg-white"
        }`}
      >
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs uppercase tracking-wider rounded-xl">
            <Activity size={16} /> Rural Health Infrastructure Platform
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Your care team,{" "}
            <span className="text-cyan-400">always within reach.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            A decentralized, offline-first digital ecosystem connecting rural
            patients in Odisha with local Primary Health Centers (PHCs) and ASHA
            workers. Organizes prescription regimens, clinic queue tokens, and
            emergency escalations without replacing doctors.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <Link
              to="/auth?role=patient"
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs uppercase font-bold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              <HeartPulse size={18} /> Patient Portal Access
            </Link>
            <Link
              to="/auth?role=worker"
              className={`font-mono text-xs uppercase font-bold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 border transition ${
                isDark
                  ? "border-slate-700 bg-slate-900 hover:bg-slate-800 text-white"
                  : "border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
              }`}
            >
              <Shield size={18} /> ASHA / Clinical Desk
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-3xl border transition hover:-translate-y-1 shadow-lg ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-cyan-400 font-bold mb-2">
            <WifiOff size={18} /> Zero-Connectivity Fallback
          </div>
          <h3 className="font-bold text-lg">Offline-First Ledger</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-mono">
            Cached local records allow patients to check dosage intervals and
            queue tokens even in complete signal blackouts.
          </p>
        </div>

        <div
          className={`p-6 rounded-3xl border transition hover:-translate-y-1 shadow-lg ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-teal-400 font-bold mb-2">
            <Mic size={18} /> Vernacular Accessibility
          </div>
          <h3 className="font-bold text-lg">Voice Triage & Audio</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-mono">
            Non-literate patients describe symptoms in Hindi/English, and the
            app reads their daily prescription schedule out loud.
          </p>
        </div>

        <div
          className={`p-6 rounded-3xl border transition hover:-translate-y-1 shadow-lg ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-violet-400 font-bold mb-2">
            <Video size={18} /> Encrypted P2P Telehealth
          </div>
          <h3 className="font-bold text-lg">Doctor Video Consult</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-mono">
            Direct WebRTC face-to-face video consultation connecting patients in
            remote villages to PHC Medical Officers.
          </p>
        </div>
      </section>
    </div>
  );
}
