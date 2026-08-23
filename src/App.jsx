import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  Lock,
  Globe2,
  Wifi,
  WifiOff,
} from "lucide-react";

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
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(false);

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
              <span className="text-xs font-normal text-zinc-500">
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
              OFFLINE SYNC TOGGLE
          ===================================================== */}
          <div className="flex items-center gap-2 border border-zinc-200 bg-zinc-50 rounded-lg px-2.5 py-1.5 shadow-sm">

            {/* STATUS ICON */}
            {offlineSyncEnabled ? (
              <WifiOff className="w-4 h-4 text-orange-500" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-500" />
            )}

            {/* STATUS TEXT */}
            <span className="text-[10px] font-mono uppercase text-zinc-600">
              {offlineSyncEnabled ? "Offline Sync" : "Online"}
            </span>

            {/* TOGGLE SWITCH */}
            <button
              type="button"
              onClick={() =>
                setOfflineSyncEnabled(!offlineSyncEnabled)
              }
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                offlineSyncEnabled
                  ? "bg-orange-500"
                  : "bg-zinc-300"
              }`}
              aria-label="Toggle Offline Sync"
              aria-pressed={offlineSyncEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  offlineSyncEnabled
                    ? "translate-x-5"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* =====================================================
              OFFLINE SYNC MODULE
              ONLY ACTIVE WHEN TOGGLE IS ENABLED
          ===================================================== */}
          {offlineSyncEnabled && <OfflineSync />}

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

              {/* ACTIVE STATUS */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>

              <span>
                Active Session:{" "}
                <strong className="text-zinc-900">
                  {user.name}
                </strong>
              </span>

              {/* LOGOUT */}
              <button
                onClick={onLogout}
                className="ml-2 text-[10px] uppercase text-red-500 hover:text-red-700 transition"
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

        <Navbar
          user={user}
          onLogout={() => setUser(null)}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">

          <Routes>

            {/* LANDING PAGE */}
            <Route
              path="/"
              element={<LandingPage />}
            />

            {/* AUTH PAGE */}
            <Route
              path="/auth"
              element={
                <AuthPage
                  onLogin={(userData) => setUser(userData)}
                />
              }
            />

            {/* PATIENT PORTAL */}
            <Route
              path="/patient"
              element={
                <PatientPortal
                  user={user}
                  onLogout={() => setUser(null)}
                />
              }
            />

            {/* HEALTHCARE WORKER DASHBOARD */}
            <Route
              path="/worker"
              element={
                <WorkerDashboard
                  user={user}
                  onLogout={() => setUser(null)}
                />
              }
            />

          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}