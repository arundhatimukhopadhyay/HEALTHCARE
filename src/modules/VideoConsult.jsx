import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Activity,
  Send,
  User,
  MapPin,
  MessageSquare,
} from "lucide-react";

const SHARED_CHAT_KEY = "telehealth_active_consultation_chat";

export default function VideoConsult({
  userName = "Patient",
  patientDetails = {
    name: "Rahul Das",
    age: 48,
    village: "Rampur",
    complaint: "Headache and Migraine",
    token: "T-001",
  },
  onClose,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  const defaultChat = [
    {
      id: 1,
      sender: "Dr. Rakesh Mohanty",
      text: "Namaste Rahul ji. I can see your record for Rampur Subcenter. How can I help you today?",
      time: "10:55 PM",
    },
  ];

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem(SHARED_CHAT_KEY);
    return saved ? JSON.parse(saved) : defaultChat;
  });

  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chatEndRef = useRef(null);

  // 1. Camera & Audio Stream
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera running in emulator:", err.message);
      }
    }
    startCamera();

    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      clearInterval(timer);
    };
  }, []);

  // 2. Real-Time Cross-Tab Chat Synchronizer (Fast 500ms Bus)
  const syncChat = () => {
    const saved = localStorage.getItem(SHARED_CHAT_KEY);
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (!localStorage.getItem(SHARED_CHAT_KEY)) {
      localStorage.setItem(SHARED_CHAT_KEY, JSON.stringify(defaultChat));
    }
    syncChat();

    const handleStorage = (e) => {
      if (!e.key || e.key === SHARED_CHAT_KEY) {
        syncChat();
      }
    };

    window.addEventListener("storage", handleStorage);
    // 500ms fast-poll keeps both tabs 100% in sync
    const interval = setInterval(syncChat, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getAudioTracks()
        .forEach((t) => (t.enabled = !t.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getVideoTracks()
        .forEach((t) => (t.enabled = !t.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  // Broadcast Message to Both Tabs
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Read latest from storage to prevent race condition
    const currentList = JSON.parse(
      localStorage.getItem(SHARED_CHAT_KEY) || JSON.stringify(defaultChat),
    );

    const messageObj = {
      id: Date.now(),
      sender: userName || (patientDetails?.name ? patientDetails.name : "User"),
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [...currentList, messageObj];
    localStorage.setItem(SHARED_CHAT_KEY, JSON.stringify(updated));
    setChatMessages(updated);
    setNewMessage("");
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 font-sans">
      <div className="w-full max-w-6xl h-[90vh] bg-zinc-950 border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-700 text-white font-mono text-xs flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>ENCRYPTED TELEHEALTH SESSION</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              Session: Primary Health Subcenter Network
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1 text-xs font-mono text-emerald-400 border border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>DURATION: {formatTime(callDuration)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              title="Close Teleconsult"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-800 overflow-hidden">
          {/* Main Video View (Left 2 Columns) */}
          <div className="lg:col-span-2 bg-zinc-950 p-4 flex flex-col justify-between relative">
            <div className="flex-1 relative bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? "hidden" : "block"}`}
              />

              {isVideoOff && (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <VideoOff className="w-12 h-12" />
                  <span className="font-mono text-xs uppercase">
                    Camera Muted
                  </span>
                </div>
              )}

              {/* Attending Doctor Badge (Top Right) */}
              <div className="absolute top-4 right-4 bg-zinc-900/90 border border-zinc-700 p-3 shadow-lg backdrop-blur-sm text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold font-mono text-xs">
                    DR
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-mono">
                      Dr. Rakesh Mohanty
                    </h5>
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      Attending Medical Officer
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Audio: HD</span>
                  <span className="text-emerald-400">✓ Connected</span>
                </div>
              </div>

              {/* Patient Badge (Bottom Left) */}
              <div className="absolute bottom-4 left-4 bg-zinc-900/90 border border-zinc-700 p-3 backdrop-blur-sm text-white font-mono text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <strong className="text-sm font-bold">
                    {patientDetails.name}
                  </strong>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5">
                    {patientDetails.token || "T-001"}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" /> Village:{" "}
                  {patientDetails.village}
                </div>
              </div>
            </div>

            {/* Bottom Call Controls */}
            <div className="pt-4 flex justify-center items-center gap-4">
              <button
                onClick={toggleMic}
                className={`p-3.5 border transition ${
                  isMuted
                    ? "bg-red-600 border-red-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
                }`}
                title="Mute/Unmute Mic"
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3.5 border transition ${
                  isVideoOff
                    ? "bg-red-600 border-red-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
                }`}
                title="Camera On/Off"
              >
                {isVideoOff ? (
                  <VideoOff className="w-5 h-5" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition"
                title="End Consultation"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Consultation</span>
              </button>
            </div>
          </div>

          {/* Right Synchronized Clinical Chat (Right Column) */}
          <div className="bg-zinc-900 border-l border-zinc-800 flex flex-col justify-between text-white h-full">
            {/* Context Header */}
            <div className="p-4 border-b border-zinc-800 space-y-2 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Live Consultation Ledger
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-800">
                  ● Realtime Live
                </span>
              </div>

              <div className="bg-zinc-950 p-3 border border-zinc-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">PATIENT:</span>
                  <strong>
                    {patientDetails.name} ({patientDetails.age}y)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">VILLAGE:</span>
                  <span>{patientDetails.village}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">COMPLAINT:</span>
                  <span className="text-emerald-400">
                    {patientDetails.complaint}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs min-h-0">
              {chatMessages.map((msg) => {
                const isDoctor =
                  msg.sender.includes("Dr.") ||
                  msg.sender.includes("Doctor") ||
                  msg.role === "doctor";
                return (
                  <div
                    key={msg.id}
                    className={`p-3 border transition ${
                      isDoctor
                        ? "bg-zinc-950 border-emerald-800 text-white"
                        : "bg-emerald-950/60 border-emerald-700 text-emerald-100"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1">
                      <strong
                        className={
                          isDoctor
                            ? "text-emerald-400 font-bold"
                            : "text-zinc-200 font-bold"
                        }
                      >
                        {msg.sender}
                      </strong>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-zinc-800 flex gap-2 bg-zinc-950 shrink-0"
            >
              <input
                type="text"
                placeholder="Type message or clinical advice..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-2.5 focus:outline-none focus:border-emerald-500 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
