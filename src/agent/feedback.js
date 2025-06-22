/*
 * Mock conversational résumé feedback agent.
 * In production, replace `mockFeedback` with a call to your LLM provider
 * (e.g., OpenAI, Anthropic). Keep the same return structure so the UI code
 * stays unchanged.
 */

/**
 * @typedef {Object} Feedback
 * @property {string} overall - A short overall comment
 * @property {string[]} suggestions - Actionable bullet-point suggestions
 */

/**
 * Generate résumé feedback (mock implementation).
 * @param {string} resumeText – full plain-text résumé
 * @returns {Promise<Feedback>}
 */
export async function getFeedback(resumeText) {
  // quick mock: count words and flag if summary is missing "SUMMARY" keyword
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const hasSummary = /summary/i.test(resumeText.slice(0, 500));

  const suggestions = [];
  if (!hasSummary) suggestions.push("Add a concise summary section at the top.");
  if (wordCount > 600) suggestions.push("Try trimming content to under two pages (~600 words).");
  if (!/react/i.test(resumeText)) suggestions.push("Highlight your React experience explicitly.");
  if (suggestions.length === 0) suggestions.push("Overall, the résumé structure looks solid. Focus on quantifying impact.");

  return {
    overall: `Detected ~${wordCount} words${hasSummary ? " and a summary section." : "."}`,
    suggestions,
  };
}
