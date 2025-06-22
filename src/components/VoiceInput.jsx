import React, { useEffect, useState } from "react";

export default function VoiceInput({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  let recognitionRef = null;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(text);
      onTranscript && onTranscript(text);
    };
    recognition.onend = () => setListening(false);
    recognitionRef = recognition;
  }, []);

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      recognitionRef && recognitionRef.stop();
    } else {
      setTranscript("");
      recognitionRef && recognitionRef.start();
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <button onClick={toggle}>
        {listening ? "Stop Listening" : "Speak"}
      </button>
      {transcript && (
        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
          "{transcript}"
        </p>
      )}
    </div>
  );
}
