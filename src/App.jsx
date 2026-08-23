import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Lock, Globe2, Activity, Sun, Moon } from "lucide-react";

import LandingPage from "./pages/LandingPage";
import OfflineSync from "./modules/OfflineSync";
import AuthPage from "./pages/AuthPage";
import PatientPortal from "./pages/PatientPortal";
import WorkerDashboard from "./pages/WorkerDashboard";
import GoogleTranslate from "./modules/GoogleTranslate";

function Navbar({ user, onLogout, theme, toggleTheme }) {
  const isDark = theme === "dark";

  return (
    <header
      className={`${
        isDark
          ? "bg-slate-950/95 border-slate-800 text-white"
          : "bg-white border-zinc-200 text-zinc-900"
      } backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-200 shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap justify-between items-center gap-4">
        {/* MEDISPHERE BRAND */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-transform group-hover:scale-105">
            <Activity size={22} />
          </div>
          <div>
            <h1
              className={`text-base font-bold uppercase tracking-wider font-mono ${isDark ? "text-white" : "text-zinc-900"} group-hover:text-cyan-400 transition-colors`}
            >
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

        {/* RIGHT ACTION BAR */}
        <div className="flex items-center gap-3">
          {/* OFFLINE SYNC */}
          <OfflineSync />

          {/* ☀️ / 🌙 THEME TOGGLE BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition ${
              isDark
                ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800"
                : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* LANGUAGE TRANSLATOR */}
          <div
            className={`flex items-center gap-1.5 border rounded-xl px-2.5 py-1.5 transition ${
              isDark
                ? "border-slate-800 bg-slate-900 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-900"
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <GoogleTranslate />
          </div>

          {/* LOGIN / USER SESSION */}
          {!user ? (
            <Link
              to="/auth"
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono uppercase font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <Lock className="w-3.5 h-3.5" />
              Portal Access
            </Link>
          ) : (
            <div
              className={`flex items-center gap-2 text-xs font-mono border px-3 py-1.5 rounded-xl ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-300"
                  : "border-zinc-200 bg-zinc-100 text-zinc-700"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <strong className={isDark ? "text-white" : "text-zinc-900"}>
                {user.name}
              </strong>
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

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("app_theme") || "dark",
  );

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("app_theme", nextTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen font-sans transition-colors duration-200 ${
          theme === "dark"
            ? "bg-slate-950 text-slate-100"
            : "bg-zinc-50 text-zinc-900"
        }`}
      >
        <Navbar
          user={user}
          onLogout={() => setUser(null)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="w-full">
          <Routes>
            <Route path="/" element={<LandingPage theme={theme} />} />
            <Route
              path="/auth"
              element={
                <AuthPage
                  onLogin={(userData) => setUser(userData)}
                  theme={theme}
                />
              }
            />
            <Route
              path="/patient"
              element={
                <PatientPortal
                  user={user}
                  onLogout={() => setUser(null)}
                  theme={theme}
                />
              }
            />
            <Route
              path="/worker"
              element={
                <WorkerDashboard
                  user={user}
                  onLogout={() => setUser(null)}
                  theme={theme}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
