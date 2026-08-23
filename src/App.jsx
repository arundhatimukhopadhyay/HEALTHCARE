import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Lock, Globe2, Wifi, WifiOff } from "lucide-react";

import LandingPage from "./pages/LandingPage";
import OfflineSync from "./modules/OfflineSync";
import AuthPage from "./pages/AuthPage";
import PatientPortal from "./pages/PatientPortal";
import WorkerDashboard from "./pages/WorkerDashboard";
import GoogleTranslate from "./modules/GoogleTranslate";

/* =====================================================
   NAVBAR
===================================================== */
function Navbar({ user, onLogout }) {
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);

  return (
    <header className="bg-white border-b border-zinc-300 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap justify-between items-center gap-4">
        {/* =====================================================
            MEDISPHERE BRAND
        ===================================================== */}
        <Link to="/" className="group">
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-900 group-hover:text-emerald-600 transition-colors">
              MEDISPHERE{" "}
              <span className="text-xs font-normal text-zinc-500 font-mono">
                [v1.0]
              </span>
            </h1>

            <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-tight">
              Smart • Connected • Accessible Healthcare
            </span>
          </div>
        </Link>

        {/* =====================================================
            RIGHT ACTION BAR
        ===================================================== */}
        <div className="flex items-center gap-3">
          {/* =====================================================
              OFFLINE SYNC MODULE
          ===================================================== */}
          <OfflineSync />

          {/* =====================================================
              LANGUAGE TRANSLATOR
          ===================================================== */}
          <div className="flex items-center gap-1.5 border border-zinc-200 bg-zinc-50 hover:bg-white rounded-lg px-2 py-1 transition shadow-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-sm">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <GoogleTranslate />
          </div>

          {/* =====================================================
              LOGIN / ACTIVE SESSION
          ===================================================== */}
          {!user ? (
            <Link
              to="/auth"
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono uppercase px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all hover:shadow-md"
            >
              <Lock className="w-3.5 h-3.5" />
              Portal Login
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 border border-zinc-300 bg-zinc-50 px-3 py-2 rounded-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>

              <span>
                Active Session:{" "}
                <strong className="text-zinc-900">{user.name}</strong>
              </span>

              <button
                onClick={onLogout}
                className="ml-2 text-[10px] uppercase text-red-500 hover:text-red-700 transition font-bold"
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
   MAIN APPLICATION
===================================================== */
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans">
        <Navbar user={user} onLogout={() => setUser(null)} />

        <main className="max-w-7xl mx-auto px-4 py-6">
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
