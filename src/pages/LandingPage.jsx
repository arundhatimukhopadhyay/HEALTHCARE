import { useState } from "react";
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
  Settings,
  Sun,
  Moon,
} from "lucide-react";

export default function HealthLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goToLogin = () => {
    setMenuOpen(false);
    // hook up to your routing/auth flow
    console.log("Navigate to portal login");
  };

  const navItemClass = `w-full rounded-xl px-4 py-3 text-left transition ${
    darkMode
      ? "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
      : "text-slate-700 hover:bg-slate-100 hover:text-cyan-600"
  }`;

  const features = [
    {
      icon: Stethoscope,
      title: "Virtual Consultations",
      desc: "Connect with licensed clinicians over secure video, any day of the week.",
    },
    {
      icon: Pill,
      title: "Prescription Tracking",
      desc: "Refill reminders and pharmacy sync so you never miss a dose.",
    },
    {
      icon: FileText,
      title: "Records in One Place",
      desc: "Upload and organize lab results, imaging, and visit summaries.",
    },
    {
      icon: HeartPulse,
      title: "Vitals Monitoring",
      desc: "Sync wearables to track heart rate, sleep, and activity trends.",
    },
  ];

  const steps = [
    {
      icon: Upload,
      title: "Create your profile",
      desc: "Add your health history and current medications in minutes.",
    },
    {
      icon: CalendarDays,
      title: "Book a visit",
      desc: "Pick a time that works and match with the right specialist.",
    },
    {
      icon: Activity,
      title: "Get your care plan",
      desc: "Receive follow-ups, prescriptions, and next steps in the app.",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 flex items-center justify-between border-b px-5 py-4 backdrop-blur ${
          darkMode
            ? "border-slate-800 bg-slate-950/80"
            : "border-slate-200 bg-slate-50/80"
        }`}
      >
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="text-cyan-400" size={24} />
          <span>CarePath</span>
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className={`rounded-xl p-2 transition ${
            darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
          }`}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Dropdown menu — Features, How It Works, Healthcare Support, Theme, Portal Login */}
        {menuOpen && (
          <div
            className={`absolute right-5 top-20 w-72 rounded-2xl p-3 shadow-2xl ${
              darkMode
                ? "border border-slate-700 bg-slate-900"
                : "border border-slate-200 bg-white"
            }`}
          >
            <button
              onClick={() => scrollTo("features")}
              className={navItemClass}
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className={navItemClass}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("support")}
              className={navItemClass}
            >
              Healthcare Support
            </button>

            <div className="px-4 py-3">
              <span
                className={`flex items-center gap-3 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                <Settings size={18} />
                Theme
              </span>
              <div
                className={`mt-3 flex items-center gap-1 rounded-xl p-1 ${
                  darkMode ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                    !darkMode
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sun size={16} />
                  Light
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                    darkMode
                      ? "bg-slate-950 text-cyan-400 shadow"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Moon size={16} />
                  Dark
                </button>
              </div>
            </div>

            <div
              className={`my-2 border-t ${darkMode ? "border-slate-700" : "border-slate-200"}`}
            />

            <button
              onClick={goToLogin}
              className="flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-3 font-semibold text-cyan-400"
              style={{
                border: "2px solid #22d3ee",
                boxShadow: "0 0 8px #22d3ee, 0 0 22px rgba(34,211,238,0.45)",
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

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Your care team,{" "}
          <span className="text-cyan-400">always within reach</span>
        </h1>
        <p
          className={`mx-auto mt-4 max-w-2xl text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}
        >
          Book visits, manage prescriptions, and keep every record in one secure
          place — built around how people actually manage their health.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={goToLogin}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
          >
            Get Started
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className={`rounded-xl px-6 py-3 font-semibold ${
              darkMode ? "border border-slate-700" : "border border-slate-300"
            }`}
          >
            See How It Works
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold">
          Everything care, in one app
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className={`rounded-2xl p-6 ${
                darkMode
                  ? "border border-slate-800 bg-slate-900"
                  : "border border-slate-200 bg-white"
              }`}
            >
              <Icon className="text-cyan-400" size={28} />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p
                className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="text-center">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                  darkMode ? "bg-slate-900" : "bg-white border border-slate-200"
                }`}
              >
                <Icon className="text-cyan-400" size={24} />
              </div>
              <h3 className="mt-4 font-semibold">
                {i + 1}. {title}
              </h3>
              <p
                className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section id="support" className="mx-auto max-w-5xl px-5 py-16">
        <div
          className={`flex flex-col items-center gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left ${
            darkMode
              ? "border border-slate-800 bg-slate-900"
              : "border border-slate-200 bg-white"
          }`}
        >
          <Users className="shrink-0 text-cyan-400" size={40} />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              Healthcare Support, day or night
            </h3>
            <p
              className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Our care coordinators are available around the clock for questions
              about appointments, billing, or your care plan.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
              <MessageCircle size={18} />
              Chat with us
            </button>
            <button
              className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold ${
                darkMode ? "border border-slate-700" : "border border-slate-300"
              }`}
            >
              <Phone size={18} />
              Call
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t px-5 py-8 text-center text-sm ${
          darkMode
            ? "border-slate-800 text-slate-500"
            : "border-slate-200 text-slate-500"
        }`}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <span className="flex items-center gap-2">
            <MapPin size={14} /> Available across all 50 states
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} /> HIPAA-compliant &amp; secure
          </span>
        </div>
      </footer>
    </div>
  );
}
