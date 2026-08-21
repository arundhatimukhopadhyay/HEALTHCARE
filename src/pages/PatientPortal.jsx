import React, { useState } from "react";
import {
  Activity,
  Calendar,
  Clock,
  Pill,
  FileText,
  Stethoscope,
  Upload,
  AlertCircle,
  Check,
  Trophy,
  X,
  User,
  ArrowRight,
  ClipboardList,
  Phone,
  MapPin,
} from "lucide-react";

export default function PatientPortal() {
  // =========================
  // GET LOGGED-IN USER
  // =========================
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read user data:", error);
  }

  const patientName = user?.name || "Patient";

  // =========================
  // MEDICATION STATE
  // =========================
  const [medications, setMedications] = useState({
    morning: false,
    afternoon: false,
    evening: false,
  });

  // =========================
  // CELEBRATION STATE
  // =========================
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(7);
  const [celebrationShown, setCelebrationShown] = useState(false);

  // =========================
  // TAB STATE
  // =========================
  const [activeTab, setActiveTab] = useState("consultations");

  // =========================
  // MEDICATION SCHEDULE
  // =========================
  const medicationSlots = [
    {
      id: "morning",
      label: "Morning Dose",
      time: "8:00 AM",
    },
    {
      id: "afternoon",
      label: "Afternoon Dose",
      time: "2:00 PM",
    },
    {
      id: "evening",
      label: "Evening Dose",
      time: "8:00 PM",
    },
  ];

  // =========================
  // MEDICATION HANDLER
  // =========================
  const toggleMedication = (time) => {
    setMedications((prev) => {
      const updated = {
        ...prev,
        [time]: !prev[time],
      };

      const allCompleted =
        updated.morning &&
        updated.afternoon &&
        updated.evening;

      if (allCompleted && !celebrationShown) {
        setShowCelebration(true);
        setCelebrationShown(true);
        setStreak((current) => current + 1);
      }

      return updated;
    });
  };

  const completedCount =
    Object.values(medications).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-cyan-500 rounded-xl flex items-center justify-center">
              <Activity className="text-slate-950" size={25} />
            </div>

            <div>
              <h1 className="text-lg md:text-xl font-bold">
                HealthConnect
              </h1>

              <p className="text-xs text-slate-400">
                Patient Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Account Active
            </div>

            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <User className="text-cyan-400" size={20} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ================= WELCOME ================= */}

        <section className="mb-8">
          <p className="text-cyan-400 font-medium">
            Good Morning 👋
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Welcome back, {patientName}!
          </h2>

          <p className="text-slate-400 mt-3">
            Manage your appointments, medications, prescriptions, and health
            records in one place.
          </p>
        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="text-cyan-400" size={22} />

            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* BOOK APPOINTMENT */}

            <button className="bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl p-5 text-left transition group">
              <div className="w-11 h-11 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20">
                <Calendar className="text-cyan-400" size={22} />
              </div>

              <h3 className="font-semibold mt-4">
                Book Appointment
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Schedule a consultation
              </p>
            </button>

            {/* UPLOAD REPORT */}

            <button className="bg-slate-900 border border-slate-800 hover:border-teal-500 rounded-2xl p-5 text-left transition group">
              <div className="w-11 h-11 bg-teal-500/10 rounded-xl flex items-center justify-center group-hover:bg-teal-500/20">
                <Upload className="text-teal-400" size={22} />
              </div>

              <h3 className="font-semibold mt-4">
                Upload Report
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Add medical documents
              </p>
            </button>

            {/* PRESCRIPTIONS */}

            <button
              onClick={() => setActiveTab("prescriptions")}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-2xl p-5 text-left transition group"
            >
              <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20">
                <Pill className="text-purple-400" size={22} />
              </div>

              <h3 className="font-semibold mt-4">
                Prescriptions
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                View active medicines
              </p>
            </button>

            {/* EMERGENCY */}

            <button className="bg-slate-900 border border-slate-800 hover:border-red-500 rounded-2xl p-5 text-left transition group">
              <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20">
                <AlertCircle className="text-red-400" size={22} />
              </div>

              <h3 className="font-semibold mt-4">
                Emergency Help
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Request immediate assistance
              </p>
            </button>
          </div>
        </section>

        {/* ================= TODAY'S HEALTH OVERVIEW ================= */}

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardList className="text-cyan-400" size={22} />

            <h2 className="text-xl font-semibold">
              Today's Health Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* NEXT CONSULTATION */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center">
                  <Stethoscope className="text-cyan-400" size={25} />
                </div>

                <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full">
                  Upcoming
                </span>
              </div>

              <p className="text-slate-400 mt-5 text-sm">
                Next Consultation
              </p>

              <h3 className="font-semibold text-lg mt-2">
                General Health Checkup
              </h3>

              <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
                <Calendar size={16} />
                Tomorrow
              </div>

              <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                <Clock size={16} />
                10:30 AM
              </div>
            </div>

            {/* MEDICATION PROGRESS */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center">
                  <Pill className="text-teal-400" size={25} />
                </div>

                <span className="text-xs bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full">
                  Today
                </span>
              </div>

              <p className="text-slate-400 mt-5 text-sm">
                Medication Progress
              </p>

              <h3 className="font-semibold text-lg mt-2">
                {completedCount} of 3 doses completed
              </h3>

              <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / 3) * 100}%`,
                  }}
                />
              </div>

              <p className="text-sm text-slate-400 mt-3">
                Keep following your prescribed schedule.
              </p>
            </div>

            {/* HEALTH TASKS */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                  <ClipboardList className="text-orange-400" size={25} />
                </div>

                <span className="text-xs bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full">
                  Attention
                </span>
              </div>

              <p className="text-slate-400 mt-5 text-sm">
                Health Tasks
              </p>

              <h3 className="font-semibold text-lg mt-2">
                2 tasks pending
              </h3>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-400">
                  • Upload latest medical report
                </p>

                <p className="text-sm text-slate-400">
                  • Confirm follow-up appointment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MEDICATION ADHERENCE ================= */}

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                Medication Adherence
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Mark each dose after taking your medication.
              </p>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl">
              {completedCount} / 3 doses completed
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medicationSlots.map((dose) => {
              const completed = medications[dose.id];

              return (
                <button
                  key={dose.id}
                  onClick={() => toggleMedication(dose.id)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                    completed
                      ? "bg-emerald-500/10 border-emerald-500/60"
                      : "bg-slate-950 border-slate-800 hover:border-cyan-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-800 rounded-xl">
                      <Pill
                        className={
                          completed
                            ? "text-emerald-400"
                            : "text-cyan-400"
                        }
                        size={24}
                      />
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                        completed
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-slate-600"
                      }`}
                    >
                      {completed && <Check size={16} />}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mt-5">
                    {dose.label}
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Scheduled: {dose.time}
                  </p>

                  <p
                    className={`text-sm mt-4 ${
                      completed
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }`}
                  >
                    {completed
                      ? "✓ Dose completed"
                      : "Tap to mark as taken"}
                  </p>
                </button>
              );
            })}
          </div>

          {completedCount === 3 && (
            <div className="mt-6 flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-teal-500/15 border border-cyan-500/30">
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Trophy className="text-yellow-400" />
              </div>

              <div>
                <h3 className="font-semibold text-cyan-300">
                  All doses completed! 🎉
                </h3>

                <p className="text-sm text-slate-300">
                  Great consistency! You are on a {streak}-day streak.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ================= TABBED WORKSPACE ================= */}

        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mb-10">
          <div className="flex overflow-x-auto border-b border-slate-800">
            <button
              onClick={() => setActiveTab("consultations")}
              className={`flex items-center gap-2 px-6 py-5 whitespace-nowrap transition ${
                activeTab === "consultations"
                  ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Stethoscope size={18} />
              Consultations
            </button>

            <button
              onClick={() => setActiveTab("prescriptions")}
              className={`flex items-center gap-2 px-6 py-5 whitespace-nowrap transition ${
                activeTab === "prescriptions"
                  ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Pill size={18} />
              Active Prescriptions
            </button>

            <button
              onClick={() => setActiveTab("records")}
              className={`flex items-center gap-2 px-6 py-5 whitespace-nowrap transition ${
                activeTab === "records"
                  ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText size={18} />
              Health Records
            </button>
          </div>

          {/* CONSULTATIONS */}

          {activeTab === "consultations" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-5">
                Upcoming Consultations
              </h2>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl h-fit">
                    <Stethoscope className="text-cyan-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      General Health Consultation
                    </h3>

                    <p className="text-sm text-slate-400 mt-2">
                      Regular consultation and health follow-up.
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={15} />
                        Tomorrow
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={15} />
                        10:30 AM
                      </span>
                    </div>
                  </div>
                </div>

                <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-3 rounded-xl transition">
                  View Details
                </button>
              </div>
            </div>
          )}

          {/* PRESCRIPTIONS */}

          {activeTab === "prescriptions" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-5">
                Active Prescriptions
              </h2>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      Current Prescription
                    </h3>

                    <p className="text-sm text-slate-400 mt-2">
                      Follow the dosage instructions provided by your healthcare professional.
                    </p>
                  </div>

                  <Pill className="text-teal-400 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-900 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Frequency
                    </p>

                    <p className="mt-2 font-medium">
                      As prescribed
                    </p>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Status
                    </p>

                    <p className="mt-2 font-medium text-emerald-400">
                      Active
                    </p>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Next Dose
                    </p>

                    <p className="mt-2 font-medium">
                      Check schedule
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HEALTH RECORDS */}

          {activeTab === "records" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-5">
                Health Records
              </h2>

              <div className="space-y-3">
                {[
                  {
                    name: "Blood Test Report",
                    date: "15 Aug 2026",
                  },
                  {
                    name: "Previous Prescription",
                    date: "10 Aug 2026",
                  },
                  {
                    name: "Health Checkup Summary",
                    date: "02 Aug 2026",
                  },
                ].map((record) => (
                  <div
                    key={record.name}
                    className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <FileText className="text-cyan-400" />
                      </div>

                      <div>
                        <h3 className="font-medium">
                          {record.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {record.date}
                        </p>
                      </div>
                    </div>

                    <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm">
                      View
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ================= HELP SECTION ================= */}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Phone className="text-cyan-400" />

              <div>
                <h3 className="font-semibold">
                  Need Help?
                </h3>

                <p className="text-sm text-slate-400">
                  Contact the healthcare support team.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-teal-400" />

              <div>
                <h3 className="font-semibold">
                  Find Healthcare Services
                </h3>

                <p className="text-sm text-slate-400">
                  Locate nearby healthcare support and facilities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= CELEBRATION MODAL ================= */}

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center shadow-lg">
              <Trophy
                className="text-slate-950"
                size={50}
              />
            </div>

            <h2 className="text-3xl font-bold mt-6">
              Fantastic Job, {patientName}! 🎉
            </h2>

            <p className="text-slate-400 mt-3">
              You completed all your scheduled medication doses for today.
            </p>

            <div className="mt-6 p-5 bg-slate-950 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400">
                Current Medication Streak
              </p>

              <p className="text-4xl font-bold text-cyan-400 mt-2">
                {streak} Days 🔥
              </p>
            </div>

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-xl font-semibold transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}