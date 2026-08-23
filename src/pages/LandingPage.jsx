import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckSquare,
  HeartPulse,
  Lock,
  PhoneCall,
  Shield,
  Users,
  WifiOff,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6 font-sans">
      {/* Hero Section */}
      <section className="bg-white border border-zinc-300 p-8 lg:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-100 border border-zinc-300 text-zinc-700 font-mono text-xs uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-700" /> Rural Health
            Infrastructure Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            Medisphere
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed font-normal">
            A decentralized, offline-first digital ecosystem connecting rural
            patients with local Primary Health Centers (PHCs) and ASHA workers.
            Organizes prescription regimens, digital queue tokens, and emergency
            escalations without replacing doctors.
          </p>

          {/* Action Doors */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              to="/auth?role=patient"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase tracking-wider px-6 py-3.5 flex items-center justify-center gap-2 transition"
            >
              <HeartPulse className="w-4 h-4" /> Patient Access Portal
            </Link>
            <Link
              to="/auth?role=worker"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-wider px-6 py-3.5 flex items-center justify-center gap-2 transition"
            >
              <Shield className="w-4 h-4" /> ASHA / Clinical Desk
            </Link>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-300 border border-zinc-300">
        <div className="bg-white p-6 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-zinc-500">
            <WifiOff className="w-4 h-4 text-zinc-700" /> Offline-First Ledger
          </div>
          <h3 className="font-bold text-zinc-900">
            Zero-Connectivity Fallback
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Cached local records allow patients to check dosage intervals and
            queue tokens even in complete signal blackouts.
          </p>
        </div>

        <div className="bg-white p-6 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-zinc-500">
            <Users className="w-4 h-4 text-zinc-700" /> Human Care Network
          </div>
          <h3 className="font-bold text-zinc-900">Empowering ASHA Workers</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Direct coordination channel between community health volunteers and
            village residents. Eliminates long hospital queues.
          </p>
        </div>

        <div className="bg-white p-6 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-zinc-500">
            <Lock className="w-4 h-4 text-zinc-700" /> Clinical Integrity
          </div>
          <h3 className="font-bold text-zinc-900">
            Facilitation, Not Replacement
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Strict regulatory compliance: Provides organizational tracking and
            triage escalation without dispensing unverified AI medical advice.
          </p>
        </div>
      </section>
    </div>
  );
}
