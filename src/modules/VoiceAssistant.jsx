import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  Globe,
  Sparkles,
} from "lucide-react";

export default function VoiceAssistant({
  onResult,
  onCommand,
  readAloudText = "You have active medications today. Please follow your dosage schedule.",
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [langMode, setLangMode] = useState("en-IN");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [detectedCommand, setDetectedCommand] = useState(null);

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech recognition not supported in this browser. Please use Chrome/Edge.",
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMode;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setDetectedCommand(null);
    };
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (onResult) onResult(text);

      const lower = text.toLowerCase();
      if (
        lower.includes("doctor") ||
        lower.includes("call") ||
        lower.includes("वीडियो") ||
        lower.includes("डॉक्टर")
      ) {
        setDetectedCommand("video_call");
        if (onCommand) onCommand("video_call");
      } else if (
        lower.includes("sos") ||
        lower.includes("emergency") ||
        lower.includes("मदद") ||
        lower.includes("खतरा")
      ) {
        setDetectedCommand("emergency_sos");
        if (onCommand) onCommand("emergency_sos");
      }
    };

    recognition.start();
  };

  const speakPrescription = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(readAloudText);
    utterance.lang = langMode;
    utterance.rate = 0.88;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6 font-sans shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            VERNACULAR ACCESSIBILITY ENGINE
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {langMode === "hi-IN"
              ? "आवाज द्वारा लक्षण रिकॉर्ड एवं दवा श्रवण"
              : "Vernacular Voice Triage & Spoken Audio"}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setLangMode(langMode === "hi-IN" ? "en-IN" : "hi-IN")}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 rounded-xl transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>
            {langMode === "hi-IN" ? "Listening: हिन्दी" : "Listening: English"}
          </span>
        </button>
      </div>

      {/* Main Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Speak Symptoms Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition text-center ${
            isListening
              ? "bg-red-500/20 border-red-500 text-white animate-pulse"
              : "bg-slate-950 hover:bg-cyan-400/5 border-slate-800 hover:border-cyan-400 text-white group"
          }`}
        >
          <div
            className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
              isListening
                ? "bg-red-500 text-white"
                : "bg-cyan-400/10 text-cyan-400"
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-spin" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </div>
          <div>
            <strong className="block text-sm font-mono uppercase tracking-wider text-white">
              {isListening ? "Listening Now... Speak" : "Tap to Speak Symptoms"}
            </strong>
            <span className="text-xs text-slate-400 block mt-1">
              {langMode === "hi-IN"
                ? 'बोलें (उदा. "सर दर्द" या "डॉक्टर कॉल")'
                : 'Describe symptoms or say "Doctor Call" / "SOS"'}
            </span>
          </div>
        </button>

        {/* Read Aloud Button */}
        <button
          type="button"
          onClick={speakPrescription}
          className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition text-center ${
            isSpeaking
              ? "bg-teal-500/20 border-teal-400 text-white animate-pulse"
              : "bg-slate-950 hover:bg-teal-400/5 border-slate-800 hover:border-teal-400 text-white group"
          }`}
        >
          <div
            className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
              isSpeaking
                ? "bg-teal-400 text-slate-950"
                : "bg-teal-400/10 text-teal-400"
            }`}
          >
            <Volume2 className="w-8 h-8" />
          </div>
          <div>
            <strong className="block text-sm font-mono uppercase tracking-wider text-white">
              {isSpeaking ? "Reading Aloud..." : "Read Prescriptions Aloud"}
            </strong>
            <span className="text-xs text-slate-400 block mt-1">
              {langMode === "hi-IN"
                ? "दवाइयों का समय आवाज में सुनें"
                : "Listen to daily dosage schedule"}
            </span>
          </div>
        </button>
      </div>

      {/* Transcript Banner */}
      {transcript && (
        <div className="p-4 bg-slate-950 border border-cyan-400/40 rounded-2xl space-y-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Recorded Patient Symptom
              </span>
              <p className="text-sm font-medium text-white mt-0.5">
                "{transcript}"
              </p>
            </div>
          </div>

          {detectedCommand && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs font-mono text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>
                Voice Action Triggered:{" "}
                <strong>{detectedCommand.toUpperCase()}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
