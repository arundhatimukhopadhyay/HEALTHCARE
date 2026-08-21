import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Activity,
  X,
  ShieldAlert,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function EmergencyEscalation({
  patient = {
    name: "Ramesh Patel",
    age: 58,
    bloodGroup: "O+",
    allergies: "Penicillin",
    chronicConditions: "Type-2 Diabetes, Hypertension",
    village: "Rampur Subcenter Sector 4",
    ashaContact: "+919876543210",
  },
  onClose,
}) {
  const [stage, setStage] = useState("countdown"); // 'countdown' | 'dispatched'
  const [countdown, setCountdown] = useState(5);
  const [coords, setCoords] = useState({ lat: 20.2961, lng: 85.8245 });
  const [isSirenOn, setIsSirenOn] = useState(true);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  // 1. Grab Real GPS Coordinates
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("GPS access denied, using subcenter default."),
      );
    }
  }, []);

  // 2. 5-Second Safety Abort Countdown
  useEffect(() => {
    let timer;
    if (stage === "countdown" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (stage === "countdown" && countdown === 0) {
      setStage("dispatched");
      startSiren();
    }
    return () => clearTimeout(timer);
  }, [countdown, stage]);

  // 3. Web Audio Dual-Tone Siren
  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      // Alternate pitch every 400ms
      let high = true;
      const interval = setInterval(() => {
        if (!osc) return;
        osc.frequency.setValueAtTime(high ? 960 : 720, ctx.currentTime);
        high = !high;
      }, 400);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioContextRef.current = ctx;
      oscillatorRef.current = { osc, interval };
    } catch (e) {
      console.warn(
        "Audio Context blocked by browser policy until interaction.",
      );
    }
  };

  const stopSiren = () => {
    if (oscillatorRef.current) {
      clearInterval(oscillatorRef.current.interval);
      try {
        oscillatorRef.current.osc.stop();
      } catch (e) {}
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }
    setIsSirenOn(false);
  };

  // Clean up siren on unmount
  useEffect(() => {
    return () => stopSiren();
  }, []);

  // 4. Offline Fallback Message Generator
  const emergencyMessage = `EMERGENCY ALERT: ${patient.name} (${patient.age}y) needs URGENT medical dispatch at GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (${patient.village}). Blood: ${patient.bloodGroup}. Allergies: ${patient.allergies}. Conditions: ${patient.chronicConditions}.`;

  const smsUrl = `sms:${patient.ashaContact}?body=${encodeURIComponent(emergencyMessage)}`;
  const whatsappUrl = `https://wa.me/${patient.ashaContact.replace("+", "")}?text=${encodeURIComponent(emergencyMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border-2 border-red-600 w-full max-w-xl shadow-2xl overflow-hidden font-sans">
        {/* ================= PHASE 1: COUNTDOWN ABORT ================= */}
        {stage === "countdown" && (
          <div className="p-8 text-center space-y-6">
            <div className="inline-block p-4 bg-red-100 rounded-full animate-pulse text-red-600">
              <ShieldAlert className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                TRANSMITTING EMERGENCY SOS
              </h2>
              <p className="text-xs font-mono text-zinc-500 uppercase mt-1">
                Broadcasting GPS to ASHA Worker & Primary Health Center in:
              </p>
            </div>

            <div className="text-6xl font-mono font-extrabold text-red-600">
              00:0{countdown}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  stopSiren();
                  onClose();
                }}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-wider py-4 transition"
              >
                ✕ Cancel / Accidental Tap
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 2: ACTIVE ESCALATION PROTOCOL ================= */}
        {stage === "dispatched" && (
          <div className="divide-y divide-zinc-200">
            {/* Header */}
            <div className="p-5 bg-red-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white text-red-600">
                  <ShieldAlert className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase font-mono tracking-wider">
                    Tier-3 Escalation Live
                  </h3>
                  <p className="text-[11px] text-red-100 font-mono">
                    Beacon active • Coordinates locked
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isSirenOn) stopSiren();
                    else startSiren();
                    setIsSirenOn(!isSirenOn);
                  }}
                  className="p-2 bg-red-700 hover:bg-red-800 text-white text-xs font-mono flex items-center gap-1"
                  title="Toggle Siren"
                >
                  {isSirenOn ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    stopSiren();
                    onClose();
                  }}
                  className="p-2 hover:bg-red-700 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* GPS & Location Status */}
            <div className="p-4 bg-zinc-50 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-700">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  GPS:{" "}
                  <strong>
                    {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                  </strong>{" "}
                  ({patient.village})
                </span>
              </div>
              <span className="bg-red-100 text-red-800 px-2 py-0.5 border border-red-300 uppercase">
                Transmitted
              </span>
            </div>

            {/* In Case of Emergency (ICE) Clinical Snapshot */}
            <div className="p-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">
                Critical Medical Snapshot (Transmitted to First Responders)
              </span>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 border border-zinc-300 bg-white">
                  <span className="text-zinc-400 block text-[10px]">
                    BLOOD GROUP
                  </span>
                  <strong className="text-sm font-bold text-red-700">
                    {patient.bloodGroup}
                  </strong>
                </div>
                <div className="p-2.5 border border-zinc-300 bg-white">
                  <span className="text-zinc-400 block text-[10px]">
                    ALLERGIES
                  </span>
                  <strong className="text-zinc-900">{patient.allergies}</strong>
                </div>
                <div className="p-2.5 border border-zinc-300 bg-white">
                  <span className="text-zinc-400 block text-[10px]">
                    CONDITIONS
                  </span>
                  <strong className="text-zinc-900 text-[11px] leading-tight block">
                    {patient.chronicConditions}
                  </strong>
                </div>
              </div>
            </div>

            {/* Multi-Tier Dispatch Protocol Tracking */}
            <div className="p-5 bg-zinc-50 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">
                Active Responder Status
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 bg-white border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tier 1: Local ASHA Worker (Sunita Devi)</span>
                  </div>
                  <span className="text-emerald-700 font-bold">
                    Alerted (~400m)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-white border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tier 2: Rampur Primary Health Center</span>
                  </div>
                  <span className="text-emerald-700 font-bold">
                    Desk Notified
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-white border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Tier 3: 108 Emergency Ambulance Unit</span>
                  </div>
                  <span className="text-amber-700 font-bold">In Queue</span>
                </div>
              </div>
            </div>

            {/* Zero-Connectivity Fallback Actions */}
            <div className="p-5 bg-white space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">
                Offline / Low-Network Fallback Channels
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase py-3 px-4 flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4" /> Send WhatsApp SOS
                </a>

                <a
                  href={smsUrl}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs uppercase py-3 px-4 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" /> Direct SMS to 108
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
