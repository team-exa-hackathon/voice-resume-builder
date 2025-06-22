import { describe, it, expect } from "vitest";
import { getFeedback } from "./feedback.js";

describe("getFeedback", () => {
  it("returns suggestions when summary missing", async () => {
    const text = "This is a long resume without the keyword React or a header section. ".repeat(30); // ~300 words
    const fb = await getFeedback(text);
    expect(fb.overall).toContain("words");
    expect(fb.suggestions.some((s) => s.toLowerCase().includes("summary"))).toBe(true);
  });

  it("flags word count > 600", async () => {
    const text = "word ".repeat(650);
    const fb = await getFeedback(text);
    expect(fb.suggestions.some((s) => s.toLowerCase().includes("600 words"))).toBe(true);
  });
});
