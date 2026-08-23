
import React, { useState } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  PhoneCall,
} from "lucide-react";

export default function WorkerDashboard() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    {
      label: "Total Patients Today",
      value: "24",
      icon: Users,
      color: "text-blue-300",
      bgIcon: "bg-blue-500/20 border border-blue-400",
      cardStyle: "bg-slate-800/90 border-2 border-blue-400 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/30",
    },
    {
      label: "Appointments Pending",
      value: "8",
      icon: Clock,
      color: "text-amber-300",
      bgIcon: "bg-amber-500/20 border border-amber-400",
      cardStyle: "bg-slate-800/90 border-2 border-amber-400 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30",
    },
    {
      label: "Completed Visits",
      value: "14",
      icon: CheckCircle2,
      color: "text-teal-300",
      bgIcon: "bg-teal-500/20 border border-teal-400",
      cardStyle: "bg-slate-800/90 border-2 border-teal-400 ring-4 ring-teal-500/20 shadow-lg shadow-teal-500/30",
    },
    {
      label: "Emergency Escalations",
      value: "2",
      icon: AlertTriangle,
      color: "text-rose-300",
      bgIcon: "bg-rose-500/20 border border-rose-400",
      cardStyle: "bg-slate-800/90 border-2 border-rose-400 ring-4 ring-rose-500/20 shadow-lg shadow-rose-500/30",
    },
  ];

  const patientList = [
    {
      id: "PT-94021",
      name: "Alex Morgan",
      time: "10:30 AM",
      type: "Routine Checkup",
      status: "Waiting",
      urgency: "Normal",
      doctor: "Dr. Ananya Sharma",
    },
    {
      id: "PT-88102",
      name: "Rohan Verma",
      time: "11:15 AM",
      type: "Cardiology Follow-up",
      status: "In Consultation",
      urgency: "High",
      doctor: "Dr. Rajesh Kumar",
    },
    {
      id: "PT-77319",
      name: "Sneha Reddy",
      time: "09:00 AM",
      type: "Pediatric Care",
      status: "Completed",
      urgency: "Normal",
      doctor: "Dr. Priya Patel",
    },
    {
      id: "PT-50122",
      name: "Vikram Singh",
      time: "12:00 PM",
      type: "Emergency Chest Pain",
      status: "Waiting",
      urgency: "Emergency",
      doctor: "Dr. Rajesh Kumar",
    },
  ];

  const filteredPatients = patientList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && p.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header with Highlighted Cyan Border */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-2 border-cyan-500/80 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-cyan-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full font-bold border border-teal-400 shadow-sm shadow-teal-500/20">
              Healthcare Staff Operations
            </span>
            <span className="text-xs text-slate-400 font-medium">Shift: Morning (8 AM - 4 PM)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
            Worker Dashboard
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Monitor live patient queues, triage urgent cases, and manage active consultation rooms.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2.5 rounded-xl border-2 border-rose-400 shadow-md shadow-rose-600/40 transition text-sm">
            <PhoneCall className="w-4 h-4" /> Trigger Emergency
          </button>
        </div>
      </div>

      {/* Metrics Stat Panels (Highlighted Glowing Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl transition duration-300 hover:scale-[1.02] ${s.cardStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`p-2.5 rounded-xl ${s.bgIcon} ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mt-4">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Queue & Patient Table Panel with Highlighted Blue/Teal Border */}
      <div className="bg-slate-900 rounded-2xl border-2 border-teal-500/60 shadow-xl shadow-teal-500/10 overflow-hidden">
        {/* Controls Bar: Search & Status Filters */}
        <div className="p-4 sm:p-6 border-b-2 border-teal-500/40 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/80">
          {/* Highlighted Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name or Patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border-2 border-teal-500/60 rounded-xl text-xs focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 bg-slate-950 text-slate-100 placeholder-slate-400 transition"
            />
          </div>

          {/* Highlighted Filter Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-teal-400 shrink-0" />
            {["all", "waiting", "in consultation", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition border-2 ${
                  filter === tab
                    ? "bg-teal-500 text-slate-950 border-teal-300 shadow-md shadow-teal-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-600 hover:border-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-teal-300 text-[11px] font-black uppercase tracking-wider border-b-2 border-teal-500/30">
                <th className="py-4 px-6">Patient</th>
                <th className="py-4 px-6">Time & Type</th>
                <th className="py-4 px-6">Assigned Doctor</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-teal-500/20 divide-slate-800/80 text-xs">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/60 transition">
                  {/* Patient Name & ID */}
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-slate-100">{p.name}</div>
                    <div className="text-[11px] text-teal-400 font-mono mt-0.5">{p.id}</div>
                  </td>

                  {/* Time & Consultation Type */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> {p.time}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{p.type}</div>
                  </td>

                  {/* Assigned Doctor */}
                  <td className="py-4 px-6 font-semibold text-slate-300">
                    {p.doctor}
                  </td>

                  {/* Highlighted Urgency Badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border-2 ${
                        p.urgency === "Emergency"
                          ? "bg-rose-500/20 text-rose-300 border-rose-400 shadow-sm shadow-rose-500/30 animate-pulse"
                          : p.urgency === "High"
                          ? "bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm shadow-amber-500/30"
                          : "bg-slate-800 text-slate-300 border-slate-600"
                      }`}
                    >
                      {p.urgency}
                    </span>
                  </td>

                  {/* Highlighted Status Badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 ${
                        p.status === "Waiting"
                          ? "bg-amber-500/10 text-amber-300 border-amber-400"
                          : p.status === "In Consultation"
                          ? "bg-blue-500/10 text-blue-300 border-blue-400"
                          : "bg-teal-500/10 text-teal-300 border-teal-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Highlighted Action Buttons */}
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl text-xs border-2 border-cyan-500/60 transition shadow-sm">
                      Update Vitals
                    </button>
                    <button className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs border-2 border-teal-300 transition shadow-md shadow-teal-500/30">
                      Call In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}