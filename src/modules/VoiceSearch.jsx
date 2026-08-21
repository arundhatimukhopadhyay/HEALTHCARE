import React, { useState } from "react";
import { Mic, MicOff, Search } from "lucide-react";

export default function VoiceSearch({
  onResult,
  placeholder = "Search or speak your symptoms...",
}) {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Voice recognition not supported on this browser. Please use Chrome/Edge.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // Default to Hindi-English rural context (or en-IN)
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      if (onResult) onResult(transcript);
    };

    recognition.start();
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (onResult) onResult(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full bg-white border border-zinc-300 text-zinc-900 text-sm px-4 py-2.5 pr-20 focus:outline-none focus:border-zinc-900 transition-colors font-sans"
      />
      <div className="absolute right-1 flex items-center gap-1">
        <button
          type="button"
          onClick={startListening}
          className={`p-1.5 border ${
            isListening
              ? "bg-red-600 text-white border-red-700 animate-pulse"
              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300"
          } transition-colors`}
          title="Speak into microphone"
        >
          {isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
