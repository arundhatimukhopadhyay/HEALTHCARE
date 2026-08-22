import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Ambulance,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Hash,
  HeartPulse,
  History,
  Home,
  Hospital,
  LogOut,
  MapPin,
  Menu,
  Mic,
  Pause,
  Pill,
  Play,
  RotateCcw,
  ShieldAlert,
  Stethoscope,
  Trophy,
  Upload,
  User,
  Users,
  Volume2,
  X,
} from "lucide-react";

export default function PatientPortal() {
  const navigate = useNavigate();

  // =========================================================
  // PATIENT DETAILS
  // =========================================================

  const patientName = localStorage.getItem("patientName") || "Patient";
  const tokenNumber = localStorage.getItem("tokenNumber") || "A-042";

  // =========================================================
  // STATES
  // =========================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [morningTaken, setMorningTaken] = useState(false);
  const [afternoonTaken, setAfternoonTaken] = useState(false);
  const [eveningTaken, setEveningTaken] = useState(false);

  const [showCelebration, setShowCelebration] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [triageStarted, setTriageStarted] = useState(false);

  const [audioPlaying, setAudioPlaying] = useState(false);

  // =========================================================
  // MEDICATION PROGRESS
  // =========================================================

  const completedDoses =
    Number(morningTaken) +
    Number(afternoonTaken) +
    Number(eveningTaken);

  const medicationProgress = (completedDoses / 3) * 100;

  // =========================================================
  // MEDICATION CELEBRATION
  // =========================================================

  useEffect(() => {
    if (morningTaken && afternoonTaken && eveningTaken) {
      setShowCelebration(true);
    }
  }, [morningTaken, afternoonTaken, eveningTaken]);

  // =========================================================
  // SCROLL TO SECTION
  // =========================================================

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setSidebarOpen(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("patientName");
    navigate("/login");
  };

  // =========================================================
  // SOS
  // =========================================================

  const handleSOS = () => {
    const confirmed = window.confirm(
      "Are you sure you want to activate Emergency SOS?"
    );

    if (confirmed) {
      alert(
        "SOS Activated! Emergency contacts and healthcare assistance workflow will start here."
      );
    }
  };

  // =========================================================
  // VOICE TRIAGE
  // =========================================================

  const handleVoiceTriage = () => {
    setTriageStarted(!triageStarted);
  };

  // =========================================================
  // AUDIO COMPANION
  // =========================================================

  const handleAudioStart = () => {
    setAudioPlaying(true);
  };

  const handleAudioPause = () => {
    setAudioPlaying(false);
  };

  const handleAudioRepeat = () => {
    setAudioPlaying(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-5 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
            <Activity size={24} />
          </div>

          <div>
            <h1 className="font-bold">HealthConnect</h1>

            <p className="text-xs text-slate-500">
              Patient Portal
            </p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="flex">
        {/* =====================================================
            MOBILE OVERLAY
        ====================================================== */}

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-50 flex w-72
            flex-col border-r border-slate-800
            bg-slate-950 transition-transform
            duration-300

            lg:sticky
            lg:top-0
            lg:h-screen
            lg:translate-x-0

            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* LOGO */}

          <div className="flex h-24 items-center gap-3 border-b border-slate-800 px-6">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400 text-slate-950"
              style={{
                boxShadow:
                  "0 0 25px rgba(34,211,238,0.35)",
              }}
            >
              <Activity size={25} />
            </div>

            <div>
              <h1 className="font-bold">HealthConnect</h1>

              <p className="text-xs text-slate-500">
                Patient Portal
              </p>
            </div>
          </div>

          {/* PATIENT PROFILE */}

          <div className="mx-4 mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
                <User size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  LOGGED IN AS
                </p>

                <p className="truncate font-semibold">
                  {patientName}
                </p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 space-y-2 p-4">
            <SidebarButton
              icon={<Home size={20} />}
              text="Dashboard"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });

                setSidebarOpen(false);
              }}
            />

            <SidebarButton
              icon={<CalendarDays size={20} />}
              text="Appointments"
              onClick={() =>
                scrollToSection("appointment")
              }
            />

            <SidebarButton
              icon={<Pill size={20} />}
              text="Prescriptions"
              onClick={() =>
                scrollToSection("prescriptions")
              }
            />

            <SidebarButton
              icon={<FileText size={20} />}
              text="Health Records"
              onClick={() =>
                scrollToSection("records")
              }
            />

            <SidebarButton
              icon={<History size={20} />}
              text="Medical History"
              onClick={() =>
                scrollToSection("history")
              }
            />

            <SidebarButton
              icon={<ShieldAlert size={20} />}
              text="Emergency SOS"
              onClick={() =>
                scrollToSection("emergency")
              }
            />
          </nav>

          {/* LOGOUT */}

          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">

            {/* =================================================
                WELCOME SECTION
            ================================================== */}

            <section>
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-400">
                PATIENT DASHBOARD
              </p>

              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                Welcome back,{" "}
                <span className="text-cyan-400">
                  {patientName}
                </span>{" "}
                👋
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                Your healthcare information, appointments,
                prescriptions and records — all in one place.
              </p>
            </section>

            {/* =================================================
                TOP SUMMARY PANELS
            ================================================== */}

            <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

              {/* TOKEN */}

              <DashboardCard
                icon={<Hash size={24} />}
                color="#facc15"
                glow="rgba(250,204,21,0.20)"
              >
                <p className="text-sm font-semibold tracking-wider text-yellow-400">
                  CURRENT TOKEN
                </p>

                <h2 className="mt-4 text-4xl font-bold">
                  {tokenNumber}
                </h2>

                <div className="mt-4 space-y-1 text-sm text-slate-400">
                  <p>
                    Queue Position:{" "}
                    <span className="text-white">5</span>
                  </p>

                  <p>
                    Estimated wait:{" "}
                    <span className="text-white">
                      20 mins
                    </span>
                  </p>
                </div>
              </DashboardCard>

              {/* APPOINTMENT */}

              <DashboardCard
                icon={<CalendarDays size={24} />}
                color="#22d3ee"
                glow="rgba(34,211,238,0.20)"
              >
                <p className="text-sm font-semibold tracking-wider text-cyan-400">
                  NEXT APPOINTMENT
                </p>

                <h2 className="mt-4 text-xl font-bold">
                  Tomorrow
                </h2>

                <p className="mt-2 text-slate-400">
                  10:30 AM
                </p>

                <p className="mt-4 text-sm text-cyan-400">
                  Dr. Healthcare Provider
                </p>
              </DashboardCard>

              {/* PRESCRIPTIONS */}

              <DashboardCard
                icon={<FileText size={24} />}
                color="#a78bfa"
                glow="rgba(167,139,250,0.20)"
              >
                <p className="text-sm font-semibold tracking-wider text-violet-400">
                  PRESCRIPTIONS
                </p>

                <h2 className="mt-4 text-4xl font-bold">
                  3
                </h2>

                <p className="mt-2 text-slate-400">
                  Active prescriptions
                </p>

                <button
                  onClick={() =>
                    scrollToSection("prescriptions")
                  }
                  className="mt-4 text-sm font-semibold text-violet-400"
                >
                  View Details →
                </button>
              </DashboardCard>

              {/* MEDICATION */}

              <DashboardCard
                icon={<Pill size={24} />}
                color="#2dd4bf"
                glow="rgba(45,212,191,0.20)"
              >
                <p className="text-sm font-semibold tracking-wider text-teal-400">
                  MEDICATION
                </p>

                <h2 className="mt-4 text-4xl font-bold">
                  {completedDoses}/3
                </h2>

                <p className="mt-2 text-slate-400">
                  Completed today
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-teal-400 transition-all duration-500"
                    style={{
                      width: `${medicationProgress}%`,
                    }}
                  />
                </div>
              </DashboardCard>
            </section>

            {/* =================================================
                VOICE HEALTHCARE ASSISTANCE
                NOW ABOVE QUICK ACTIONS
            ================================================== */}

            <section className="mt-12">
              <SectionHeading
                title="Voice Healthcare Assistance"
                subtitle="Describe your symptoms in your preferred language or receive spoken healthcare guidance."
              />

              <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* VERNACULAR VOICE TRIAGE */}

                <div className="rounded-3xl border border-orange-400/40 bg-orange-400/5 p-6 transition hover:border-orange-400 hover:bg-orange-400/10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-400">
                      <Mic size={28} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Vernacular Voice Triage
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Describe your symptoms in the language
                        you are most comfortable with.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="text-sm font-semibold text-slate-300">
                      Select Your Language
                    </label>

                    <select
                      value={selectedLanguage}
                      onChange={(e) =>
                        setSelectedLanguage(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-orange-400"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Bengali</option>
                      <option>Odia</option>
                      <option>Tamil</option>
                      <option>Telugu</option>
                      <option>Marathi</option>
                      <option>Gujarati</option>
                      <option>Punjabi</option>
                      <option>Kannada</option>
                      <option>Malayalam</option>
                      <option>Others</option>
                    </select>
                  </div>

                  <button
                    onClick={handleVoiceTriage}
                    className={`mt-5 flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 font-bold text-white transition hover:scale-[1.02]
                      ${
                        triageStarted
                          ? "animate-pulse bg-red-500"
                          : "bg-orange-500 hover:bg-orange-400"
                      }`}
                  >
                    <Mic size={21} />

                    {triageStarted
                      ? "Listening... Tap to Stop"
                      : `Speak in ${selectedLanguage}`}
                  </button>

                  <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
                    <p className="text-xs tracking-wider text-slate-500">
                      VOICE TRIAGE STATUS
                    </p>

                    <p className="mt-2 text-sm text-slate-300">
                      {triageStarted
                        ? "Listening to your symptoms..."
                        : "Tap the microphone and describe what is happening."}
                    </p>
                  </div>
                </div>

                {/* AUDIO COMPANION */}

                <div className="rounded-3xl border border-cyan-400/40 bg-cyan-400/5 p-6 transition hover:border-cyan-400 hover:bg-cyan-400/10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                      <Volume2 size={28} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Audio Companion
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Receive spoken guidance and healthcare
                        instructions while using the application.
                      </p>
                    </div>
                  </div>

                  {/* AUDIO VISUALIZER */}

                  <div className="mt-8 flex h-28 items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-slate-950">
                    {[6, 12, 20, 10, 16, 8].map(
                      (height, index) => (
                        <span
                          key={index}
                          className={`w-2 rounded-full bg-cyan-400 ${
                            audioPlaying
                              ? "animate-pulse"
                              : ""
                          }`}
                          style={{
                            height: `${height * 4}px`,
                          }}
                        />
                      )
                    )}
                  </div>

                  <div className="mt-5 text-center">
                    <p className="font-semibold text-cyan-400">
                      Healthcare Audio Companion
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {audioPlaying
                        ? "Audio guidance is playing..."
                        : "Ready to provide voice guidance"}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">

                    <button
                      onClick={handleAudioStart}
                      className="flex flex-col items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-4 text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950"
                    >
                      <Play size={20} />

                      <span className="text-xs font-semibold">
                        Start
                      </span>
                    </button>

                    <button
                      onClick={handleAudioPause}
                      className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-4 text-slate-300 transition hover:border-cyan-400"
                    >
                      <Pause size={20} />

                      <span className="text-xs font-semibold">
                        Pause
                      </span>
                    </button>

                    <button
                      onClick={handleAudioRepeat}
                      className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-4 text-slate-300 transition hover:border-cyan-400"
                    >
                      <RotateCcw size={20} />

                      <span className="text-xs font-semibold">
                        Repeat
                      </span>
                    </button>

                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================== */}

            <section className="mt-12">
              <SectionHeading
                title="Quick Actions"
                subtitle="Access important healthcare services quickly."
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <QuickAction
                  icon={<CalendarDays size={28} />}
                  title="Book Appointment"
                  text="Schedule a consultation"
                  onClick={() =>
                    navigate("/appointments")
                  }
                />

                <QuickAction
                  icon={<Stethoscope size={28} />}
                  title="Find a Doctor"
                  text="Explore healthcare providers"
                  onClick={() =>
                    navigate("/doctors")
                  }
                />

                <QuickAction
                  icon={<Upload size={28} />}
                  title="Upload Prescription"
                  text="Upload handwritten prescription"
                  onClick={() =>
                    scrollToSection("prescriptions")
                  }
                />

                <QuickAction
                  icon={<History size={28} />}
                  title="Medical History"
                  text="View your past records"
                  onClick={() =>
                    scrollToSection("history")
                  }
                />
              </div>
            </section>

            {/* =================================================
                APPOINTMENT AND TOKEN
            ================================================== */}

            <section
              id="appointment"
              className="mt-12 scroll-mt-24"
            >
              <SectionHeading
                title="Current Appointment & Queue"
                subtitle="Track your appointment and queue status."
              />

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-6 lg:col-span-2">

                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                          <Stethoscope size={24} />
                        </div>

                        <div>
                          <h3 className="text-xl font-bold">
                            Dr. Healthcare Provider
                          </h3>

                          <p className="text-sm text-slate-400">
                            General Consultation
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">

                        <AppointmentInfo
                          icon={<CalendarDays size={18} />}
                          label="Date"
                          value="Tomorrow"
                        />

                        <AppointmentInfo
                          icon={<Clock size={18} />}
                          label="Time"
                          value="10:30 AM"
                        />

                        <AppointmentInfo
                          icon={<Hospital size={18} />}
                          label="Clinic"
                          value="HealthConnect Clinic"
                        />

                        <AppointmentInfo
                          icon={<MapPin size={18} />}
                          label="Location"
                          value="Healthcare Center"
                        />

                      </div>
                    </div>

                    <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5 text-center">
                      <p className="text-xs tracking-widest text-yellow-400">
                        YOUR TOKEN
                      </p>

                      <p className="mt-3 text-4xl font-bold">
                        {tokenNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-yellow-400/20 bg-slate-900 p-6">
                  <h3 className="font-bold">
                    Queue Status
                  </h3>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400">
                      Your Position
                    </p>

                    <p className="mt-2 text-6xl font-bold text-yellow-400">
                      5
                    </p>

                    <p className="mt-4 text-sm text-slate-400">
                      Approximately 20 minutes remaining
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                MEDICATION TRACKER
            ================================================== */}

            <section className="mt-12">
              <SectionHeading
                title="Today's Medication"
                subtitle="Mark each dose after taking your medicine."
              />

              <div className="mt-6 rounded-3xl border border-teal-400/20 bg-slate-900 p-6 md:p-8">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      Medication Adherence
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Complete all doses to maintain your medication streak.
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 px-4 py-3">
                    <p className="text-xs text-slate-500">
                      TODAY'S PROGRESS
                    </p>

                    <p className="mt-1 font-bold text-teal-400">
                      {completedDoses} of 3 completed
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3">

                  <MedicationSlot
                    label="Morning"
                    time="8:00 AM"
                    checked={morningTaken}
                    onChange={() =>
                      setMorningTaken(!morningTaken)
                    }
                  />

                  <MedicationSlot
                    label="Afternoon"
                    time="2:00 PM"
                    checked={afternoonTaken}
                    onChange={() =>
                      setAfternoonTaken(!afternoonTaken)
                    }
                  />

                  <MedicationSlot
                    label="Evening"
                    time="8:00 PM"
                    checked={eveningTaken}
                    onChange={() =>
                      setEveningTaken(!eveningTaken)
                    }
                  />

                </div>
              </div>
            </section>

            {/* =================================================
                PRESCRIPTIONS
            ================================================== */}

            <section
              id="prescriptions"
              className="mt-12 scroll-mt-24"
            >
              <SectionHeading
                title="Active Prescriptions"
                subtitle="View your medicines and prescription details."
              />

              <div className="mt-6 grid gap-6 lg:grid-cols-3">

                <PrescriptionCard
                  number="Prescription 01"
                  doctor="Dr. Healthcare Provider"
                  medicines={[
                    "Medicine A — Morning",
                    "Medicine B — Afternoon",
                    "Medicine C — Evening",
                  ]}
                />

                <PrescriptionCard
                  number="Prescription 02"
                  doctor="Dr. Healthcare Provider"
                  medicines={[
                    "Medicine D — Morning",
                    "Medicine E — Night",
                  ]}
                />

                <button
                  onClick={() =>
                    navigate("/upload-prescription")
                  }
                  className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-violet-400/30 bg-violet-400/5 p-6 text-center transition hover:border-violet-400 hover:bg-violet-400/10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-400">
                    <Upload size={30} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Upload Prescription
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Upload a handwritten or digital prescription.
                  </p>

                  <span className="mt-5 text-sm font-semibold text-violet-400">
                    Upload Now →
                  </span>
                </button>

              </div>
            </section>

            {/* =================================================
                HEALTH RECORDS
            ================================================== */}

            <section
              id="records"
              className="mt-12 scroll-mt-24"
            >
              <SectionHeading
                title="Health Records"
                subtitle="Access your important medical reports and documents."
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <RecordCard
                  icon={<FileText size={26} />}
                  title="Blood Test"
                  date="Recent report"
                />

                <RecordCard
                  icon={<HeartPulse size={26} />}
                  title="Health Report"
                  date="View details"
                />

                <RecordCard
                  icon={<FileText size={26} />}
                  title="Previous Prescription"
                  date="View prescription"
                />

                <RecordCard
                  icon={<FileText size={26} />}
                  title="Medical Documents"
                  date="View all files"
                />

              </div>
            </section>

            {/* =================================================
                MEDICAL HISTORY
            ================================================== */}

            <section
              id="history"
              className="mt-12 scroll-mt-24"
            >
              <SectionHeading
                title="Medical History"
                subtitle="A timeline of your healthcare journey."
              />

              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">

                <TimelineItem
                  title="Previous Consultation"
                  date="Healthcare Record"
                  text="Past consultation information will appear here."
                />

                <TimelineItem
                  title="Prescription Added"
                  date="Healthcare Record"
                  text="Your previous prescriptions will be available here."
                />

                <TimelineItem
                  title="Medical Report Uploaded"
                  date="Healthcare Record"
                  text="Your uploaded health reports will appear here."
                  last
                />

              </div>
            </section>

            {/* =================================================
                EMERGENCY SOS
            ================================================== */}

            <section
              id="emergency"
              className="mt-16 pb-10 scroll-mt-24"
            >
              <div className="relative overflow-hidden rounded-[2rem] border-2 border-red-500 bg-slate-900 p-6 shadow-[0_0_30px_rgba(239,68,68,0.35),0_0_80px_rgba(239,68,68,0.15)] md:p-10">

                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />

                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

                <div className="relative z-10">

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)]">
                          <ShieldAlert size={34} />
                        </div>

                        <div>
                          <p className="text-sm font-bold tracking-[0.25em] text-red-400">
                            EMERGENCY SERVICES
                          </p>

                          <h2 className="mt-1 text-3xl font-black text-white md:text-4xl">
                            Need Help Immediately?
                          </h2>
                        </div>
                      </div>

                      <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                        Activate SOS to alert your emergency contacts,
                        share your location and quickly access emergency
                        healthcare assistance.
                      </p>
                    </div>

                    {/* BIG SOS BUTTON */}

                    <button
                      onClick={handleSOS}
                      className="group relative mx-auto lg:mx-0"
                    >
                      <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-30" />

                      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-red-300 bg-red-600 text-3xl font-black text-white shadow-[0_0_35px_rgba(239,68,68,0.8)] transition duration-300 group-hover:scale-110">
                        SOS
                      </div>
                    </button>
                  </div>

                  {/* EMERGENCY FEATURES */}

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">

                    <EmergencyFeature
                      icon={<Users size={20} />}
                      text="Alert Emergency Contacts"
                    />

                    <EmergencyFeature
                      icon={<MapPin size={20} />}
                      text="Share Live Location"
                    />

                    <EmergencyFeature
                      icon={<Ambulance size={20} />}
                      text="Request Ambulance"
                    />

                  </div>

                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* =====================================================
          MEDICATION CELEBRATION MODAL
      ====================================================== */}

      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border-2 border-yellow-400 bg-slate-900 p-8 text-center shadow-[0_0_60px_rgba(250,204,21,0.25)]">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
              <Trophy size={42} />
            </div>

            <h2 className="mt-6 text-3xl font-bold">
              Great Job,{" "}
              <span className="text-yellow-400">
                {patientName}
              </span>
              ! 🎉
            </h2>

            <p className="mt-4 text-slate-400">
              You completed all your scheduled medication
              doses for today.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-950 p-4">
              <p className="text-xs tracking-widest text-slate-500">
                MEDICATION STREAK
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-400">
                🔥 1 DAY
              </p>
            </div>

            <button
              onClick={() => setShowCelebration(false)}
              className="mt-6 w-full rounded-xl bg-yellow-400 py-3 font-bold text-slate-950 transition hover:scale-[1.02]"
            >
              Continue
            </button>

          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   SIDEBAR BUTTON
========================================================= */

function SidebarButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-400 transition hover:bg-cyan-400/10 hover:text-cyan-400"
    >
      {icon}
      {text}
    </button>
  );
}


/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  icon,
  color,
  glow,
  children,
}) {
  return (
    <div
      className="relative min-h-[240px] overflow-hidden rounded-3xl bg-slate-900 p-6 transition duration-300 hover:-translate-y-1"
      style={{
        border: `1px solid ${color}`,
        boxShadow: `0 0 12px ${glow}, 0 0 30px ${glow}`,
      }}
    >
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl"
        style={{
          background: glow,
        }}
      />

      <div className="relative z-10">

        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            background: glow,
            color,
          }}
        >
          {icon}
        </div>

        <div className="mt-5">
          {children}
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-2 text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 transition group-hover:bg-cyan-400 group-hover:text-slate-950">
        {icon}
      </div>

      <h3 className="mt-5 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        {text}
      </p>

      <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-cyan-400">
        Open
        <ChevronRight size={16} />
      </div>
    </button>
  );
}


/* =========================================================
   APPOINTMENT INFO
========================================================= */

function AppointmentInfo({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-950 p-4">
      <div className="text-cyan-400">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   MEDICATION SLOT
========================================================= */

function MedicationSlot({
  label,
  time,
  checked,
  onChange,
}) {
  return (
    <button
      onClick={onChange}
      className={`
        flex items-center justify-between rounded-2xl
        border p-5 text-left transition-all duration-300

        ${
          checked
            ? "border-teal-400 bg-teal-400/10"
            : "border-slate-700 bg-slate-950 hover:border-teal-400/60"
        }
      `}
    >
      <div>
        <p className="font-semibold">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {time}
        </p>
      </div>

      <div
        className={`
          flex h-8 w-8 items-center justify-center
          rounded-full border-2

          ${
            checked
              ? "border-teal-400 bg-teal-400 text-slate-950"
              : "border-slate-600"
          }
        `}
      >
        {checked && <Check size={18} />}
      </div>
    </button>
  );
}


/* =========================================================
   PRESCRIPTION CARD
========================================================= */

function PrescriptionCard({
  number,
  doctor,
  medicines,
}) {
  return (
    <div className="rounded-3xl border border-violet-400/20 bg-slate-900 p-6">

      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">
          <FileText size={24} />
        </div>

        <span className="text-xs text-slate-500">
          Active
        </span>
      </div>

      <h3 className="mt-5 font-bold">
        {number}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {doctor}
      </p>

      <div className="mt-5 space-y-3">
        {medicines.map((medicine, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm text-slate-300"
          >
            <CheckCircle2
              size={16}
              className="text-violet-400"
            />

            {medicine}
          </div>
        ))}
      </div>

      <button className="mt-6 text-sm font-semibold text-violet-400 hover:text-violet-300">
        View Full Prescription →
      </button>
    </div>
  );
}


/* =========================================================
   RECORD CARD
========================================================= */

function RecordCard({
  icon,
  title,
  date,
}) {
  return (
    <button className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-cyan-400 hover:bg-cyan-400/5">

      <div className="text-cyan-400">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {date}
      </p>

    </button>
  );
}


/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({
  title,
  date,
  text,
  last,
}) {
  return (
    <div className="relative flex gap-5 pb-8">

      {!last && (
        <div className="absolute left-3 top-7 h-full w-px bg-slate-700" />
      )}

      <div className="relative z-10 mt-1 h-7 w-7 rounded-full border-4 border-cyan-400 bg-slate-900" />

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs text-cyan-400">
          {date}
        </p>

        <p className="mt-3 text-sm text-slate-400">
          {text}
        </p>
      </div>

    </div>
  );
}


/* =========================================================
   EMERGENCY FEATURE
========================================================= */

function EmergencyFeature({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-4 text-sm text-red-200">

      <div className="text-red-400">
        {icon}
      </div>

      {text}

    </div>
  );
}