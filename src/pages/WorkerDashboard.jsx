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
  X,
} from "lucide-react";
import VideoConsult from "../modules/VideoConsult";
import { apiRequest } from "../../api/client";

export default function WorkerDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeCall, setActiveCall] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [villageFilter, setVillageFilter] = useState("ALL");

  const defaultQueue = [
    {
      token: "T-001",
      name: "Rahul Das",
      age: 48,
      village: "Rampur",
      chiefComplaint: "Hypertension Follow-up",
      isVoice: true,
      status: "In Waiting Room",
    },
    {
      token: "T-002",
      name: "Priya Sahu",
      age: 34,
      village: "Haripur",
      chiefComplaint: "Asthma Inhaler Renewal",
      isVoice: true,
      status: "In Waiting Room",
    },
    {
      token: "T-003",
      name: "Amit Behera",
      age: 62,
      village: "Gopinathpur",
      chiefComplaint: "Persistent Dry Cough",
      isVoice: true,
      status: "Consulting",
    },
    {
      token: "T-004",
      name: "Sneha Rout",
      age: 29,
      village: "Nandapur",
      chiefComplaint: "Post-Op Dressing & Fever",
      isVoice: true,
      status: "Pending",
    },
  ];

  const [patients, setPatients] = useState(defaultQueue);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    village: "Rampur",
    chiefComplaint: "",
  });

  // Single-Pass Sync: Fetches once per tick and deduplicates tokens
  const syncLiveQueue = async () => {
    try {
      const queueData = await apiRequest("/api/appointments");

      if (queueData && Array.isArray(queueData) && queueData.length > 0) {
        const uniqueMap = new Map();

        // 1. Add baseline patients first
        defaultQueue.forEach((p) => uniqueMap.set(p.token, p));

        // 2. Overlay live Supabase database records
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
          });
        });

        // 3. Overlay any fresh local appointments
        const localSaved = JSON.parse(
          localStorage.getItem("community_shared_queue") || "[]",
        );
        localSaved.forEach((local) => {
          if (local.token) uniqueMap.set(local.token, local);
        });

        const mergedList = Array.from(uniqueMap.values());
        setPatients(mergedList);
        return;
      }
    } catch (err) {
      // Offline fallback
      const localSaved = localStorage.getItem("community_shared_queue");
      if (localSaved) {
        try {
          setPatients(JSON.parse(localSaved));
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    syncLiveQueue();

    const handleStorageChange = () => syncLiveQueue();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("shared-queue-updated", handleStorageChange);
    const interval = setInterval(syncLiveQueue, 3000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("shared-queue-updated", handleStorageChange);
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

  // Reset Queue Button
  const handleClearQueue = () => {
    if (window.confirm("Reset queue to baseline 4 patients for the demo?")) {
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
    return matchesSearch && matchesVillage;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Staff Header */}
      <div className="bg-white border-2 border-zinc-900 p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-lg">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-zinc-900 text-lg">
                {user?.name || "Dr. Rakesh Mohanty"}
              </h2>
              <span className="text-[10px] font-mono bg-zinc-900 text-white px-2 py-0.5 uppercase font-bold">
                {user?.id || "DOC001"} • ATTENDING OFFICER
              </span>
            </div>
            <p className="text-xs text-zinc-600 font-mono mt-0.5">
              Sector: <strong>{user?.village || "Rampur PHC Subcenter"}</strong>{" "}
              • Odisha District Health Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase px-3.5 py-2.5 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Register Walk-in
          </button>
          <button
            onClick={handleClearQueue}
            className="border border-zinc-300 hover:bg-red-50 hover:text-red-700 text-zinc-600 font-mono text-xs uppercase px-3 py-2.5 transition"
            title="Reset Queue for Demo"
          >
            Reset Queue
          </button>
          <button
            onClick={handleLogout}
            className="border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-mono text-xs uppercase px-3 py-2.5 flex items-center gap-1.5 transition"
          >
            <Users className="w-3.5 h-3.5" /> Switch Doctor
          </button>
        </div>
      </div>

      {/* Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-zinc-300 border border-zinc-300">
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Active Waiting Queue
          </span>
          <p className="text-2xl font-mono font-bold text-zinc-900 mt-1">
            {patients.length} Patients
          </p>
        </div>
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Completed Today
          </span>
          <p className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            19 Consults
          </p>
        </div>
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Voice-Transcribed Triage
          </span>
          <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">
            {patients.filter((p) => p.isVoice).length} Recorded
          </p>
        </div>
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Supabase Cloud Sync
          </span>
          <p className="text-2xl font-mono font-bold text-cyan-700 mt-1">
            100% Online
          </p>
        </div>
      </div>

      {/* Action Table */}
      <div className="bg-white border border-zinc-300">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-50">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 uppercase font-mono">
              Triage & Queue Desk
            </h3>
            <p className="text-xs text-zinc-500">
              District Health Subcenter Live Ledger
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="border border-zinc-300 bg-white px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-zinc-900"
            >
              <option value="ALL">📍 All Villages ({patients.length})</option>
              <option value="Rampur">Rampur</option>
              <option value="Haripur">Haripur</option>
              <option value="Gopinathpur">Gopinathpur</option>
              <option value="Nandapur">Nandapur</option>
              <option value="Balipatna">Balipatna</option>
            </select>

            <input
              type="text"
              placeholder="Search token, patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 border border-zinc-300 bg-white px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 text-zinc-600 font-mono uppercase border-b border-zinc-200">
              <tr>
                <th className="py-2.5 px-4">Token</th>
                <th className="py-2.5 px-4">Patient Name</th>
                <th className="py-2.5 px-4">Village</th>
                <th className="py-2.5 px-4">Chief Complaint / Triage Note</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans">
              {filteredPatients.map((p) => (
                <tr
                  key={p.token}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                    {p.token}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-zinc-900">{p.name}</p>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {p.age} yrs
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 font-mono">
                    📍 {p.village}
                  </td>

                  <td className="py-3 px-4 text-zinc-800">
                    <div className="flex items-center gap-2">
                      <strong className="font-medium text-zinc-900">
                        {p.chiefComplaint}
                      </strong>
                      {p.isVoice && (
                        <button
                          onClick={() => playPatientVoiceNote(p.chiefComplaint)}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 font-mono text-[10px] transition shrink-0"
                          title="Listen to Patient Voice Recording"
                        >
                          <Volume2 className="w-3 h-3 text-emerald-700" />{" "}
                          Listen
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] px-2 py-0.5 border border-zinc-300 bg-zinc-100 text-zinc-800">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setActiveCall(p.token)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[11px] uppercase transition"
                    >
                      <Video className="w-3 h-3" /> Teleconsult
                    </button>
                    <button className="px-2.5 py-1 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-mono text-[11px] uppercase transition">
                      Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900">
                Register Walk-In Patient
              </h3>
              <button onClick={() => setIsRegisterOpen(false)}>
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <form onSubmit={handleRegisterPatient} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-500 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minati Behera"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                  className="w-full border border-zinc-300 p-2 text-sm font-sans"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="42"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className="w-full border border-zinc-300 p-2 text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1">
                    Village
                  </label>
                  <select
                    value={newPatient.village}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, village: e.target.value })
                    }
                    className="w-full border border-zinc-300 p-2 text-xs font-mono"
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
                <label className="block text-xs font-mono uppercase text-zinc-500 mb-1">
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
                  className="w-full border border-zinc-300 p-2 text-sm font-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase py-2.5 mt-2"
              >
                Add to Clinic Queue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeCall && (
        <VideoConsult
          roomName={`Consultation-${activeCall}`}
          userName={user?.name || "Dr. Rakesh Mohanty"}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}
