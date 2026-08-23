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
  PhoneCall,
} from "lucide-react";
import Peer from "peerjs";

const SHARED_CHAT_KEY = "telehealth_active_consultation_chat";

export default function VideoConsult({
  roomName = "T001",
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
  const [peerConnected, setPeerConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(
    "Initializing WebRTC...",
  );
  const [callEndedMsg, setCallEndedMsg] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const peerInstanceRef = useRef(null);
  const activeCallRef = useRef(null);
  const chatEndRef = useRef(null);

  const isDoctor = userName.includes("Dr.") || userName.includes("Doctor");

  // Normalized Peer IDs
  const cleanRoom =
    (roomName || "t001")
      .toLowerCase()
      .replace(/consultation/g, "")
      .replace(/[^a-z0-9]/g, "") || "t001";

  const myPeerId = isDoctor ? `doc-${cleanRoom}` : `pat-${cleanRoom}`;
  const targetPeerId = isDoctor ? `pat-${cleanRoom}` : `doc-${cleanRoom}`;

  const defaultChat = [
    {
      id: 1,
      sender: "Dr. Rakesh Mohanty",
      text: "Namaste. I can see your record for Rampur Subcenter. How can I help you today?",
      time: "10:55 PM",
    },
  ];

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem(SHARED_CHAT_KEY);
    return saved ? JSON.parse(saved) : defaultChat;
  });

  // 1. Camera & Audio Stream + Peer Connection
  useEffect(() => {
    let peer;

    async function setupMediaAndPeer() {
      try {
        setConnectionStatus("Starting camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setConnectionStatus("Connecting to STUN server...");

        // Free Google STUN Servers (NAT/Firewall Traversal)
        peer = new Peer(myPeerId, {
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" },
            ],
          },
        });
        peerInstanceRef.current = peer;

        peer.on("open", () => {
          setConnectionStatus(
            `Ready. Waiting for ${isDoctor ? "Patient" : "Doctor"}...`,
          );
          setTimeout(() => initiateCall(stream), 1200);
        });

        // Handle Incoming Call
        peer.on("call", (call) => {
          activeCallRef.current = call;
          call.answer(stream);

          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              setPeerConnected(true);
              setConnectionStatus("Direct P2P Video Connected");
            }

            remoteStream.getTracks().forEach((track) => {
              track.onended = () => handleRemoteDisconnect();
            });
          });

          call.on("close", () => handleRemoteDisconnect());
        });

        peer.on("error", (err) => {
          if (err.type === "peer-unavailable") {
            setConnectionStatus(
              `Waiting for ${isDoctor ? "Patient" : "Doctor"} to enter...`,
            );
          }
        });
      } catch (err) {
        console.warn("Camera Error:", err.message);
        setConnectionStatus("Camera access restricted");
      }
    }

    setupMediaAndPeer();

    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (peerInstanceRef.current) {
        peerInstanceRef.current.destroy();
      }
      clearInterval(timer);
    };
  }, [myPeerId, isDoctor]);

  // Handle Call End from Remote Peer
  const handleRemoteDisconnect = () => {
    setPeerConnected(false);
    setCallEndedMsg(`Consultation ended by ${isDoctor ? "Patient" : "Doctor"}`);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Call Initiation
  const initiateCall = (localStream) => {
    const stream = localStream || mediaStreamRef.current;
    if (!peerInstanceRef.current || !stream) return;

    setConnectionStatus(`Dialing ${isDoctor ? "Patient" : "Doctor"}...`);
    const call = peerInstanceRef.current.call(targetPeerId, stream);

    if (call) {
      activeCallRef.current = call;
      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setPeerConnected(true);
          setConnectionStatus("Direct P2P Video Connected");
        }

        remoteStream.getTracks().forEach((track) => {
          track.onended = () => handleRemoteDisconnect();
        });
      });

      call.on("close", () => handleRemoteDisconnect());
    }
  };

  // Chat Sync
  const syncChat = () => {
    const saved = localStorage.getItem(SHARED_CHAT_KEY);
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
      } catch (e) {}
    }
  };

  useEffect(() => {
    syncChat();
    const handleStorage = () => syncChat();
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(syncChat, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const currentList = JSON.parse(
      localStorage.getItem(SHARED_CHAT_KEY) || JSON.stringify(defaultChat),
    );
    const messageObj = {
      id: Date.now(),
      sender: userName,
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

  // Local End Call
  const handleEndCall = () => {
    if (activeCallRef.current) {
      try {
        activeCallRef.current.close();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    localStorage.removeItem(SHARED_CHAT_KEY);
    onClose();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 font-sans">
      <div className="w-full max-w-6xl h-[92vh] max-h-[850px] bg-zinc-950 border border-zinc-800 flex flex-col shadow-2xl overflow-hidden rounded-2xl">
        {/* Top Header (Fixed Height) */}
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-700 text-white font-mono text-xs flex items-center gap-1.5 rounded-lg">
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>MEDISPHERE | P2P ENCRYPTED TELEHEALTH SESSION</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              Status:{" "}
              {peerConnected ? "🟢 Connected" : `🟡 ${connectionStatus}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1 text-xs font-mono text-emerald-400 border border-zinc-700 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>DURATION: {formatTime(callDuration)}</span>
            </div>
            <button
              onClick={handleEndCall}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Stage & Chat Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-800 overflow-hidden min-h-0">
          {/* Main Video Screen (Left 2 Columns) */}
          <div className="lg:col-span-2 bg-zinc-950 p-3 sm:p-4 flex flex-col justify-between relative min-h-0 h-full overflow-hidden">
            {/* Video Viewport Container (Locked Aspect & Overflow) */}
            <div className="flex-1 relative bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden rounded-xl min-h-0">
              {/* REMOTE VIDEO (Pinned to Absolute Inset-0 so it NEVER expands the parent!) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`absolute inset-0 w-full h-full object-cover z-10 ${peerConnected ? "block" : "hidden"}`}
              />

              {/* Call Ended Overlay */}
              {callEndedMsg && (
                <div className="absolute inset-0 bg-black/85 z-40 flex flex-col items-center justify-center gap-2 text-center p-4">
                  <div className="p-3 bg-red-600/30 text-red-500 rounded-full">
                    <PhoneOff className="w-8 h-8" />
                  </div>
                  <strong className="text-white font-mono text-sm uppercase">
                    {callEndedMsg}
                  </strong>
                  <span className="text-xs font-mono text-zinc-400">
                    Closing room...
                  </span>
                </div>
              )}

              {/* Waiting State */}
              {!peerConnected && !callEndedMsg && (
                <div className="flex flex-col items-center gap-3 text-center p-6 max-w-sm z-20">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center animate-pulse">
                    <User className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <strong className="font-mono text-xs uppercase text-zinc-200 block">
                      {isDoctor
                        ? "Waiting for Patient stream..."
                        : "Connecting to Dr. Rakesh Mohanty..."}
                    </strong>
                    <span className="text-[11px] text-zinc-500 font-mono block mt-0.5">
                      {connectionStatus}
                    </span>
                  </div>

                  <button
                    onClick={() => initiateCall()}
                    className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase flex items-center gap-1.5 transition shadow-lg rounded-xl"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Re-Connect Video
                    Stream
                  </button>
                </div>
              )}

              {/* LOCAL SELF-VIEW (Permanently Visible Picture-in-Picture with z-30) */}
              <div className="absolute bottom-3 right-3 w-32 sm:w-44 h-24 sm:h-32 bg-black border-2 border-zinc-700 shadow-2xl overflow-hidden z-30 rounded-xl">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isVideoOff ? "hidden" : "block"}`}
                />
                <span className="absolute bottom-1 left-1 text-[9px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
                  You ({isDoctor ? "Doctor" : "Patient"})
                </span>
              </div>

              {/* Patient Details Badge (Top-Left) */}
              <div className="absolute top-3 left-3 bg-zinc-900/90 border border-zinc-700 p-2.5 backdrop-blur-sm text-white font-mono text-xs space-y-0.5 z-20 rounded-xl">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold">
                    {patientDetails.name}
                  </strong>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                    {patientDetails.token || "T-001"}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />{" "}
                  {patientDetails.village}
                </div>
              </div>
            </div>

            {/* Bottom Call Controls (Permanently Pinned with shrink-0) */}
            <div className="pt-3 flex justify-center items-center gap-4 shrink-0 z-30">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl border transition ${
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
                className={`p-3 rounded-xl border transition ${
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
                onClick={handleEndCall}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition rounded-xl font-bold shadow-lg"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Consultation</span>
              </button>
            </div>
          </div>

          {/* Right Synced Chat */}
          <div className="bg-zinc-900 border-l border-zinc-800 flex flex-col justify-between text-white h-full min-h-0 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 space-y-1 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                Live Consultation Ledger
              </span>
              <p className="text-[11px] text-zinc-400 font-mono">
                Complaint: {patientDetails.complaint}
              </p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs min-h-0">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border ${msg.sender === userName ? "bg-emerald-950/70 border-emerald-700 ml-6 text-white" : "bg-zinc-950/80 border-zinc-800 mr-6 text-zinc-200"}`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1">
                    <strong
                      className={
                        msg.sender === userName
                          ? "text-emerald-400"
                          : "text-zinc-300"
                      }
                    >
                      {msg.sender}
                    </strong>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-zinc-800 flex gap-2 bg-zinc-950 shrink-0"
            >
              <input
                type="text"
                placeholder={
                  isDoctor
                    ? "Type clinical advice..."
                    : "Type message for doctor..."
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-2.5 focus:outline-none focus:border-emerald-500 font-sans rounded-xl"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition rounded-xl"
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
