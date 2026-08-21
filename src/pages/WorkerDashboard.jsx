import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  LogOut,
  Plus,
  Search,
  Shield,
  UserCheck,
  Users,
  Video,
  X,
} from "lucide-react";
import VideoConsult from "../modules/VideoConsult";

export default function WorkerDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeCall, setActiveCall] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState([
    {
      token: "T-014",
      name: "Ramesh Patel",
      age: 58,
      village: "Kalyanpur",
      chiefComplaint: "Hypertension Followup",
      status: "In Waiting Room",
    },
    {
      token: "T-015",
      name: "Sunita Devi",
      age: 42,
      village: "Rampur",
      chiefComplaint: "Insulin Dosage Check",
      status: "Consulting",
    },
    {
      token: "T-016",
      name: "Gopal Verma",
      age: 67,
      village: "Kalyanpur",
      chiefComplaint: "Post-op Dressing",
      status: "Pending",
    },
  ]);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    village: "",
    chiefComplaint: "",
  });

  const handleRegisterPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name) return;

    const entry = {
      token: `T-0${patients.length + 14}`,
      name: newPatient.name,
      age: newPatient.age || "45",
      village: newPatient.village || "Rampur",
      chiefComplaint: newPatient.chiefComplaint || "General Checkup",
      status: "In Waiting Room",
    };

    setPatients([...patients, entry]);
    setIsRegisterOpen(false);
    setNewPatient({ name: "", age: "", village: "", chiefComplaint: "" });
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Staff Header Identity Bar */}
      <div className="bg-white border border-zinc-300 p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-zinc-900 text-base">
                {user?.name || "Dr. S. Sharma (Clinical Staff)"}
              </h2>
              <span className="text-[10px] font-mono bg-zinc-900 text-white px-1.5 py-0.5 uppercase">
                CLINIC ADMIN
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              STAFF ID: {user?.id || "DOC-REG-48821"} • Rampur Primary Subcenter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase px-3 py-2 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Register Walk-in
          </button>
          <button
            onClick={handleLogout}
            className="border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-mono text-xs uppercase px-3 py-2 flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </div>

      {/* Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-zinc-300 border border-zinc-300">
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Live Waiting Queue
          </span>
          <p className="text-2xl font-mono font-bold text-zinc-900 mt-1">
            {patients.length} Patients
          </p>
        </div>
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Completed Consults
          </span>
          <p className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            19 Today
          </p>
        </div>
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Critical Follow-ups
          </span>
          <p className="text-2xl font-mono font-bold text-red-600 mt-1">
            03 Flagged
          </p>
        </div>
        <div className="bg-white p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Subcenter Sync
          </span>
          <p className="text-2xl font-mono font-bold text-cyan-700 mt-1">
            100% Online
          </p>
        </div>
      </div>

      {/* Action Table & Search */}
      <div className="bg-white border border-zinc-300">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-50">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 uppercase font-mono">
              Triage & Queue Desk
            </h3>
            <p className="text-xs text-zinc-500">
              Rampur Health & Wellness Subcenter
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search token, name, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 text-zinc-600 font-mono uppercase border-b border-zinc-200">
              <tr>
                <th className="py-2.5 px-4">Token</th>
                <th className="py-2.5 px-4">Patient Details</th>
                <th className="py-2.5 px-4">Village</th>
                <th className="py-2.5 px-4">Chief Complaint</th>
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
                  <td className="py-3 px-4 text-zinc-600">{p.village}</td>
                  <td className="py-3 px-4 text-zinc-800">
                    {p.chiefComplaint}
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
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
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
                  placeholder="e.g. Maya Sharma"
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
                  <input
                    type="text"
                    placeholder="Rampur"
                    value={newPatient.village}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, village: e.target.value })
                    }
                    className="w-full border border-zinc-300 p-2 text-sm font-sans"
                  />
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
          userName="ASHA Worker / Doctor"
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}
