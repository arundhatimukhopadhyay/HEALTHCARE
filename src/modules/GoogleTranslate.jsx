import React from "react";

export default function GoogleTranslate() {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span className="text-zinc-500 uppercase">Lang:</span>
      <div
        id="google_translate_element"
        className="border border-zinc-300 bg-white px-1 py-0.5"
      />
    </div>
  );
}
