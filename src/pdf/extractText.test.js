import { describe, it, expect, vi } from "vitest";
import { extractText } from "./extractText";

// Mock pdfjs-dist
vi.mock("pdfjs-dist", () => {
  return {
    __esModule: true,
    version: "test",
    getDocument: () => ({
      promise: Promise.resolve({
        numPages: 2,
        getPage: async (num) => ({
          getTextContent: async () => ({
            items: [
              { str: num === 1 ? "Hello" : "World" },
              { str: "!" },
            ],
          }),
        }),
      }),
    }),
  };
});

describe("extractText", () => {
  it("concatenates text from all pages", async () => {
    const pdf = await (await import("pdfjs-dist")).getDocument().promise;
    const text = await extractText(pdf);
    expect(text.trim()).toBe("Hello !\n\nWorld !");
  });
});
