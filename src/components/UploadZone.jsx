import React from "react";

import { useState } from "react";

export default function UploadZone({ onFile }) {
    const [over, setOver] = useState(false);

  function handleFiles(files) {
    if (files && files[0]) {
      onFile(files[0]);
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      style={{
        border: over ? "2px solid #007bff" : "2px dashed #ccc",
        transition: "border 0.2s",
        padding: "3rem",
        borderRadius: "12px",
        textAlign: "center",
        background: over ? "#e8f3ff" : "#fff",
      }}
    >
      <p>Drag & drop a PDF here or click to select</p>
      <input
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        id="fileInput"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        onClick={() => document.getElementById("fileInput").click()}
        style={{ marginTop: "1rem" }}
      >
        Choose File
      </button>
    </div>
  );
}
