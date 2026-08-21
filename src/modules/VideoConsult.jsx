import React from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { Video, X } from "lucide-react";

export default function VideoConsult({
  roomName = "CommunityClinicConsultation",
  onClose,
  userName = "Patient",
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-700 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-950 border-b border-zinc-800 text-white">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-mono tracking-wide uppercase">
              Teleconsultation: {roomName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Frame */}
        <div className="flex-1 bg-zinc-900">
          <JaaSMeeting
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: false,
              disableModeratorIndicator: true,
              startScreenSharing: false,
              enableEmailInStats: false,
            }}
            userInfo={{ displayName: userName }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
          />
        </div>
      </div>
    </div>
  );
}
