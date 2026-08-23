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
  theme = "dark",
}) {
  const isDark = theme !== "light";
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
    <div
      className={`rounded-3xl border p-6 md:p-8 space-y-6 font-sans shadow-xl transition-colors ${
        isDark
          ? "border-slate-800 bg-slate-900 text-white"
          : "border-zinc-200 bg-white text-zinc-900 shadow-sm"
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 ${
          isDark ? "border-slate-800" : "border-zinc-200"
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500 font-bold block">
            VERNACULAR ACCESSIBILITY ENGINE
          </span>
          <h3 className="text-lg font-bold mt-0.5">
            {langMode === "hi-IN"
              ? "आवाज द्वारा लक्षण रिकॉर्ड एवं दवा श्रवण"
              : "Vernacular Voice Triage & Spoken Audio"}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setLangMode(langMode === "hi-IN" ? "en-IN" : "hi-IN")}
          className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono rounded-xl transition ${
            isDark
              ? "bg-slate-950 border-slate-700 text-cyan-400 hover:bg-slate-800"
              : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>
            {langMode === "hi-IN" ? "Listening: हिन्दी" : "Listening: English"}
          </span>
        </button>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition text-center ${
            isListening
              ? "bg-red-500/20 border-red-500 text-white animate-pulse"
              : isDark
                ? "bg-slate-950 border-slate-800 hover:border-cyan-400 text-white group"
                : "bg-zinc-50 border-zinc-200 hover:border-cyan-400 text-zinc-900 group"
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
              <MicOff className="w-7 h-7 animate-spin" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </div>
          <div>
            <strong className="block text-sm font-mono uppercase tracking-wider">
              {isListening ? "Listening Now... Speak" : "Tap to Speak Symptoms"}
            </strong>
            <span className="text-xs text-slate-400 block mt-1">
              {langMode === "hi-IN"
                ? 'बोलें (उदा. "सर दर्द" या "डॉक्टर कॉल")'
                : 'Describe symptoms or say "Doctor Call" / "SOS"'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={speakPrescription}
          className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition text-center ${
            isSpeaking
              ? "bg-teal-500/20 border-teal-400 text-white animate-pulse"
              : isDark
                ? "bg-slate-950 border-slate-800 hover:border-teal-400 text-white group"
                : "bg-zinc-50 border-zinc-200 hover:border-teal-400 text-zinc-900 group"
          }`}
        >
          <div
            className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
              isSpeaking
                ? "bg-teal-400 text-slate-950"
                : "bg-teal-400/10 text-teal-400"
            }`}
          >
            <Volume2 className="w-7 h-7" />
          </div>
          <div>
            <strong className="block text-sm font-mono uppercase tracking-wider">
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

      {/* Transcript */}
      {transcript && (
        <div
          className={`p-4 border rounded-2xl space-y-2 ${
            isDark
              ? "bg-slate-950 border-cyan-400/40 text-white"
              : "bg-cyan-50/50 border-cyan-300 text-zinc-900"
          }`}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-500 font-bold block">
                Recorded Patient Symptom
              </span>
              <p className="text-sm font-medium mt-0.5">"{transcript}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
