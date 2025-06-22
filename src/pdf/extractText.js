import * as pdfjsLib from "pdfjs-dist";

/**
 * Extracts plain text from every page of a PDF.js document.
 * @param {pdfjsLib.PDFDocumentProxy} pdf - Loaded PDF document proxy
 * @returns {Promise<string>} - concatenated text of all pages
 */
export async function extractText(pdf) {
  const numPages = pdf.numPages;
  const pageTexts = [];
  for (let i = 1; i <= numPages; i++) {
    // eslint-disable-next-line no-await-in-loop
    const page = await pdf.getPage(i);
    // eslint-disable-next-line no-await-in-loop
    const { items } = await page.getTextContent();
    const pageText = items.map((it) => it.str).join(" ");
    pageTexts.push(pageText);
  }
  return pageTexts.join("\n\n");
}
