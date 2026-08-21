import React, { useState } from "react";
import { Mic, MicOff, Volume2, CheckCircle2, Globe } from "lucide-react";

/**
 * HACQUIRE TRADABLE ASSET: Accessible Rural Voice & Audio Companion
 * Features:
 * 1. Speech-to-Text (STT) for illiterate patient symptom logging.
 * 2. Text-to-Speech (TTS) to read prescriptions aloud.
 * 3. Dynamic Indian Language Accent switching (Hindi/English).
 */
export default function VoiceSearch({
  onResult,
  readAloudText = "You have 3 medications today. Your next pill is Metformin at 8:00 AM.",
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [langMode, setLangMode] = useState("en-IN"); // 'hi-IN' or 'en-IN'
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. Speech-to-Text (Patient speaks symptoms)
  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome.",
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

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (onResult) onResult(text);
    };

    recognition.start();
  };

  // 2. Text-to-Speech (App talks back to patient)
  const speakPrescription = () => {
    if (!window.speechSynthesis) {
      alert("Audio synthesis not supported.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(readAloudText);
    utterance.lang = langMode;
    utterance.rate = 0.9; // Slightly slower for clear rural comprehension

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white border-2 border-zinc-900 p-6 space-y-4">
      {/* Accessibility Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">
            Rural Accessibility Assistant
          </span>
          <h3 className="text-base font-bold text-zinc-900">
            {langMode === "hi-IN"
              ? "बोलकर बताएं / आवाज में सुनें"
              : "Voice Symptom & Audio Assistant"}
          </h3>
        </div>

        {/* Voice Language Toggle */}
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

      {/* Main Large Voice Action Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* BIG MIC BUTTON (Speech to Text) */}
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
                ? "माइक दबाकर अपनी परेशानी बताएं"
                : "Speak your symptoms in plain words"}
            </span>
          </div>
        </button>

        {/* BIG SPEAKER BUTTON (Text to Speech - Audio Readout) */}
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
                : "Listen to your daily medication schedule"}
            </span>
          </div>
        </button>
      </div>

      {/* Transcript Feedback Box */}
      {transcript && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
              Recorded Patient Complaint
            </span>
            <p className="text-sm font-medium text-zinc-900 mt-0.5">
              "{transcript}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
