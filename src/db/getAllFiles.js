import { openDB } from "./indexedDB.js";

export async function getAllFiles() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const req = tx.objectStore("files").getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
