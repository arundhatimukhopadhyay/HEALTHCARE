import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Lock, Globe2, Activity } from "lucide-react";

import LandingPage from "./pages/LandingPage";
import OfflineSync from "./modules/OfflineSync";
import AuthPage from "./pages/AuthPage";
import PatientPortal from "./pages/PatientPortal";
import WorkerDashboard from "./pages/WorkerDashboard";
import GoogleTranslate from "./modules/GoogleTranslate";

/* =====================================================
   SEAMLESS DARK CLINICAL NAVBAR
===================================================== */
function Navbar({ user, onLogout }) {
  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* =====================================================
            MEDISPHERE BRAND
        ===================================================== */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-transform group-hover:scale-105">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold uppercase tracking-wider font-mono text-white group-hover:text-cyan-400 transition-colors">
              MEDISPHERE{" "}
              <span className="text-[10px] font-normal text-cyan-400 bg-cyan-950 px-1.5 py-0.5 border border-cyan-800 rounded">
                v1.0
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-tight">
              Smart • Connected • Rural Healthcare
            </span>
          </div>
        </Link>

        {/* =====================================================
            RIGHT ACTION BAR
        ===================================================== */}
        <div className="flex items-center gap-3">
          {/* OFFLINE SYNC MODULE */}
          <div className="hidden sm:block">
            <OfflineSync />
          </div>

          {/* LANGUAGE TRANSLATOR WIDGET */}
          <div className="flex items-center gap-1.5 border border-slate-800 bg-slate-900 hover:border-slate-700 rounded-xl px-2.5 py-1.5 transition shadow-sm">
            <div className="flex items-center justify-center w-5 h-5 rounded-lg bg-cyan-400/10 text-cyan-400">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <GoogleTranslate />
          </div>

          {/* LOGIN / ACTIVE USER BADGE */}
          {!user ? (
            <Link
              to="/auth"
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono uppercase font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <Lock className="w-3.5 h-3.5" />
              Portal Access
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 border border-slate-800 bg-slate-900 px-3 py-1.5 rounded-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>

              <span className="hidden md:inline text-slate-400">User:</span>
              <strong className="text-white">{user.name}</strong>

              <button
                onClick={onLogout}
                className="ml-2 text-[10px] uppercase text-red-400 hover:text-red-300 transition font-bold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* =====================================================
   MAIN UNIFIED APPLICATION
===================================================== */
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Navbar user={user} onLogout={() => setUser(null)} />

        <main className="w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/auth"
              element={<AuthPage onLogin={(userData) => setUser(userData)} />}
            />
            <Route
              path="/patient"
              element={
                <PatientPortal user={user} onLogout={() => setUser(null)} />
              }
            />
            <Route
              path="/worker"
              element={
                <WorkerDashboard user={user} onLogout={() => setUser(null)} />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
