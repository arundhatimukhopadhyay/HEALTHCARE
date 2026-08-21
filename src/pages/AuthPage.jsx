import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Lock,
  MapPin,
  Pill,
  Shield,
  User,
  Users,
} from "lucide-react";
import { apiRequest } from "../api/client";

export default function AuthPage({ onLogin }) {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "patient";

  const [role, setRole] = useState(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    village: "",
    pin: "",
    uuid: "",
  });

  const navigate = useNavigate();

  // All Real Database Profiles Seeded in Supabase
  const databasePatients = [
    {
      id: "PAT001",
      uuid: "2103e7ac-8ab0-47ec-8173-d009a44a6ecc",
      name: "Rahul Das",
      village: "Rampur",
      pin: "demo_hash_001",
      tag: "Hypertension • 2 Active Prescriptions",
    },
    {
      id: "PAT002",
      uuid: "12a10d6d-558a-4b6f-bf76-443e383f1971",
      name: "Priya Sahu",
      village: "Haripur",
      pin: "demo_hash_002",
      tag: "Asthma/Allergy • 2 Active Prescriptions",
    },
    {
      id: "PAT003",
      uuid: "a421f721-fd4d-4a33-983d-df99fda8b091",
      name: "Amit Behera",
      village: "Gopinathpur",
      pin: "demo_hash_003",
      tag: "Respiratory • Cough Syrup",
    },
    {
      id: "PAT004",
      uuid: "30f3dc99-0846-4e9b-981c-4aa4d437d8f5",
      name: "Sneha Rout",
      village: "Nandapur",
      pin: "demo_hash_004",
      tag: "Post-Op Fever • Paracetamol",
    },
  ];

  const databaseDoctors = [
    {
      id: "DOC001",
      uuid: "9f727758-501d-4b50-8363-6ccc93fd2994",
      name: "Dr. Rakesh Mohanty",
      village: "Rampur PHC",
      pin: "demo_hash_001",
      roleTag: "Medical Officer",
    },
    {
      id: "DOC002",
      uuid: "07df9538-2f8d-4971-9c20-576113493e87",
      name: "Dr. Ananya Sharma",
      village: "Haripur Subcenter",
      pin: "demo_hash_002",
      roleTag: "Senior Clinical Staff",
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

  const handleSubmit = async (e) => {
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
    <div className="min-h-[85vh] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white border-2 border-zinc-900 shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-emerald-700" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Live Supabase Database Gateway
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900">
              Community Health Authentication Portal
            </h2>
          </div>
          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1">
            6 Database Profiles Ready
          </span>
        </div>

        {/* 1-Click Database Switcher Catalog */}
        <div className="p-6 bg-zinc-50 border-b border-zinc-200 space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-bold block mb-2">
              🧑 Select Live Patient Profile (4 Seeded in Supabase):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {databasePatients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPersona(p, "patient")}
                  className={`p-3 border text-left transition ${
                    formData.identifier === p.id
                      ? "bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-500"
                      : "bg-white hover:bg-emerald-50 border-zinc-300 text-zinc-900"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <strong className="font-bold text-sm">{p.name}</strong>
                    <span className="text-[10px] font-mono opacity-80 uppercase">
                      {p.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] opacity-90 mt-1 font-mono">
                    <MapPin className="w-3 h-3" /> {p.village}
                  </div>
                  <span className="text-[10px] block mt-1 font-mono text-zinc-500">
                    {formData.identifier === p.id ? "✓ Selected" : p.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold block mb-2">
              👨‍⚕️ Select Clinical Staff / Doctor Profile:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {databaseDoctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => selectPersona(doc, "worker")}
                  className={`p-3 border text-left transition ${
                    formData.identifier === doc.id
                      ? "bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-500"
                      : "bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-900"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <strong className="font-bold text-sm">{doc.name}</strong>
                    <span className="text-[10px] font-mono opacity-80 uppercase">
                      {doc.id}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-90 mt-1 font-mono">
                    📍 {doc.village} • {doc.roleTag}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs font-mono text-zinc-500">
            Active Selection:{" "}
            <strong className="text-zinc-900">
              {formData.name || "Select a profile above"}
            </strong>{" "}
            ({role.toUpperCase()})
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.identifier}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-zinc-300 text-white font-mono text-xs uppercase px-8 py-3.5 flex items-center justify-center gap-2 transition"
          >
            <span>
              Enter as {formData.name ? formData.name.split(" ")[0] : "User"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
