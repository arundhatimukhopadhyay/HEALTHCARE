import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Activity, Lock } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import OfflineSync from "./modules/OfflineSync";
import AuthPage from "./pages/AuthPage";
import PatientPortal from "./pages/PatientPortal";
import WorkerDashboard from "./pages/WorkerDashboard";
import GoogleTranslate from "./modules/GoogleTranslate";

function Navbar({ user, onLogout }) {
  return (
    <header className="bg-white border-b border-zinc-300 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap justify-between items-center gap-4">
        {/* Brand Title */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-zinc-900 text-white p-1.5">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-900">
              Medisphere{" "}
              <span className="text-xs font-normal text-zinc-500 font-mono">
                [v1.0-RC]
              </span>
            </h1>
            <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-tight">
              Community Health Information Architecture
            </span>
          </div>
        </Link>

        {/* Right Action Bar */}
        <div className="flex items-center gap-4">
          <OfflineSync />
          <GoogleTranslate />

          {!user ? (
            <Link
              to="/auth"
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono uppercase px-3 py-1.5 flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5" /> Portal Login
            </Link>
          ) : (
            <span className="text-xs font-mono text-zinc-500 border border-zinc-300 bg-zinc-50 px-2.5 py-1">
              Active Session:{" "}
              <strong className="text-zinc-900">{user.name}</strong>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

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
