import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  LogOut,
  MapPin,
  Pill,
  Plus,
  ShieldAlert,
  Sparkles,
  User,
  Video,
} from "lucide-react";
import VoiceSearch from "../modules/VoiceSearch";
import VideoConsult from "../modules/VideoConsult";
import EmergencyEscalation from "../modules/EmergencyEscalation";
import { queueOfflineAction } from "../modules/OfflineSync";

export default function PatientPortal({ user, onLogout }) {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingReason, setBookingReason] = useState("");
  const [lastSpokenNote, setLastSpokenNote] = useState("");

  const [tokenInfo, setTokenInfo] = useState({
    token: "TOKEN #14",
    doctor: "Dr. S. Sharma",
    center: "Rampur Primary Subcenter",
    estimatedWait: "~12 mins",
    spokenComplaint: "Hypertension Follow-up",
  });

  const [meds, setMeds] = useState([
    { id: 1, name: "Metformin 500mg", slot: "08:00 AM", taken: true },
    { id: 2, name: "Amlodipine 5mg", slot: "01:00 PM", taken: false },
    { id: 3, name: "Atorvastatin 10mg", slot: "09:00 PM", taken: false },
  ]);

  const toggleMed = (id) => {
    const updatedMeds = meds.map((m) =>
      m.id === id ? { ...m, taken: !m.taken } : m,
    );
    setMeds(updatedMeds);

    // Save locally and queue for sync
    localStorage.setItem("patient_meds", JSON.stringify(updatedMeds));
    queueOfflineAction("TOGGLE_MEDICATION", { id, timestamp: new Date() });
  };

  // Voice Command Handler
  const handleVoiceCommand = (command) => {
    if (command === "video_call") {
      setIsVideoOpen(true);
    } else if (command === "emergency_sos") {
      setIsSosOpen(true);
    }
  };

  // Voice Result Handler
  const handleVoiceResult = (text) => {
    setLastSpokenNote(text);
    setBookingReason(text);
  };

  const handleBookAppointment = (e) => {
    if (e) e.preventDefault();
    const reason = bookingReason || lastSpokenNote || "General Health Checkup";

    const newToken = {
      token: `TOKEN #${Math.floor(Math.random() * 80 + 20)}`,
      doctor: "Dr. S. Sharma",
      center: "Rampur Primary Subcenter",
      estimatedWait: "~25 mins",
      spokenComplaint: reason,
    };

    setTokenInfo(newToken);
    setIsBookingOpen(false);

    // Queue offline sync
    queueOfflineAction("BOOK_APPOINTMENT", newToken);
    alert(`✓ Token Generated successfully with Complaint: "${reason}"`);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <div className="space-y-6">
      {/* Patient Header Identity Bar */}
      <div className="bg-white border border-zinc-300 p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-100 border border-zinc-300 flex items-center justify-center font-mono font-bold text-zinc-800">
            {user?.name?.charAt(0) || "R"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-zinc-900 text-base">
                {user?.name || "Ramesh Patel"}
              </h2>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5">
                VERIFIED PATIENT
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              ABHA ID: {user?.id || "ABHA-9182-4421"} • Village:{" "}
              {user?.village || "Rampur"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase px-3 py-2 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Book Clinic Token
          </button>
          <button
            onClick={handleLogout}
            className="border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-mono text-xs uppercase px-3 py-2 flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit Portal
          </button>
        </div>
      </div>

      {/* Top Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-300 border border-zinc-300">
        {/* Token Card */}
        <div className="bg-white p-5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Live Clinic Queue
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-mono font-bold text-zinc-900">
              {tokenInfo.token}
            </span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
              {tokenInfo.estimatedWait}
            </span>
          </div>
          <p className="text-xs text-zinc-700 font-semibold mt-2">
            {tokenInfo.doctor} — {tokenInfo.center}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
            Note: {tokenInfo.spokenComplaint}
          </p>
        </div>

        {/* Telemedicine Trigger */}
        <div className="bg-white p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Virtual Consultation
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 mt-1">
              Remote Tele-Doctor Available
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Say "Doctor Call" into mic to launch
            </p>
          </div>
          <button
            onClick={() => setIsVideoOpen(true)}
            className="mt-3 w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 transition"
          >
            <Video className="w-4 h-4 text-emerald-400" /> Start Doctor Video
            Call
          </button>
        </div>

        {/* Emergency SOS */}
        <div className="bg-white p-5 flex flex-col justify-between border-l border-zinc-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">
              Urgent Escalation
            </span>
            <p className="text-xs text-zinc-500 mt-1">
              Say "SOS" or tap below for GPS dispatch
            </p>
          </div>
          <button
            onClick={() => setIsSosOpen(true)}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 transition"
          >
            <ShieldAlert className="w-4 h-4" /> Trigger Emergency SOS
          </button>
        </div>
      </div>

      {/* Voice Assistant / Symptom Search */}
      <div className="space-y-2">
        <VoiceSearch
          onResult={handleVoiceResult}
          onCommand={handleVoiceCommand}
        />

        {/* Quick Voice Booking CTA */}
        {lastSpokenNote && (
          <div className="p-3 bg-zinc-900 text-white flex justify-between items-center">
            <span className="text-xs font-mono">
              Ready to book appointment for: <strong>"{lastSpokenNote}"</strong>
            </span>
            <button
              onClick={handleBookAppointment}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase px-3 py-1.5 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> Book Token With This Note
            </button>
          </div>
        )}
      </div>

      {/* Medication Regimen & Clinical Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medication Table */}
        <div className="bg-white border border-zinc-300">
          <div className="px-5 py-3 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-700">
              Daily Prescription Schedule
            </span>
            <Pill className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="divide-y divide-zinc-200">
            {meds.map((med) => (
              <div
                key={med.id}
                className="p-4 flex items-center justify-between hover:bg-zinc-50/50"
              >
                <div>
                  <h4
                    className={`text-sm font-semibold ${med.taken ? "line-through text-zinc-400" : "text-zinc-900"}`}
                  >
                    {med.name}
                  </h4>
                  <span className="text-xs font-mono text-zinc-500">
                    {med.slot}
                  </span>
                </div>
                <button
                  onClick={() => toggleMed(med.id)}
                  className={`text-xs font-mono px-3 py-1.5 border transition ${
                    med.taken
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300"
                  }`}
                >
                  {med.taken ? "✓ Taken" : "Mark Taken"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical History Timeline */}
        <div className="bg-white border border-zinc-300">
          <div className="px-5 py-3 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-700">
              Medical Record Log
            </span>
            <FileText className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="p-5 space-y-4 font-mono text-xs">
            <div className="border-l-2 border-zinc-900 pl-4 space-y-1">
              <span className="text-zinc-400">2026-08-19 • LAB REPORT</span>
              <p className="font-sans text-sm font-medium text-zinc-900">
                HbA1c Glycated Hemoglobin: 6.8%
              </p>
              <p className="text-zinc-500 font-sans">
                Uploaded by PHC Diagnostic Wing
              </p>
            </div>
            <div className="border-l-2 border-zinc-300 pl-4 space-y-1">
              <span className="text-zinc-400">
                2026-07-11 • CLINICAL CONSULT
              </span>
              <p className="font-sans text-sm font-medium text-zinc-900">
                Hypertension Follow-up (BP: 130/85)
              </p>
              <p className="text-zinc-500 font-sans">
                Dr. S. Sharma — Rampur Health Subcenter
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 font-mono uppercase">
              Request PHC Clinic Token
            </h3>
            <form onSubmit={handleBookAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-500 mb-1">
                  Reason for Visit / Spoken Symptoms
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Chronic back pain, prescription refill..."
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-zinc-900 font-sans"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-3 py-2 border border-zinc-300 text-xs font-mono uppercase hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono uppercase"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoOpen && <VideoConsult onClose={() => setIsVideoOpen(false)} />}

      {/* SOS Modal */}
      {isSosOpen && (
        <EmergencyEscalation
          patient={{
            name: user?.name || "Ramesh Patel",
            age: 58,
            bloodGroup: "O+",
            allergies: "Penicillin",
            chronicConditions: "Type-2 Diabetes, Hypertension",
            village: user?.village || "Rampur Subcenter Sector 4",
            ashaContact: "+919876543210",
          }}
          onClose={() => setIsSosOpen(false)}
        />
      )}
    </div>
  );
}
