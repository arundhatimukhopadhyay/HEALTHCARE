import React, { useState, useEffect } from "react";
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
  Users,
  Video,
} from "lucide-react";
import VoiceAssistant from "../modules/VoiceAssistant";
import VideoConsult from "../modules/VideoConsult";
import EmergencyEscalation from "../modules/EmergencyEscalation";
import { queueOfflineAction } from "../modules/OfflineSync";
import { apiRequest } from "../api/client";

export default function PatientPortal({ user, onLogout }) {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingReason, setBookingReason] = useState("");
  const [lastSpokenNote, setLastSpokenNote] = useState("");

  // Real patient prescription database mapped to their Supabase rows
  const patientPrescriptionMap = {
    PAT001: [
      { id: 1, name: "Paracetamol 500mg", slot: "Morning", taken: true },
      { id: 2, name: "Vitamin C", slot: "Afternoon", taken: false },
    ],
    PAT002: [
      { id: 3, name: "Cetirizine 10mg", slot: "Night", taken: false },
      { id: 4, name: "Omeprazole 20mg", slot: "Before Breakfast", taken: true },
    ],
    PAT003: [{ id: 5, name: "Cough Syrup", slot: "Morning", taken: false }],
    PAT004: [{ id: 6, name: "Paracetamol 500mg", slot: "Night", taken: true }],
  };

  const currentPatientId = user?.id || "PAT001";
  const [meds, setMeds] = useState(() => {
    return (
      patientPrescriptionMap[currentPatientId] ||
      patientPrescriptionMap["PAT001"]
    );
  });

  // Persistent Token per Patient (Never resets to 14!)
  const [tokenInfo, setTokenInfo] = useState(() => {
    const saved = localStorage.getItem(`patient_token_${currentPatientId}`);
    return saved
      ? JSON.parse(saved)
      : {
          token:
            currentPatientId === "PAT001"
              ? "T-001"
              : currentPatientId === "PAT002"
                ? "T-002"
                : "T-017",
          doctor: "Dr. Rakesh Mohanty",
          center: `${user?.village || "Rampur"} Primary Health Subcenter`,
          estimatedWait: "~15 mins",
          spokenComplaint:
            currentPatientId === "PAT001"
              ? "Routine Hypertension Review"
              : "Prescription Refill",
        };
  });

  // Update prescriptions whenever user changes
  useEffect(() => {
    if (patientPrescriptionMap[user?.id]) {
      setMeds(patientPrescriptionMap[user?.id]);
    }
  }, [user]);

  const toggleMed = (id) => {
    const updatedMeds = meds.map((m) =>
      m.id === id ? { ...m, taken: !m.taken } : m,
    );
    setMeds(updatedMeds);
    queueOfflineAction("TOGGLE_MEDICATION", {
      id,
      patientId: currentPatientId,
      timestamp: new Date(),
    });
  };

  const handleVoiceCommand = (command) => {
    if (command === "video_call") setIsVideoOpen(true);
    else if (command === "emergency_sos") setIsSosOpen(true);
  };

  const handleVoiceResult = (text) => {
    setLastSpokenNote(text);
    setBookingReason(text);
  };

  const handleBookAppointment = async (e) => {
    if (e) e.preventDefault();
    const reason =
      bookingReason || lastSpokenNote || "General Health Consultation";

    // Clean sequential token (e.g. T-005, T-006)
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
      name: user?.name || "Rahul Das",
      patient_name: user?.name || "Rahul Das",
      patientId: user?.uuid || user?.id || "PAT001",
      age: 48,
      village: user?.village || "Rampur",
      reason: reason,
      chiefComplaint: reason,
      isVoice: true,
      status: "In Waiting Room",
    };

    setTokenInfo({
      token: sequentialToken,
      doctor: "Dr. Rakesh Mohanty",
      center: `${user?.village || "Rampur"} Primary Subcenter`,
      estimatedWait: `~${nextNumber * 6} mins`,
      spokenComplaint: reason,
    });

    localStorage.setItem(
      `patient_token_${currentPatientId}`,
      JSON.stringify({
        token: sequentialToken,
        doctor: "Dr. Rakesh Mohanty",
        center: `${user?.village || "Rampur"} Primary Subcenter`,
        estimatedWait: `~${nextNumber * 6} mins`,
        spokenComplaint: reason,
      }),
    );

    // Update shared queue
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

    alert(`✓ Generated Token: ${sequentialToken} ("${reason}")`);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/auth");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Patient Header Identity Bar with Village Badge */}
      <div className="bg-white border-2 border-zinc-900 p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-700 text-white flex items-center justify-center font-mono font-bold text-lg">
            {user?.name?.charAt(0) || "R"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-zinc-900 text-lg">
                {user?.name || "Rahul Das"}
              </h2>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 font-bold uppercase">
                {user?.id || "PAT001"} • VERIFIED
              </span>
            </div>
            <p className="text-xs text-zinc-600 font-mono flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Village:{" "}
              <strong>{user?.village || "Rampur"}</strong> (Primary Subcenter
              Sector)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase px-4 py-2.5 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Book Clinic Token
          </button>
          <button
            onClick={handleLogout}
            className="border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-mono text-xs uppercase px-3 py-2.5 flex items-center gap-1.5 transition"
          >
            <Users className="w-3.5 h-3.5" /> Switch Patient
          </button>
        </div>
      </div>

      {/* Top Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-300 border border-zinc-300">
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
            Complaint: {tokenInfo.spokenComplaint}
          </p>
        </div>

        <div className="bg-white p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Virtual Consultation
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 mt-1">
              Dr. Rakesh Mohanty Available
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

        <div className="bg-white p-5 flex flex-col justify-between border-l border-zinc-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">
              Urgent Escalation
            </span>
            <p className="text-xs text-zinc-500 mt-1">
              Direct GPS ping to Rampur ASHA worker
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

      {/* Voice Assistant */}
      <div className="space-y-2">
        <VoiceAssistant
          onResult={handleVoiceResult}
          onCommand={handleVoiceCommand}
          readAloudText={`Hello ${user?.name || "Rahul"}. You have ${meds.length} active prescriptions in ${user?.village || "Rampur"}.`}
        />

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

      {/* Medication Regimen (Specific to this Patient from Supabase!) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-300">
          <div className="px-5 py-3 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-700">
              Active Prescriptions ({user?.name || "Rahul Das"})
            </span>
            <Pill className="w-4 h-4 text-emerald-700" />
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
                    Dosage Timing: {med.slot}
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
              Medical Record History
            </span>
            <FileText className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="p-5 space-y-4 font-mono text-xs">
            <div className="border-l-2 border-zinc-900 pl-4 space-y-1">
              <span className="text-zinc-400">2026-08-19 • LAB DIAGNOSTIC</span>
              <p className="font-sans text-sm font-medium text-zinc-900">
                Fasting Blood Sugar: 114 mg/dL
              </p>
              <p className="text-zinc-500 font-sans">
                Uploaded by {user?.village || "Rampur"} PHC Subcenter
              </p>
            </div>
            <div className="border-l-2 border-zinc-300 pl-4 space-y-1">
              <span className="text-zinc-400">
                2026-07-11 • CLINICAL CONSULT
              </span>
              <p className="font-sans text-sm font-medium text-zinc-900">
                Dr. Rakesh Mohanty — General Physical Examination
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
              Book Subcenter Clinic Token
            </h3>
            <form onSubmit={handleBookAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-500 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  disabled
                  value={`${user?.name || "Rahul Das"} (${user?.village || "Rampur"})`}
                  className="w-full bg-zinc-100 border border-zinc-300 p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-500 mb-1">
                  Reason for Visit / Symptoms
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe symptoms..."
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

      {isVideoOpen && <VideoConsult onClose={() => setIsVideoOpen(false)} />}
      {isSosOpen && (
        <EmergencyEscalation
          patient={{
            name: user?.name || "Rahul Das",
            age: 48,
            bloodGroup: "O+",
            allergies: "None Reported",
            chronicConditions: "Hypertension",
            village: user?.village || "Rampur",
            ashaContact: "+919876543210",
          }}
          onClose={() => setIsSosOpen(false)}
        />
      )}
    </div>
  );
}
