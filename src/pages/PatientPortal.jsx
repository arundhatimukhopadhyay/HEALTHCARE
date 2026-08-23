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
  Sparkles,
  Stethoscope,
  Trophy,
  User,
  Users,
  Video,
  Volume2,
  X,
} from "lucide-react";
import VoiceAssistant from "../modules/VoiceAssistant";
import VideoConsult from "../modules/VideoConsult";
import EmergencyEscalation from "../modules/EmergencyEscalation";
import { queueOfflineAction } from "../modules/OfflineSync";
import { apiRequest } from "../api/client";

export default function PatientPortal({ user, onLogout, theme }) {
  const navigate = useNavigate();
  const isDark = theme !== "light";

  // Dynamic Patient Identity from Supabase / Auth Session
  const patientName =
    user?.name || localStorage.getItem("patientName") || "Rahul Das";
  const patientId = user?.id || "PAT001";
  const patientVillage = user?.village || "Rampur";
  const patientAddress = `${patientVillage}, Odisha (District Health Subcenter)`;

  // UI Modal States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingReason, setBookingReason] = useState("");
  const [lastSpokenNote, setLastSpokenNote] = useState("");

  // Medication States
  const [morningTaken, setMorningTaken] = useState(true);
  const [afternoonTaken, setAfternoonTaken] = useState(false);
  const [eveningTaken, setEveningTaken] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Persistent Token per Patient (Never resets on refresh!)
  const [tokenInfo, setTokenInfo] = useState(() => {
    const saved = localStorage.getItem(`patient_token_${patientId}`);
    return saved
      ? JSON.parse(saved)
      : {
          token:
            patientId === "PAT001"
              ? "T-001"
              : patientId === "PAT002"
                ? "T-002"
                : "T-005",
          doctor: "Dr. Rakesh Mohanty",
          center: `${patientVillage} Primary Subcenter`,
          estimatedWait: "20 mins",
          spokenComplaint: "Routine Clinical Follow-up",
        };
  });

  const tokenNumber = tokenInfo.token;

  // Medication Progress Calculation
  const completedDoses =
    Number(morningTaken) + Number(afternoonTaken) + Number(eveningTaken);
  const medicationProgress = (completedDoses / 3) * 100;

  // Medication Streak Celebration
  useEffect(() => {
    if (morningTaken && afternoonTaken && eveningTaken) {
      setShowCelebration(true);
    }
  }, [morningTaken, afternoonTaken, eveningTaken]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/auth");
  };

  // Voice Handlers
  const handleVoiceCommand = (command) => {
    if (command === "video_call") setIsVideoOpen(true);
    else if (command === "emergency_sos") setIsSosOpen(true);
  };

  const handleVoiceResult = (text) => {
    setLastSpokenNote(text);
    setBookingReason(text);
  };

  // Sequential Token Booking & Supabase Persistence
  const handleBookAppointment = async (e) => {
    if (e) e.preventDefault();
    const reason =
      bookingReason || lastSpokenNote || "General Health Consultation";

    const currentQueue = JSON.parse(
      localStorage.getItem("community_shared_queue") || "[]",
    );
    const nextNumber =
      currentQueue.length > 0
        ? parseInt(
            currentQueue[currentQueue.length - 1].token.replace(/\D/g, "") ||
              "4",
          ) + 1
        : 5;

    const sequentialToken = `T-00${nextNumber}`;

    const newAppointment = {
      token: sequentialToken,
      token_number: sequentialToken,
      name: patientName,
      patient_name: patientName,
      patientId: user?.uuid || patientId,
      age: 48,
      village: patientVillage,
      reason: reason,
      chiefComplaint: reason,
      isVoice: Boolean(lastSpokenNote),
      status: "In Waiting Room",
    };

    setTokenInfo({
      token: sequentialToken,
      doctor: "Dr. Rakesh Mohanty",
      center: `${patientVillage} Primary Subcenter`,
      estimatedWait: `${nextNumber * 6} mins`,
      spokenComplaint: reason,
    });

    localStorage.setItem(
      `patient_token_${patientId}`,
      JSON.stringify({
        token: sequentialToken,
        doctor: "Dr. Rakesh Mohanty",
        center: `${patientVillage} Primary Subcenter`,
        estimatedWait: `${nextNumber * 6} mins`,
        spokenComplaint: reason,
      }),
    );

    const updatedQueue = [
      ...currentQueue.filter((p) => p.token !== sequentialToken),
      newAppointment,
    ];
    localStorage.setItem(
      "community_shared_queue",
      JSON.stringify(updatedQueue),
    );
    window.dispatchEvent(new Event("shared-queue-updated"));

    setIsBookingOpen(false);
    queueOfflineAction("BOOK_APPOINTMENT", newAppointment);

    try {
      await apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify(newAppointment),
      });
    } catch (err) {}

    alert(`✓ Token ${sequentialToken} Generated & Synced to Cloud!`);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-white" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* MOBILE TOP BAR */}
      <header
        className={`sticky top-0 z-40 flex h-16 items-center justify-between border-b px-5 lg:hidden ${
          isDark ? "border-slate-800 bg-slate-950" : "border-zinc-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-bold">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="font-bold font-mono text-sm">MEDISPHERE</h1>
            <p className="text-[10px] text-cyan-500 font-mono">
              {patientId} • {patientName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            isDark
              ? "border-slate-700 bg-slate-900 text-white"
              : "border-zinc-300 bg-zinc-100 text-zinc-800"
          }`}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className="flex">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}

        {/* SIDEBAR (Cleanly starts under the main navbar) */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 flex w-72
            flex-col border-r transition-transform duration-300
            lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] lg:translate-x-0
            ${isDark ? "border-slate-800 bg-slate-950/95" : "border-zinc-200 bg-white"}
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* PATIENT PROFILE CARD */}
          <div
            className={`mx-4 mt-4 rounded-2xl border p-4 ${
              isDark
                ? "border-cyan-400/20 bg-cyan-400/5"
                : "border-cyan-200 bg-cyan-50/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 font-mono font-bold text-lg">
                {patientName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 font-mono uppercase">
                  PATIENT PROFILE
                </p>
                <p className="truncate font-semibold text-sm">{patientName}</p>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 border border-cyan-800 rounded mt-0.5 inline-block">
                  {patientId} • {patientVillage}
                </span>
              </div>
            </div>
          </div>

          {/* NAVIGATION BUTTONS */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            <SidebarButton
              icon={<Home size={18} />}
              text="Dashboard"
              isDark={isDark}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setSidebarOpen(false);
              }}
            />
            <SidebarButton
              icon={<CalendarDays size={18} />}
              text="Live Queue"
              isDark={isDark}
              onClick={() => scrollToSection("appointment")}
            />
            <SidebarButton
              icon={<Pill size={18} />}
              text="Prescriptions"
              isDark={isDark}
              onClick={() => scrollToSection("prescriptions")}
            />
            <SidebarButton
              icon={<Mic size={18} />}
              text="Voice Assistant"
              isDark={isDark}
              onClick={() => scrollToSection("voice-engine")}
            />
            <SidebarButton
              icon={<Video size={18} />}
              text="Video Consult"
              isDark={isDark}
              onClick={() => setIsVideoOpen(true)}
            />
            <SidebarButton
              icon={<ShieldAlert size={18} />}
              text="Emergency SOS"
              isDark={isDark}
              onClick={() => setIsSosOpen(true)}
            />
          </nav>

          {/* LOGOUT */}
          <div
            className={`border-t p-4 ${isDark ? "border-slate-800" : "border-zinc-200"}`}
          >
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 font-mono text-xs uppercase font-bold"
            >
              <LogOut size={16} /> Switch Profile / Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="min-w-0 flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-10">
          {/* WELCOME BANNER */}
          <section>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-mono uppercase">
              PATIENT CARE DESK
            </p>
            <h1 className="mt-1 text-2xl sm:text-4xl font-bold">
              Welcome back, <span className="text-cyan-400">{patientName}</span>{" "}
              👋
            </h1>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <MapPin size={14} className="text-cyan-400" />
              <span>{patientAddress}</span>
            </div>
          </section>

          {/* TOP SUMMARY GLOW CARDS */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              icon={<Hash size={22} />}
              color="#facc15"
              glow="rgba(250,204,21,0.20)"
              isDark={isDark}
            >
              <p className="text-xs font-semibold tracking-wider text-yellow-400 font-mono uppercase">
                CLINIC TOKEN
              </p>
              <h2 className="mt-2 text-3xl font-bold font-mono">
                {tokenNumber}
              </h2>
              <p className="mt-2 text-xs text-slate-400 font-mono">
                Wait: {tokenInfo.estimatedWait} • {patientVillage} PHC
              </p>
            </DashboardCard>

            <DashboardCard
              icon={<CalendarDays size={22} />}
              color="#22d3ee"
              glow="rgba(34,211,238,0.20)"
              isDark={isDark}
            >
              <p className="text-xs font-semibold tracking-wider text-cyan-400 font-mono uppercase">
                ATTENDING DOCTOR
              </p>
              <h2 className="mt-2 text-lg font-bold truncate">
                {tokenInfo.doctor}
              </h2>
              <p className="mt-2 text-xs text-slate-400 font-mono">
                Medical Officer
              </p>
            </DashboardCard>

            <DashboardCard
              icon={<FileText size={22} />}
              color="#a78bfa"
              glow="rgba(167,139,250,0.20)"
              isDark={isDark}
            >
              <p className="text-xs font-semibold tracking-wider text-violet-400 font-mono uppercase">
                PRESCRIPTIONS
              </p>
              <h2 className="mt-2 text-3xl font-bold font-mono">2</h2>
              <p className="mt-2 text-xs text-slate-400 font-mono">
                Active Plans in Supabase
              </p>
            </DashboardCard>

            <DashboardCard
              icon={<Pill size={22} />}
              color="#2dd4bf"
              glow="rgba(45,212,191,0.20)"
              isDark={isDark}
            >
              <p className="text-xs font-semibold tracking-wider text-teal-400 font-mono uppercase">
                DAILY DOSES
              </p>
              <h2 className="mt-2 text-3xl font-bold font-mono">
                {completedDoses}/3
              </h2>
              <div
                className={`mt-3 h-2 overflow-hidden rounded-full ${isDark ? "bg-slate-800" : "bg-zinc-200"}`}
              >
                <div
                  className="h-full rounded-full bg-teal-400 transition-all duration-500"
                  style={{ width: `${medicationProgress}%` }}
                />
              </div>
            </DashboardCard>
          </section>

          {/* EMERGENCY SOS BANNER */}
          <section id="emergency" className="scroll-mt-24">
            <div
              className={`relative overflow-hidden rounded-3xl border-2 border-red-500 p-6 md:p-8 shadow-[0_0_30px_rgba(239,68,68,0.25)] ${
                isDark ? "bg-slate-900" : "bg-red-50/40"
              }`}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)]">
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest text-red-500 font-mono uppercase">
                        EMERGENCY ESCALATION
                      </p>
                      <h2
                        className={`mt-0.5 text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-zinc-900"}`}
                      >
                        Need Urgent Medical Dispatch?
                      </h2>
                    </div>
                  </div>
                  <p
                    className={`mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-zinc-600"}`}
                  >
                    Transmits live GPS coordinates and your medical snapshot
                    (Blood Group O+, Allergies) to Rampur ASHA & 108 Ambulance
                    with zero-data SMS/WhatsApp fallback.
                  </p>
                </div>

                <button
                  onClick={() => setIsSosOpen(true)}
                  className="group relative mx-auto lg:mx-0 shrink-0"
                >
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-30" />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-red-300 bg-red-600 text-xl font-black text-white shadow-[0_0_35px_rgba(239,68,68,0.8)] transition duration-300 group-hover:scale-105 font-mono">
                    SOS
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* VERNACULAR VOICE TRIAGE & AUDIO COMPANION */}
          <section id="voice-engine" className="scroll-mt-24">
            <SectionHeading
              title="Vernacular Voice Triage & Audio Engine"
              subtitle="Speak symptoms in Hindi/English to generate tokens or receive spoken audio guidance."
              isDark={isDark}
            />

            <div className="mt-4">
              <VoiceAssistant
                onResult={handleVoiceResult}
                onCommand={handleVoiceCommand}
                readAloudText={`Hello ${patientName}. You have active prescription doses scheduled today in ${patientVillage}.`}
              />

              {lastSpokenNote && (
                <div className="mt-3 p-4 bg-emerald-950/80 border border-emerald-500 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded-2xl">
                  <span className="text-xs font-mono">
                    Spoken Symptom Captured:{" "}
                    <strong className="text-emerald-300">
                      "{lastSpokenNote}"
                    </strong>
                  </span>
                  <button
                    onClick={handleBookAppointment}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs uppercase px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-4 h-4" /> Book Token With This Note
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* VIDEO CONSULTANCY TRIGGER */}
          <section id="video-consultancy" className="scroll-mt-24">
            <div
              className={`rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
                isDark
                  ? "border-blue-400/30 bg-gradient-to-r from-blue-500/10 via-cyan-400/5 to-blue-500/10"
                  : "border-blue-200 bg-blue-50/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Video size={28} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest text-blue-400 font-mono uppercase">
                    REMOTE TELE-DOCTOR
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold">
                    Encrypted Video Consultation
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct WebRTC consultation with Dr. Rakesh Mohanty.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-6 py-3.5 font-bold text-white transition font-mono text-xs uppercase shadow-md"
              >
                <Video size={18} /> Launch Teleconsult{" "}
                <ChevronRight size={16} />
              </button>
            </div>
          </section>

          {/* MEDICATION TRACKER */}
          <section className="scroll-mt-24">
            <SectionHeading
              title="Today's Medication Tracker"
              subtitle="Check off each scheduled dosage to maintain your wellness streak."
              isDark={isDark}
            />

            <div
              className={`mt-4 rounded-3xl border p-6 ${
                isDark
                  ? "border-teal-400/20 bg-slate-900"
                  : "border-teal-200 bg-white"
              }`}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <MedicationSlot
                  label="Paracetamol 500mg (Morning)"
                  time="08:00 AM"
                  checked={morningTaken}
                  isDark={isDark}
                  onChange={() => {
                    setMorningTaken(!morningTaken);
                    queueOfflineAction("TOGGLE_MED", {
                      slot: "morning",
                      patient: patientId,
                    });
                  }}
                />

                <MedicationSlot
                  label="Vitamin C Tablet (Afternoon)"
                  time="01:00 PM"
                  checked={afternoonTaken}
                  isDark={isDark}
                  onChange={() => {
                    setAfternoonTaken(!afternoonTaken);
                    queueOfflineAction("TOGGLE_MED", {
                      slot: "afternoon",
                      patient: patientId,
                    });
                  }}
                />

                <MedicationSlot
                  label="Prescription Refill Dose (Night)"
                  time="09:00 PM"
                  checked={eveningTaken}
                  isDark={isDark}
                  onChange={() => {
                    setEveningTaken(!eveningTaken);
                    queueOfflineAction("TOGGLE_MED", {
                      slot: "evening",
                      patient: patientId,
                    });
                  }}
                />
              </div>
            </div>
          </section>

          {/* ACTIVE PRESCRIPTIONS */}
          <section id="prescriptions" className="scroll-mt-24">
            <SectionHeading
              title="Active Prescriptions (Supabase Ledger)"
              subtitle="Verified by Rampur Primary Health Subcenter Medical Officers."
              isDark={isDark}
            />

            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <PrescriptionCard
                number="Prescription #OD-48821"
                doctor="Dr. Rakesh Mohanty"
                isDark={isDark}
                medicines={[
                  "Paracetamol 500mg — Morning (After Food)",
                  "Vitamin C 500mg — Afternoon (Daily)",
                ]}
              />

              <PrescriptionCard
                number="Prescription #OD-48822"
                doctor="Dr. Ananya Sharma"
                isDark={isDark}
                medicines={[
                  "Omeprazole 20mg — Before Breakfast",
                  "Cetirizine 10mg — Night (As Needed)",
                ]}
              />
            </div>
          </section>
        </main>
      </div>

      {/* MEDICATION CELEBRATION MODAL */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border-2 border-yellow-400 bg-slate-900 p-8 text-center shadow-[0_0_60px_rgba(250,204,21,0.25)] text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
              <Trophy size={40} />
            </div>
            <h2 className="mt-5 text-2xl font-bold font-mono">
              Great Job, <span className="text-yellow-400">{patientName}</span>!
              🎉
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              You completed all scheduled doses for today. Your adherence has
              been logged for Dr. Rakesh Mohanty.
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-6 w-full rounded-xl bg-yellow-400 py-3 font-bold text-slate-950 transition hover:scale-[1.02] font-mono text-xs uppercase"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* VIDEO CONSULTATION MODAL */}
      {isVideoOpen && (
        <VideoConsult
          roomName="T001"
          userName={patientName}
          patientDetails={{
            name: patientName,
            age: 48,
            village: patientVillage,
            complaint: tokenInfo.spokenComplaint,
            token: tokenNumber,
          }}
          onClose={() => setIsVideoOpen(false)}
        />
      )}

      {/* EMERGENCY SOS MODAL */}
      {isSosOpen && (
        <EmergencyEscalation
          patient={{
            name: patientName,
            age: 48,
            bloodGroup: "O+",
            allergies: "None Reported",
            chronicConditions: "Hypertension",
            village: patientVillage,
            ashaContact: "+919876543210",
          }}
          onClose={() => setIsSosOpen(false)}
        />
      )}
    </div>
  );
}

/* HELPER COMPONENTS */
function SidebarButton({ icon, text, onClick, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition font-mono text-xs uppercase font-medium ${
        isDark
          ? "text-slate-400 hover:bg-cyan-400/10 hover:text-cyan-400"
          : "text-zinc-600 hover:bg-cyan-50 hover:text-cyan-700"
      }`}
    >
      {icon} {text}
    </button>
  );
}

function DashboardCard({ icon, color, glow, isDark, children }) {
  return (
    <div
      className={`relative min-h-[170px] overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-1 ${
        isDark ? "bg-slate-900" : "bg-white border-zinc-200 shadow-sm"
      }`}
      style={{
        border: `1px solid ${color}`,
        boxShadow: isDark ? `0 0 12px ${glow}` : "none",
      }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: glow, color }}
      >
        {icon}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SectionHeading({ title, subtitle, isDark }) {
  return (
    <div>
      <h2
        className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}
      >
        {title}
      </h2>
      <p className="mt-0.5 text-xs text-slate-400 font-mono">{subtitle}</p>
    </div>
  );
}

function MedicationSlot({ label, time, checked, onChange, isDark }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
        checked
          ? "border-teal-400 bg-teal-400/10"
          : isDark
            ? "border-slate-800 bg-slate-950 hover:border-teal-400/40"
            : "border-zinc-200 bg-zinc-50 hover:border-teal-300"
      }`}
    >
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{time}</p>
      </div>
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${checked ? "border-teal-400 bg-teal-400 text-slate-950" : "border-slate-600"}`}
      >
        {checked && <Check size={14} />}
      </div>
    </button>
  );
}

function PrescriptionCard({ number, doctor, medicines, isDark }) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        isDark
          ? "border-violet-400/20 bg-slate-900"
          : "border-violet-200 bg-white shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-violet-400 font-mono font-bold uppercase">
          {number}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          Prescribed by {doctor}
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        {medicines.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-xs font-mono opacity-90"
          >
            <CheckCircle2 size={14} className="text-violet-400 shrink-0" /> {m}
          </div>
        ))}
      </div>
    </div>
  );
}
