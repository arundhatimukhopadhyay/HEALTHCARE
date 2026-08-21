import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowRight,
  CalendarDays,
  FileText,
  HeartPulse,
  Menu,
  MessageCircle,
  MapPin,
  Pill,
  ShieldCheck,
  Stethoscope,
  Upload,
  Users,
  X,
  LogIn,
  CheckCircle2,
  Phone,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goToLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const scrollTo = (id) => {
    setMenuOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =====================================================
     FEATURES
  ===================================================== */

  const features = [
    {
      icon: CalendarDays,
      title: "Easy Appointments",
      description:
        "Book, view and manage healthcare appointments without unnecessary paperwork.",
      color: "#22d3ee",
      glow: "rgba(34,211,238,0.35)",
    },

    {
      icon: Pill,
      title: "Medication Tracking",
      description:
        "Keep track of prescribed medicines and your daily medication schedule.",
      color: "#2dd4bf",
      glow: "rgba(45,212,191,0.35)",
    },

    {
      icon: FileText,
      title: "Health Records",
      description:
        "Keep prescriptions, reports and important healthcare information organized.",
      color: "#a855f7",
      glow: "rgba(168,85,247,0.35)",
    },

    {
      icon: Users,
      title: "Healthcare Support",
      description:
        "Connect with healthcare workers and access the support available to you.",
      color: "#60a5fa",
      glow: "rgba(96,165,250,0.35)",
    },

    {
      icon: Upload,
      title: "Medical Report Upload",
      description:
        "Upload prescriptions and medical reports so they can be accessed when needed.",
      color: "#38bdf8",
      glow: "rgba(56,189,248,0.35)",
    },

    {
      icon: MapPin,
      title: "Nearby Healthcare",
      description:
        "Find nearby hospitals, clinics and healthcare facilities when required.",
      color: "#34d399",
      glow: "rgba(52,211,153,0.35)",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

          {/* LOGO */}

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3"
          >

            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: "#22d3ee",
                boxShadow:
                  "0 0 20px rgba(34,211,238,0.45)",
              }}
            >
              <Activity
                size={24}
                className="text-slate-950"
              />
            </div>

            <div className="text-left">

              <h1 className="text-lg font-bold">
                HealthConnect
              </h1>

              <p className="hidden text-xs text-slate-400 sm:block">
                Community Healthcare Companion
              </p>

            </div>

          </button>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            {/* PORTAL LOGIN */}

            <button
              onClick={goToLogin}
              className="hidden items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-cyan-400 md:flex"
              style={{
                border: "2px solid #22d3ee",
                boxShadow:
                  "0 0 8px #22d3ee, 0 0 20px rgba(34,211,238,0.45)",
              }}
            >
              <LogIn size={18} />
              Portal Login
            </button>

            {/* MENU */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 transition hover:border-cyan-400"
            >
              {menuOpen ? (
                <X className="text-cyan-400" />
              ) : (
                <Menu />
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            DROPDOWN MENU
        ================================================= */}

        {menuOpen && (

          <div className="absolute right-5 top-20 w-72 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">

            <button
              onClick={() => scrollTo("features")}
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
            >
              Features
            </button>

            <button
              onClick={() => scrollTo("how-it-works")}
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
            >
              How It Works
            </button>

            <button
              onClick={() => scrollTo("support")}
              className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
            >
              Healthcare Support
            </button>

            <div className="my-2 border-t border-slate-700" />

            <button
              onClick={goToLogin}
              className="flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-3 font-semibold text-cyan-400"
              style={{
                border: "2px solid #22d3ee",
                boxShadow:
                  "0 0 8px #22d3ee, 0 0 22px rgba(34,211,238,0.45)",
              }}
            >

              <span className="flex items-center gap-2">
                <LogIn size={18} />
                Portal Login
              </span>

              <ArrowRight size={18} />

            </button>

          </div>

        )}

      </header>

      <main>

        {/* =====================================================
            HERO SECTION
        ===================================================== */}

        <section className="relative overflow-hidden">

          <div
            className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "rgba(34,211,238,0.08)",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-5 py-24 lg:py-32">

            <div className="grid items-center gap-16 lg:grid-cols-2">

              {/* LEFT SIDE */}

              <div>

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">

                  <HeartPulse size={17} />

                  Community Healthcare Companion

                </div>

                <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">

                  Your Health.

                  <br />

                  <span className="text-cyan-400">
                    Better Connected.
                  </span>

                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">

                  A simple digital platform that helps patients
                  manage appointments, prescriptions, medical
                  records, medication schedules and healthcare
                  support.

                </p>

                {/* BUTTONS */}

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                  <button
                    onClick={goToLogin}
                    className="flex items-center justify-center gap-3 rounded-xl bg-slate-950 px-8 py-4 font-bold text-cyan-400"
                    style={{
                      border: "2px solid #22d3ee",
                      boxShadow:
                        "0 0 10px #22d3ee, 0 0 25px rgba(34,211,238,0.55), 0 0 45px rgba(34,211,238,0.25)",
                    }}
                  >

                    <LogIn size={21} />

                    Portal Login

                    <ArrowRight size={20} />

                  </button>

                  <button
                    onClick={() => scrollTo("features")}
                    className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
                  >
                    Explore Features
                  </button>

                </div>

                {/* BENEFITS */}

                <div className="mt-9 flex flex-wrap gap-5 text-sm text-slate-400">

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={17}
                      className="text-emerald-400"
                    />

                    Easy to use

                  </div>

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={17}
                      className="text-emerald-400"
                    />

                    Organized records

                  </div>

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={17}
                      className="text-emerald-400"
                    />

                    Healthcare support

                  </div>

                </div>

              </div>

              {/* RIGHT DASHBOARD */}

              <div className="relative">

                <div
                  className="rounded-3xl bg-slate-900 p-6"
                  style={{
                    border:
                      "1px solid rgba(34,211,238,0.35)",

                    boxShadow:
                      "0 0 20px rgba(34,211,238,0.15), 0 0 60px rgba(34,211,238,0.08)",
                  }}
                >

                  <div className="mb-7 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">

                        <Activity
                          className="text-cyan-400"
                          size={24}
                        />

                      </div>

                      <div>

                        <p className="font-semibold">
                          Health Overview
                        </p>

                        <p className="text-xs text-slate-500">
                          Your healthcare in one place
                        </p>

                      </div>

                    </div>

                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60" />

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <PreviewCard
                      icon={<CalendarDays />}
                      title="Appointments"
                      value="Upcoming"
                    />

                    <PreviewCard
                      icon={<Pill />}
                      title="Medication"
                      value="Daily Schedule"
                    />

                    <PreviewCard
                      icon={<FileText />}
                      title="Health Records"
                      value="Secure Access"
                    />

                    <PreviewCard
                      icon={<Stethoscope />}
                      title="Healthcare"
                      value="Get Support"
                    />

                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">

                    <div className="flex justify-between">

                      <div>

                        <p className="text-sm font-medium">
                          Today's Medication
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Daily medication progress
                        </p>

                      </div>

                      <span className="font-semibold text-cyan-400">
                        2 / 3
                      </span>

                    </div>

                    <div className="mt-4 h-2 rounded-full bg-slate-800">

                      <div className="h-full w-2/3 rounded-full bg-cyan-400" />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FEATURES SECTION
        ===================================================== */}

        <section
          id="features"
          className="border-y border-slate-800 bg-slate-900/30"
        >

          <div className="mx-auto max-w-7xl px-5 py-24">

            <div className="max-w-2xl">

              <p className="font-semibold tracking-widest text-cyan-400">
                FEATURES
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">

                Everything you need

                <br />

                for better healthcare management.

              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">

                Keep the important parts of your healthcare
                journey organized in one accessible platform.

              </p>

            </div>

            {/* FEATURE CARDS */}

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {features.map((feature) => {

                const Icon = feature.icon;

                return (

                  <div
                    key={feature.title}
                    className="group relative min-h-[250px] overflow-hidden rounded-2xl bg-slate-950 p-7 transition-all duration-300 hover:-translate-y-2"
                    style={{
                      border:
                        `2px solid ${feature.color}`,

                      boxShadow: `
                        0 0 8px ${feature.glow},
                        0 0 20px ${feature.glow},
                        0 0 40px rgba(34,211,238,0.08),
                        inset 0 0 18px rgba(34,211,238,0.03)
                      `,
                    }}
                  >

                    {/* CARD LIGHT */}

                    <div
                      className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl"
                      style={{
                        background:
                          feature.glow,
                      }}
                    />

                    <div className="relative">

                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl"
                        style={{
                          background:
                            feature.glow,

                          color:
                            feature.color,
                        }}
                      >

                        <Icon size={27} />

                      </div>

                      <h3 className="mt-7 text-xl font-bold">
                        {feature.title}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-400">
                        {feature.description}
                      </p>

                      <div
                        className="mt-6 flex items-center gap-2 text-sm font-semibold"
                        style={{
                          color:
                            feature.color,
                        }}
                      >

                        Explore

                        <ArrowRight size={16} />

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-5 py-24"
        >

          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold tracking-widest text-cyan-400">
              HOW IT WORKS
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Simple healthcare management.
            </h2>

            <p className="mt-5 text-lg text-slate-400">
              Getting started with HealthConnect is simple.
            </p>

          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            {/* CREATE PROFILE */}

            <div
              className="how-card group relative overflow-hidden rounded-2xl bg-slate-950 p-8"
              style={{
                "--card-color": "#22d3ee",
                "--card-glow":
                  "rgba(34,211,238,0.45)",
              }}
            >

              <div className="how-card-fill" />

              <div className="relative z-10">

                <div className="step-number">
                  01
                </div>

                <div className="step-icon">
                  <Users size={26} />
                </div>

                <h3 className="mt-7 text-2xl font-bold">
                  Create Your Profile
                </h3>

                <p className="mt-4 leading-7 text-slate-400 transition-colors duration-300 group-hover:text-white/90">

                  Create your patient profile and add
                  the information needed for your
                  healthcare journey.

                </p>

                <div className="mt-7 flex items-center gap-2 font-semibold text-cyan-400 transition-colors duration-300 group-hover:text-white">

                  Get Started

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />

                </div>

              </div>

            </div>

            {/* MANAGE HEALTHCARE */}

            <div
              className="how-card group relative overflow-hidden rounded-2xl bg-slate-950 p-8"
              style={{
                "--card-color": "#2dd4bf",
                "--card-glow":
                  "rgba(45,212,191,0.45)",
              }}
            >

              <div className="how-card-fill" />

              <div className="relative z-10">

                <div className="step-number">
                  02
                </div>

                <div className="step-icon">
                  <HeartPulse size={26} />
                </div>

                <h3 className="mt-7 text-2xl font-bold">
                  Manage Your Healthcare
                </h3>

                <p className="mt-4 leading-7 text-slate-400 transition-colors duration-300 group-hover:text-white/90">

                  Manage appointments, prescriptions,
                  reports and medication information
                  from one place.

                </p>

                <div className="mt-7 flex items-center gap-2 font-semibold text-teal-400 transition-colors duration-300 group-hover:text-white">

                  Manage Now

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />

                </div>

              </div>

            </div>

            {/* STAY CONNECTED */}

            <div
              className="how-card group relative overflow-hidden rounded-2xl bg-slate-950 p-8"
              style={{
                "--card-color": "#a855f7",
                "--card-glow":
                  "rgba(168,85,247,0.45)",
              }}
            >

              <div className="how-card-fill" />

              <div className="relative z-10">

                <div className="step-number">
                  03
                </div>

                <div className="step-icon">
                  <MessageCircle size={26} />
                </div>

                <h3 className="mt-7 text-2xl font-bold">
                  Stay Connected
                </h3>

                <p className="mt-4 leading-7 text-slate-400 transition-colors duration-300 group-hover:text-white/90">

                  Stay connected with healthcare workers
                  and access healthcare support whenever
                  you need it.

                </p>

                <div className="mt-7 flex items-center gap-2 font-semibold text-purple-400 transition-colors duration-300 group-hover:text-white">

                  Connect

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            HEALTHCARE SUPPORT
        ===================================================== */}

        <section
          id="support"
          className="mx-auto max-w-7xl px-5 pb-24"
        >

          <div
            className="rounded-3xl bg-slate-900 p-8 md:p-14"
            style={{
              border:
                "1px solid rgba(34,211,238,0.45)",

              boxShadow:
                "0 0 25px rgba(34,211,238,0.12), 0 0 60px rgba(34,211,238,0.06)",
            }}
          >

            <div className="grid items-center gap-12 lg:grid-cols-2">

              <div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400">

                  <MessageCircle
                    size={28}
                    className="text-slate-950"
                  />

                </div>

                <h2 className="mt-7 text-4xl font-bold md:text-5xl">

                  Healthcare support

                  <br />

                  when you need it.

                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-400">

                  Connect with available healthcare services,
                  find nearby facilities and manage your
                  healthcare information from your portal.

                </p>

                <button
                  onClick={goToLogin}
                  className="mt-8 flex items-center gap-3 rounded-xl bg-slate-950 px-7 py-4 font-bold text-cyan-400"
                  style={{
                    border:
                      "2px solid #22d3ee",

                    boxShadow:
                      "0 0 10px #22d3ee, 0 0 25px rgba(34,211,238,0.5)",
                  }}
                >

                  <LogIn size={20} />

                  Access Your Portal

                  <ArrowRight size={20} />

                </button>

              </div>

              <div className="space-y-5">

                <SupportItem
                  icon={<Phone />}
                  title="Healthcare Assistance"
                  description="Connect with available healthcare support."
                />

                <SupportItem
                  icon={<MapPin />}
                  title="Nearby Facilities"
                  description="Find hospitals, clinics and healthcare services."
                />

                <SupportItem
                  icon={<ShieldCheck />}
                  title="Organized Information"
                  description="Keep important healthcare information accessible."
                />

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="border-t border-slate-800 bg-slate-900/40">

          <div className="mx-auto max-w-4xl px-5 py-24 text-center">

            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400"
              style={{
                boxShadow:
                  "0 0 30px rgba(34,211,238,0.4)",
              }}
            >

              <HeartPulse
                size={32}
                className="text-slate-950"
              />

            </div>

            <h2 className="mt-7 text-4xl font-bold md:text-5xl">

              Take better control

              <br />

              of your healthcare.

            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-400">

              Manage appointments, medications,
              prescriptions and health records from one place.

            </p>

            <button
              onClick={goToLogin}
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-slate-950 px-8 py-4 font-bold text-cyan-400"
              style={{
                border:
                  "2px solid #22d3ee",

                boxShadow:
                  "0 0 10px #22d3ee, 0 0 25px rgba(34,211,238,0.55)",
              }}
            >

              <LogIn size={20} />

              Portal Login

              <ArrowRight size={20} />

            </button>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 md:flex-row">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">

              <Activity
                size={21}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h3 className="font-semibold">
                HealthConnect
              </h3>

              <p className="text-xs text-slate-500">
                Community Healthcare Companion
              </p>

            </div>

          </div>

          <p className="text-sm text-slate-500">
            © 2026 HealthConnect. All rights reserved.
          </p>

          <button
            onClick={goToLogin}
            className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-cyan-400"
            style={{
              border:
                "2px solid #22d3ee",

              boxShadow:
                "0 0 8px #22d3ee, 0 0 18px rgba(34,211,238,0.4)",
            }}
          >
            Portal Login
          </button>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   PREVIEW CARD
========================================================= */

function PreviewCard({
  icon,
  title,
  value,
}) {
  return (

    <div
      className="rounded-2xl bg-slate-950 p-4"
      style={{
        border:
          "1px solid rgba(34,211,238,0.2)",
      }}
    >

      <div className="text-cyan-400">

        {React.cloneElement(icon, {
          size: 22,
        })}

      </div>

      <p className="mt-4 text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-cyan-400">
        View details →
      </p>

    </div>
  );
}


/* =========================================================
   SUPPORT ITEM
========================================================= */

function SupportItem({
  icon,
  title,
  description,
}) {
  return (

    <div
      className="flex gap-4 rounded-2xl bg-slate-950 p-5"
      style={{
        border:
          "1px solid rgba(34,211,238,0.25)",

        boxShadow:
          "0 0 15px rgba(34,211,238,0.07)",
      }}
    >

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">

        {React.cloneElement(icon, {
          size: 22,
        })}

      </div>

      <div>

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
}