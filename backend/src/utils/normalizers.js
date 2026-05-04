export function sanitizeJsonResponse(content) {
  if (!content) return null;

  const stripped = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(stripped);
}

export function buildHistoryEntry(itinerary, userMessage) {
  return {
    versionLabel: userMessage ? `Update: ${userMessage.slice(0, 48)}` : "Initial generation",
    itinerary,
    userMessage,
    createdAt: new Date().toISOString()
  };
}
