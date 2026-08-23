import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  MapPin,
  Shield,
  User,
  Users,
} from "lucide-react";

export default function AuthPage({ onLogin, theme }) {
  const isDark = theme !== "light";
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "patient";

  const [role, setRole] = useState(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "Rahul Das",
    identifier: "PAT001",
    village: "Rampur",
    pin: "demo_hash_001",
    uuid: "2103e7ac-8ab0-47ec-8173-d009a44a6ecc",
  });

  const navigate = useNavigate();

  // All 4 Real Patients in Supabase Database
  const databasePatients = [
    {
      id: "PAT001",
      uuid: "2103e7ac-8ab0-47ec-8173-d009a44a6ecc",
      name: "Rahul Das",
      village: "Rampur",
      pin: "demo_hash_001",
      condition: "Hypertension • 2 Active Prescriptions",
    },
    {
      id: "PAT002",
      uuid: "12a10d6d-558a-4b6f-bf76-443e383f1971",
      name: "Priya Sahu",
      village: "Haripur",
      pin: "demo_hash_002",
      condition: "Asthma/Allergy • 2 Active Prescriptions",
    },
    {
      id: "PAT003",
      uuid: "a421f721-fd4d-4a33-983d-df99fda8b091",
      name: "Amit Behera",
      village: "Gopinathpur",
      pin: "demo_hash_003",
      condition: "Respiratory • Cough Syrup",
    },
    {
      id: "PAT004",
      uuid: "30f3dc99-0846-4e9b-981c-4aa4d437d8f5",
      name: "Sneha Rout",
      village: "Nandapur",
      pin: "demo_hash_004",
      condition: "Post-Op Fever • Paracetamol",
    },
  ];

  // All 2 Real Doctors in Supabase Database
  const databaseDoctors = [
    {
      id: "DOC001",
      uuid: "9f727758-501d-4b50-8363-6ccc93fd2994",
      name: "Dr. Rakesh Mohanty",
      village: "Rampur PHC",
      pin: "demo_hash_001",
      roleTag: "Attending Medical Officer",
    },
    {
      id: "DOC002",
      uuid: "07df9538-2f8d-4971-9c20-576113493e87",
      name: "Dr. Ananya Sharma",
      village: "Haripur Subcenter",
      pin: "demo_hash_002",
      roleTag: "Senior Clinical Supervisor",
    },
  ];

  const selectPersona = (p, pRole) => {
    setRole(pRole);
    setFormData({
      name: p.name,
      identifier: p.id,
      village: p.village,
      pin: p.pin,
      uuid: p.uuid,
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const userObj = {
      name:
        formData.name ||
        (role === "patient" ? "Rahul Das" : "Dr. Rakesh Mohanty"),
      role: role,
      id: formData.identifier || (role === "patient" ? "PAT001" : "DOC001"),
      uuid: formData.uuid || "2103e7ac-8ab0-47ec-8173-d009a44a6ecc",
      village: formData.village || "Rampur",
    };

    if (onLogin) onLogin(userObj);
    navigate(role === "patient" ? "/patient" : "/worker");
    setLoading(false);
  };

  return (
    <div
      className={`min-h-[calc(100vh-75px)] flex items-center justify-center p-4 sm:p-6 transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-white" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl border overflow-hidden shadow-2xl transition-all ${
          isDark ? "border-slate-800 bg-slate-900" : "border-zinc-200 bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
            isDark
              ? "border-slate-800 bg-slate-950/60"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 font-bold">
                <Activity size={16} />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                Live Supabase PostgreSQL Gateway
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Community Health Authentication Portal
            </h2>
          </div>
          <span className="text-xs font-mono bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 px-2.5 py-1 rounded-lg">
            6 Database Profiles Ready
          </span>
        </div>

        {/* 1-Click Database Switcher Catalog */}
        <div
          className={`p-6 border-b space-y-5 ${
            isDark
              ? "border-slate-800 bg-slate-950/40"
              : "border-zinc-200 bg-zinc-50/50"
          }`}
        >
          {/* Patient Profiles */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-2.5">
              🧑 Select Seeded Patient Profile (4 in Supabase):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {databasePatients.map((p) => {
                const isSelected =
                  formData.identifier === p.id && role === "patient";
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPersona(p, "patient")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-bold"
                        : isDark
                          ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                          : "bg-white border-zinc-200 text-zinc-900 hover:border-cyan-400"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-sm">{p.name}</strong>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-slate-950 text-cyan-400"
                            : isDark
                              ? "bg-slate-950 text-slate-400"
                              : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {p.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-1 opacity-80 font-mono">
                      <MapPin size={12} /> {p.village} Village
                    </div>
                    <span
                      className={`text-[10px] block mt-1 font-mono ${
                        isSelected ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {p.condition}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctor Profiles */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-2.5">
              👨‍⚕️ Select Clinical Staff / Doctor Profile:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {databaseDoctors.map((doc) => {
                const isSelected =
                  formData.identifier === doc.id && role === "worker";
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => selectPersona(doc, "worker")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-400 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] font-bold"
                        : isDark
                          ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                          : "bg-white border-zinc-200 text-zinc-900 hover:border-emerald-400"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-sm">{doc.name}</strong>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-slate-950 text-emerald-400"
                            : isDark
                              ? "bg-slate-950 text-slate-400"
                              : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {doc.id}
                      </span>
                    </div>
                    <div className="text-xs opacity-80 mt-1 font-mono">
                      📍 {doc.village} • {doc.roleTag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div
          className={`p-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${
            isDark ? "bg-slate-900" : "bg-white"
          }`}
        >
          <div className="text-xs font-mono text-slate-400">
            Selected Identity:{" "}
            <strong className={isDark ? "text-white" : "text-zinc-900"}>
              {formData.name}
            </strong>{" "}
            ({role.toUpperCase()})
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.identifier || loading}
            className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs uppercase font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            <span>Enter as {formData.name.split(" ")[0]}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
