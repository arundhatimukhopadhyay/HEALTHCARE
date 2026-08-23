import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import {
  HeartPulse,
  Lock,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";

import LandingPage from "./pages/LandingPage";
import OfflineSync from "./modules/OfflineSync";
import AuthPage from "./pages/AuthPage";
import PatientPortal from "./pages/PatientPortal";
import WorkerDashboard from "./pages/WorkerDashboard";
import GoogleTranslate from "./modules/GoogleTranslate";


/* ==============================
   NAVBAR
================================= */

function Navbar({ user, onLogout }) {
  return (
    <header className="
      sticky top-0 z-50
      border-b border-white/40
      bg-white/80
      backdrop-blur-xl
      shadow-[0_4px_30px_rgba(0,0,0,0.06)]
    ">
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          h-[78px]
          flex items-center justify-between
          gap-4
        "
      >

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div
            className="
              relative
              w-11 h-11
              rounded-2xl
              bg-gradient-to-br
              from-cyan-500
              via-sky-500
              to-teal-500
              flex items-center justify-center
              shadow-lg
              shadow-cyan-500/25
              transition-all duration-300
              group-hover:scale-110
              group-hover:rotate-3
            "
          >
            <HeartPulse
              className="
                w-6 h-6
                text-white
                transition-transform duration-300
                group-hover:scale-110
              "
            />

            {/* Glow */}
            <div
              className="
                absolute inset-0
                rounded-2xl
                bg-cyan-400/30
                blur-xl
                -z-10
                opacity-0
                group-hover:opacity-100
                transition-opacity duration-300
              "
            />
          </div>

          <div>
            <h1
              className="
                text-lg sm:text-xl
                font-extrabold
                tracking-tight
                text-slate-900
              "
            >
              Gramin
              <span className="text-cyan-600">
                Health
              </span>
            </h1>

            <p
              className="
                hidden sm:block
                text-[11px]
                text-slate-500
                tracking-wide
              "
            >
              Healthcare for Every Community
            </p>
          </div>
        </Link>


        {/* ================= RIGHT SECTION ================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Offline + Language */}

          <div className="hidden lg:flex items-center gap-3">
            <div
              className="
                px-2 py-1
                rounded-lg
                hover:bg-cyan-50
                transition
              "
            >
              <OfflineSync />
            </div>

            <div
              className="
                px-2 py-1
                rounded-lg
                hover:bg-cyan-50
                transition
              "
            >
              <GoogleTranslate />
            </div>
          </div>


          {/* ================= LOGIN ================= */}

          {!user ? (
            <Link
              to="/auth"
              className="
                group
                relative
                overflow-hidden

                flex items-center gap-2

                px-5 py-2.5
                rounded-xl

                bg-gradient-to-r
                from-cyan-600
                to-teal-500

                text-white
                text-sm
                font-semibold

                shadow-lg
                shadow-cyan-500/25

                transition-all duration-300

                hover:-translate-y-1
                hover:shadow-xl
                hover:shadow-cyan-500/30

                active:scale-95
              "
            >
              {/* Hover shine */}
              <span
                className="
                  absolute
                  inset-0
                  translate-x-[-100%]
                  bg-gradient-to-r
                  from-transparent
                  via-white/30
                  to-transparent
                  group-hover:translate-x-[100%]
                  transition-transform
                  duration-700
                "
              />

              <Lock className="relative w-4 h-4" />

              <span className="relative hidden sm:inline">
                Portal Login
              </span>

              <span className="relative sm:hidden">
                Login
              </span>
            </Link>
          ) : (

            /* ================= USER PROFILE ================= */

            <div className="flex items-center gap-2 sm:gap-3">

              <div
                className="
                  flex items-center gap-2
                  sm:gap-3

                  bg-white/80
                  backdrop-blur-md

                  border
                  border-slate-200

                  px-2.5
                  sm:px-3
                  py-2

                  rounded-2xl

                  shadow-sm

                  hover:shadow-md
                  hover:border-cyan-200

                  transition-all duration-300
                "
              >

                {/* Avatar */}

                <div
                  className="
                    w-9 h-9
                    rounded-xl

                    bg-gradient-to-br
                    from-cyan-100
                    to-teal-100

                    flex items-center justify-center

                    border
                    border-cyan-200
                  "
                >
                  <User className="w-4 h-4 text-cyan-700" />
                </div>


                {/* User Info */}

                <div className="hidden md:block leading-tight">

                  <p className="text-[10px] text-slate-400">
                    Signed in as
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    {user.name}
                  </p>

                </div>

              </div>


              {/* LOGOUT */}

              <button
                onClick={onLogout}
                title="Logout"
                className="
                  group

                  w-10 h-10

                  rounded-xl

                  flex items-center justify-center

                  text-slate-500

                  border border-transparent

                  transition-all duration-300

                  hover:bg-red-50
                  hover:text-red-600
                  hover:border-red-100

                  hover:-translate-y-0.5

                  active:scale-90
                "
              >
                <LogOut
                  className="
                    w-5 h-5
                    transition-transform duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}


/* ==============================
   APP
================================= */

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>

      <div
        className="
          relative
          min-h-screen
          overflow-hidden

          bg-gradient-to-br
          from-slate-50
          via-cyan-50/40
          to-teal-50/30

          text-slate-900
        "
      >

        {/* ================= BACKGROUND DECORATIONS ================= */}

        <div
          className="
            pointer-events-none

            absolute
            top-20
            left-[-120px]

            w-[300px]
            h-[300px]

            rounded-full

            bg-cyan-300/20

            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none

            absolute
            top-[400px]
            right-[-120px]

            w-[350px]
            h-[350px]

            rounded-full

            bg-teal-300/20

            blur-3xl
          "
        />

        {/* ================= NAVBAR ================= */}

        <Navbar
          user={user}
          onLogout={() => setUser(null)}
        />


        {/* ================= MAIN CONTENT ================= */}

        <main
          className="
            relative
            z-10

            min-h-[calc(100vh-78px)]

            max-w-7xl
            mx-auto

            px-4
            sm:px-6
            lg:px-8

            py-6
            sm:py-8
          "
        >

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
                  onLogin={(userData) =>
                    setUser(userData)
                  }
                />
              }
            />


            {/* PATIENT PORTAL */}

            <Route
              path="/patient"
              element={
                <PatientPortal
                  user={user}
                  onLogout={() =>
                    setUser(null)
                  }
                />
              }
            />


            {/* HEALTH WORKER DASHBOARD */}

            <Route
              path="/worker"
              element={
                <WorkerDashboard
                  user={user}
                  onLogout={() =>
                    setUser(null)
                  }
                />
              }
            />

          </Routes>

        </main>


        {/* ================= BOTTOM TRUST INDICATOR ================= */}

        <div
          className="
            relative z-10

            border-t
            border-white/60

            bg-white/40
            backdrop-blur-md
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto

              px-4
              sm:px-6
              lg:px-8

              py-4

              flex
              flex-col
              sm:flex-row

              items-center
              justify-between

              gap-2
            "
          >

            <div
              className="
                flex
                items-center
                gap-2

                text-xs
                text-slate-500
              "
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />

              <span>
                Secure community healthcare platform
              </span>
            </div>


            <p className="text-xs text-slate-400">
              © 2026 GraminHealth
            </p>

          </div>
        </div>

      </div>

    </BrowserRouter>
  );
}