/* Simple wrapper around the Web Speech API */
export function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech synthesis not supported in this environment");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  window.speechSynthesis.cancel(); // stop any existing speech
  window.speechSynthesis.speak(utterance);
}
