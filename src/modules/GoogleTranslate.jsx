import React, { useEffect } from "react";

/**
 * HACQUIRE TRADABLE ASSET: Standalone Drop-in Multi-Language Engine
 * Zero-config: Automatically injects Google Translate script dynamically.
 */
export default function GoogleTranslate({
  languages = "hi,bn,te,ta,mr,gu,kn,ml,pa,or,en",
  defaultLanguage = "en",
}) {
  useEffect(() => {
    // 1. Define global callback required by Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: defaultLanguage,
            includedLanguages: languages,
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element",
        );
      }
    };

    // 2. Dynamically inject the script if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.type = "text/javascript";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      // If script is already in memory, initialize directly
      window.googleTranslateElementInit();
    }
  }, [languages, defaultLanguage]);

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
