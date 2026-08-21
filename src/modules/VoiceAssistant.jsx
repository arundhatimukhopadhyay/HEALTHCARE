import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  Globe,
  Sparkles,
} from "lucide-react";

/**
 * HACQUIRE TRADABLE ASSET: Vernacular Voice & Audio Triage Engine
 * - Speech-to-Text: Logs spoken patient symptoms into appointment requests.
 * - Text-to-Speech: Audibly reads prescription dosage schedules.
 * - Voice Routing: Executes commands ("Doctor Call", "SOS") hands-free.
 */
export default function VoiceAssistant({
  onResult,
  onCommand,
  readAloudText = "You have active medications today. Please follow your dosage schedule.",
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [langMode, setLangMode] = useState("en-IN"); // 'hi-IN' or 'en-IN'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [detectedCommand, setDetectedCommand] = useState(null);

  // 1. Speech-to-Text & Command Parser
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

      // Voice Command Routing
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

  // 2. Text-to-Speech Audio Readout
  const speakPrescription = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(readAloudText);
    utterance.lang = langMode;
    utterance.rate = 0.88; // Slower cadence for rural clarity

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white border-2 border-zinc-900 p-6 space-y-4 font-sans shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">
            Rural Accessibility Engine
          </span>
          <h3 className="text-base font-bold text-zinc-900">
            {langMode === "hi-IN"
              ? "आवाज द्वारा लक्षण रिकॉर्ड एवं दवा श्रवण"
              : "Vernacular Voice Triage & Audio Companion"}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setLangMode(langMode === "hi-IN" ? "en-IN" : "hi-IN")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-mono uppercase transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>
            {langMode === "hi-IN" ? "Listening: हिन्दी" : "Listening: English"}
          </span>
        </button>
      </div>

      {/* Main Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Speak Symptoms Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-6 border-2 flex flex-col items-center justify-center gap-3 transition text-center ${
            isListening
              ? "bg-red-600 border-red-700 text-white animate-pulse"
              : "bg-zinc-50 hover:bg-emerald-50 border-zinc-900 hover:border-emerald-700 text-zinc-900"
          }`}
        >
          <div
            className={`p-4 rounded-full ${isListening ? "bg-white text-red-600" : "bg-zinc-900 text-white"}`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-spin" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </div>
          <div>
            <strong className="block text-sm font-mono uppercase tracking-wider">
              {isListening ? "Listening Now... Speak" : "Tap to Speak Symptoms"}
            </strong>
            <span className="text-xs text-zinc-500 block mt-0.5">
              {langMode === "hi-IN"
                ? 'बोलें (उदा. "सर दर्द" या "डॉक्टर कॉल")'
                : 'Speak symptoms or say "Doctor Call" / "SOS"'}
            </span>
          </div>
        </button>

        {/* Read Aloud Button */}
        <button
          type="button"
          onClick={speakPrescription}
          className={`p-6 border-2 flex flex-col items-center justify-center gap-3 transition text-center ${
            isSpeaking
              ? "bg-emerald-700 border-emerald-800 text-white animate-pulse"
              : "bg-zinc-50 hover:bg-zinc-100 border-zinc-900 text-zinc-900"
          }`}
        >
          <div
            className={`p-4 rounded-full ${isSpeaking ? "bg-white text-emerald-700" : "bg-emerald-700 text-white"}`}
          >
            <Volume2 className="w-8 h-8" />
          </div>
          <div>
            <strong className="block text-sm font-mono uppercase tracking-wider">
              {isSpeaking ? "Reading Aloud..." : "Read Prescription Aloud"}
            </strong>
            <span className="text-xs text-zinc-500 block mt-0.5">
              {langMode === "hi-IN"
                ? "दवाइयों का समय आवाज में सुनें"
                : "Listen to daily medication schedule"}
            </span>
          </div>
        </button>
      </div>

      {/* Transcript & Command Banner */}
      {transcript && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 space-y-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                Recorded Patient Triage Symptom
              </span>
              <p className="text-sm font-medium text-zinc-900 mt-0.5">
                "{transcript}"
              </p>
            </div>
          </div>

          {detectedCommand && (
            <div className="flex items-center gap-2 pt-2 border-t border-emerald-200 text-xs font-mono text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>
                Auto-Action Triggered:{" "}
                <strong>{detectedCommand.toUpperCase()}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
