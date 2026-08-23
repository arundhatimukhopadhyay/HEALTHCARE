import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Filter,
  LogOut,
  MapPin,
  Mic,
  Plus,
  Search,
  Shield,
  UserCheck,
  Users,
  Video,
  Volume2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import VideoConsult from "../modules/VideoConsult";
import { apiRequest } from "../api/client";

export default function WorkerDashboard({ user, onLogout, theme }) {
  const navigate = useNavigate();
  const isDark = theme !== "light";

  const [activeCall, setActiveCall] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [villageFilter, setVillageFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const defaultQueue = [
    {
      token: "T-001",
      name: "Rahul Das",
      age: 48,
      village: "Rampur",
      chiefComplaint: "Hypertension Follow-up",
      isVoice: true,
      status: "In Waiting Room",
      time: "10:30 AM",
    },
    {
      token: "T-002",
      name: "Priya Sahu",
      age: 34,
      village: "Haripur",
      chiefComplaint: "Asthma Inhaler Renewal",
      isVoice: true,
      status: "In Waiting Room",
      time: "11:00 AM",
    },
    {
      token: "T-003",
      name: "Amit Behera",
      age: 62,
      village: "Gopinathpur",
      chiefComplaint: "Persistent Dry Cough",
      isVoice: true,
      status: "In Consultation",
      time: "11:30 AM",
    },
    {
      token: "T-004",
      name: "Sneha Rout",
      age: 29,
      village: "Nandapur",
      chiefComplaint: "Post-Op Dressing & Fever",
      isVoice: true,
      status: "Completed",
      time: "09:00 AM",
    },
  ];

  const [patients, setPatients] = useState(defaultQueue);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    village: "Rampur",
    chiefComplaint: "",
  });

  // Sync with Supabase Cloud
  const syncLiveQueue = async () => {
    try {
      const queueData = await apiRequest("/api/appointments");
      if (queueData && Array.isArray(queueData) && queueData.length > 0) {
        const uniqueMap = new Map();
        defaultQueue.forEach((p) => uniqueMap.set(p.token, p));

        queueData.forEach((item, idx) => {
          const tokenKey = item.token_number || item.token || `T-00${idx + 1}`;
          uniqueMap.set(tokenKey, {
            token: tokenKey,
            name: item.patient_name || item.name || "Rahul Das",
            age: item.age || 48,
            village: item.village || "Rampur",
            chiefComplaint:
              item.reason || item.chiefComplaint || "Clinical Consultation",
            isVoice: true,
            status: item.status || "In Waiting Room",
            time: "10:30 AM",
          });
        });

        const localSaved = JSON.parse(
          localStorage.getItem("community_shared_queue") || "[]",
        );
        localSaved.forEach((local) => {
          if (local.token) uniqueMap.set(local.token, local);
        });

        setPatients(Array.from(uniqueMap.values()));
      }
    } catch (err) {}
  };

  useEffect(() => {
    syncLiveQueue();
    const handleStorage = () => syncLiveQueue();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("shared-queue-updated", handleStorage);
    const interval = setInterval(syncLiveQueue, 3000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("shared-queue-updated", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const playPatientVoiceNote = (complaintText) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(complaintText);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleClearQueue = () => {
    if (window.confirm("Reset queue to baseline patients for the demo?")) {
      setPatients(defaultQueue);
      localStorage.setItem(
        "community_shared_queue",
        JSON.stringify(defaultQueue),
      );
      window.dispatchEvent(new Event("shared-queue-updated"));
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name) return;

    const nextNum = patients.length + 1;
    const tokenTag = `T-00${nextNum}`;

    const entry = {
      token: tokenTag,
      token_number: tokenTag,
      name: newPatient.name,
      patient_name: newPatient.name,
      age: newPatient.age || "45",
      village: newPatient.village || "Rampur",
      reason: newPatient.chiefComplaint || "Walk-in Checkup",
      chiefComplaint: newPatient.chiefComplaint || "Walk-in Checkup",
      isVoice: true,
      status: "In Waiting Room",
      time: "Just Now",
    };

    const updated = [...patients.filter((p) => p.token !== tokenTag), entry];
    setPatients(updated);
    localStorage.setItem("community_shared_queue", JSON.stringify(updated));
    window.dispatchEvent(new Event("shared-queue-updated"));

    setIsRegisterOpen(false);
    setNewPatient({ name: "", age: "", village: "Rampur", chiefComplaint: "" });

    try {
      await apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify(entry),
      });
    } catch (err) {}
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/auth");
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVillage =
      villageFilter === "ALL" ||
      p.village.toLowerCase() === villageFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "ALL" ||
      p.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesVillage && matchesStatus;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-200 px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-8 font-sans ${
        isDark ? "bg-slate-950 text-white" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Top Banner Card */}
      <div
        className={`rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl ${
          isDark
            ? "border-slate-800 bg-slate-900/90"
            : "border-zinc-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Shield size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded-md uppercase border border-cyan-400/20">
                Healthcare Operations
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Shift: 08:00 AM - 04:00 PM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              Clinical Triage Desk{" "}
              <span className="text-sm font-normal text-slate-400">
                ({user?.name || "Dr. Rakesh Mohanty"})
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Sector:{" "}
              <strong>{user?.village || "Rampur Primary Subcenter"}</strong> •
              Live Cloud Sync
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs uppercase font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <Plus size={16} /> Register Walk-in
          </button>
          <button
            onClick={() => navigate("/")}
            className={`font-mono text-xs uppercase px-3.5 py-2.5 rounded-xl border transition ${
              isDark
                ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            Landing Page
          </button>
          <button
            onClick={handleClearQueue}
            className={`font-mono text-xs uppercase px-3.5 py-2.5 rounded-xl border transition ${
              isDark
                ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            Reset
          </button>
          <button
            onClick={handleLogout}
            className={`font-mono text-xs uppercase px-3.5 py-2.5 rounded-xl border transition ${
              isDark
                ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            Switch Doctor
          </button>
        </div>
      </div>

      {/* Metric Glow Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="TOTAL PATIENTS TODAY"
          value={patients.length + 18}
          icon={<Users size={22} />}
          color="#38bdf8"
          isDark={isDark}
        />
        <MetricCard
          label="APPOINTMENTS PENDING"
          value={patients.filter((p) => p.status === "In Waiting Room").length}
          icon={<Clock size={22} />}
          color="#facc15"
          isDark={isDark}
        />
        <MetricCard
          label="COMPLETED VISITS"
          value={19}
          icon={<CheckCircle2 size={22} />}
          color="#2dd4bf"
          isDark={isDark}
        />
        <MetricCard
          label="EMERGENCY ESCALATIONS"
          value={2}
          icon={<AlertTriangle size={22} />}
          color="#f87171"
          isDark={isDark}
        />
      </div>

      {/* Main Triage Queue Table */}
      <div
        className={`rounded-3xl border overflow-hidden shadow-xl ${
          isDark ? "border-slate-800 bg-slate-900" : "border-zinc-200 bg-white"
        }`}
      >
        {/* Table Filter Controls */}
        <div
          className={`p-5 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
            isDark
              ? "border-slate-800 bg-slate-950/50"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search token, patient name, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`text-xs px-3 py-2 rounded-xl border focus:outline-none focus:border-cyan-400 w-64 ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-zinc-300 text-zinc-900"
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Village Selector */}
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className={`text-xs font-mono px-3 py-2 rounded-xl border focus:outline-none ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-zinc-300 text-zinc-900"
              }`}
            >
              <option value="ALL">📍 All Villages ({patients.length})</option>
              <option value="Rampur">Rampur</option>
              <option value="Haripur">Haripur</option>
              <option value="Gopinathpur">Gopinathpur</option>
              <option value="Nandapur">Nandapur</option>
              <option value="Balipatna">Balipatna</option>
            </select>

            {/* Status Tabs */}
            {["ALL", "Waiting", "Consultation", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition ${
                  statusFilter === st
                    ? "bg-cyan-400 text-slate-950 border-cyan-400 font-bold"
                    : isDark
                      ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      : "bg-zinc-100 border-zinc-200 text-zinc-600"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* The Live Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`font-mono uppercase border-b text-[11px] ${
                isDark
                  ? "bg-slate-950/70 border-slate-800 text-slate-400"
                  : "bg-zinc-100 border-zinc-200 text-zinc-600"
              }`}
            >
              <tr>
                <th className="py-3 px-5">Token</th>
                <th className="py-3 px-5">Patient Details</th>
                <th className="py-3 px-5">Village</th>
                <th className="py-3 px-5">Chief Complaint / Voice Note</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDark ? "divide-slate-800" : "divide-zinc-200"}`}
            >
              {filteredPatients.map((p) => (
                <tr
                  key={p.token}
                  className={`transition ${isDark ? "hover:bg-slate-800/50" : "hover:bg-zinc-50"}`}
                >
                  <td className="py-4 px-5 font-mono font-bold text-cyan-400 text-sm">
                    {p.token}
                  </td>
                  <td className="py-4 px-5">
                    <p className="font-bold text-sm">{p.name}</p>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {p.age} yrs
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono">📍 {p.village}</td>

                  {/* Complaint with Working Audio Button */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <strong className="font-medium text-xs">
                        {p.chiefComplaint}
                      </strong>
                      {p.isVoice && (
                        <button
                          onClick={() => playPatientVoiceNote(p.chiefComplaint)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-mono text-[10px] transition shrink-0"
                          title="Listen to Patient Voice Recording"
                        >
                          <Volume2 size={12} /> Listen
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg border font-bold ${
                        p.status === "In Waiting Room"
                          ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                          : p.status === "In Consultation" ||
                              p.status === "Consulting"
                            ? "bg-blue-400/10 text-blue-400 border-blue-400/30"
                            : "bg-emerald-400/10 text-emerald-400 border-emerald-400/30"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* WORKING CALL IN / TELECONSULT BUTTON */}
                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => setActiveCall(p.token)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold rounded-xl transition shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                      title="Launch WebRTC Video Room"
                    >
                      <Video size={14} /> Call In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER WALK-IN MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
              isDark
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-zinc-300 text-zinc-900"
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="font-bold font-mono uppercase text-sm">
                Register Walk-In Patient
              </h3>
              <button onClick={() => setIsRegisterOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRegisterPatient} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Patient Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minati Behera"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white"
                      : "bg-zinc-50 border-zinc-300"
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="42"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className={`w-full p-2.5 rounded-xl border text-xs ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white"
                        : "bg-zinc-50 border-zinc-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Village
                  </label>
                  <select
                    value={newPatient.village}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, village: e.target.value })
                    }
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white"
                        : "bg-zinc-50 border-zinc-300"
                    }`}
                  >
                    <option value="Rampur">Rampur</option>
                    <option value="Haripur">Haripur</option>
                    <option value="Gopinathpur">Gopinathpur</option>
                    <option value="Nandapur">Nandapur</option>
                    <option value="Balipatna">Balipatna</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Chief Complaint
                </label>
                <input
                  type="text"
                  placeholder="Fever & joint pain"
                  value={newPatient.chiefComplaint}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      chiefComplaint: e.target.value,
                    })
                  }
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white"
                      : "bg-zinc-50 border-zinc-300"
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs uppercase font-bold py-3 rounded-xl mt-2 transition"
              >
                Add to Clinic Queue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REAL WORKING VIDEO CONSULTATION MODAL */}
      {activeCall && (
        <VideoConsult
          roomName={activeCall}
          userName={user?.name || "Dr. Rakesh Mohanty"}
          patientDetails={{
            name:
              patients.find((p) => p.token === activeCall)?.name || "Rahul Das",
            age: 48,
            village:
              patients.find((p) => p.token === activeCall)?.village || "Rampur",
            complaint:
              patients.find((p) => p.token === activeCall)?.chiefComplaint ||
              "General Consultation",
            token: activeCall,
          }}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}

function MetricCard({ label, value, icon, color, isDark }) {
  return (
    <div
      className={`rounded-3xl border p-6 transition hover:-translate-y-1 shadow-lg ${
        isDark ? "border-slate-800 bg-slate-900" : "border-zinc-200 bg-white"
      }`}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          {label}
        </p>
        <div
          className="p-2 rounded-xl"
          style={{ color, background: `${color}15` }}
        >
          {icon}
        </div>
      </div>
      <h2 className="text-3xl font-bold font-mono mt-2">{value}</h2>
    </div>
  );
}
