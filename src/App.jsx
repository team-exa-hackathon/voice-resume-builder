import React, { useEffect } from "react";
import { addFile } from "./db/indexedDB.js";
import UploadZone from "./components/UploadZone.jsx";
import HistoryList from "./components/HistoryList.jsx";
import VoiceInput from "./components/VoiceInput.jsx";
import * as pdfjsLib from "pdfjs-dist";
import { extractText } from "./pdf/extractText.js";
import { getFeedback } from "./agent/feedback.js";
import { speak } from "./agent/speak.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function App() {
  function download(selected) {
    const content = selected.feedback.overall + "\n\n" + selected.feedback.suggestions.join("\n- ");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.name}-feedback.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  const [selected, setSelected] = React.useState(null);
  const [lastFeedback, setLastFeedback] = React.useState(null);
  const handleFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
    const text = await extractText(pdf);
    // greet user using first words
    const firstLine = text.split("\n")[0].trim();
    const nameGuess = firstLine.split(" ").slice(0, 2).join(" ");
    speak(`Résumé received. Hi ${nameGuess || 'there'}, what aspect would you like feedback on first?`);
    console.log(`Extracted ${text.slice(0, 60)}...`);
    const feedback = await getFeedback(text);
    setLastFeedback(feedback);
    addFile({ name: file.name, pages: pdf.numPages, text, feedback, ts: Date.now() });
    const message = feedback.overall + "\n\n" + feedback.suggestions.join(". ");
    alert("Agent Feedback:\n\n" + message);
    speak(message);
  };
    const handleVoice = (t) => {
    if (!lastFeedback) {
      speak("Please upload a résumé first so I can provide feedback.");
      return;
    }
    const lower = t.toLowerCase();
    const match = lastFeedback.suggestions.find((s) => lower.includes("summary") ? s.toLowerCase().includes("summary") : lower.includes("react") ? s.toLowerCase().includes("react") : null);
    if (match) {
      speak(match);
    } else {
      speak("I noted these suggestions: " + lastFeedback.suggestions.join(". "));
    }
  };

  useEffect(() => {
    // simple smoke test: add a dummy record once
    addFile({ created: Date.now(), note: "DB initialized" })
      .then(() => console.log("IndexedDB ready"))
      .catch(console.error);
  }, []);
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Résumé Screener</h1>
      <UploadZone onFile={handleFile} />
          <HistoryList onSelect={(r)=>setSelected(r)} selectedId={selected?.id} />
      <VoiceInput onTranscript={handleVoice} />
      {selected && (
        <div style={{marginTop:'1rem',border:'1px solid #ddd', padding:'1rem'}}>
          <h3>{selected.name} Feedback</h3>
          <p>{selected.feedback.overall}</p>
          <ul>
            {selected.feedback.suggestions.map((s,i)=>(<li key={i}>{s}</li>))}
          </ul>
          <button onClick={()=>download(selected)} style={{marginTop:'0.5rem'}}>Download Feedback</button>
        </div>
      )}
    </div>
  );
}
