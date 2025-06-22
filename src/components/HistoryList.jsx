import React, { useEffect, useState } from "react";
import { getAllFiles } from "../db/getAllFiles.js";

export default function HistoryList({ onSelect, selectedId }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAllFiles().then(setRecords).catch(console.error);
  }, []);

  if (!records.length) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Previous Uploads</h2>
      <ul>
        {records.map((r) => (
          <li
            key={r.id}
            onClick={() => onSelect && onSelect(r)}
            style={{
              cursor: "pointer",
              fontWeight: r.id === selectedId ? "bold" : "normal",
            }}
          >
            {r.name} – {r.pages} pages – {new Date(r.ts).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
