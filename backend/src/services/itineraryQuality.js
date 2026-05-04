import { buildFallbackItinerary, getDestinationProfile, normalizeInterest } from "./fallbackData.js";

const GENERIC_PATTERNS = [
  "central market",
  "main park",
  "historic square",
  "design district",
  "city art museum",
  "boutique avenue",
  "cocktail quarter"
];

function normalize(text) {
  return String(text || "").trim().toLowerCase();
}

function isGenericPlace(placeName, destination) {
  const value = normalize(placeName);
  const city = normalize(destination);
  return GENERIC_PATTERNS.some((pattern) => value.includes(pattern)) || value === city || value === `${city} central district`;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function fallbackDayFor(input, dayNumber, request = "") {
  const fallback = buildFallbackItinerary(
    {
      ...input,
      tripLength: dayNumber
    },
    "modify",
    request
  );

  return cloneJson(fallback.days[dayNumber - 1]);
}

export function summarizeDestinationProfile(destination, interests = []) {
  const profile = getDestinationProfile(destination);
  const normalizedInterests = interests.map(normalizeInterest);

  if (!profile) {
    return `Destination: ${destination}. No curated profile is available, so you must still provide specific place names, realistic neighborhoods, and city-appropriate routing.`;
  }

  const suggestedThemes = [...new Set(normalizedInterests)].filter(Boolean);
  const themeLines =
    suggestedThemes.length > 0
      ? suggestedThemes
          .map((theme) => `${theme}: ${(profile.themes[theme] || []).slice(0, 4).join(", ")}`)
          .join("\n")
      : Object.entries(profile.themes)
          .slice(0, 4)
          .map(([theme, places]) => `${theme}: ${places.slice(0, 4).join(", ")}`)
          .join("\n");

  return `Destination: ${destination}
Suggested neighborhoods: ${profile.areas.join(", ")}
Suggested anchors by theme:
${themeLines}`;
}

export function repairItineraryQuality(itinerary, tripInput, request = "") {
  if (!itinerary?.days?.length) {
    return buildFallbackItinerary(tripInput, "modify", request);
  }

  const repaired = cloneJson(itinerary);
  const globalPlaces = new Set();

  repaired.days = repaired.days.map((day, dayIndex) => {
    const theme = normalizeInterest(day.theme || tripInput.interests?.[dayIndex] || "Food");
    const activityCount = Array.isArray(day.activities) ? day.activities.length : 0;
    const uniquePlaces = new Set((day.activities || []).map((activity) => normalize(activity.placeName)));
    const hasGeneric = (day.activities || []).some((activity) => isGenericPlace(activity.placeName, tripInput.destination));
    const tooRepetitive = activityCount > 0 && uniquePlaces.size < Math.max(activityCount - 1, 1);

    if (activityCount < 3 || hasGeneric || tooRepetitive) {
      return fallbackDayFor(
        {
          ...tripInput,
          interests: [theme]
        },
        day.dayNumber || dayIndex + 1,
        request || `Repair day ${day.dayNumber || dayIndex + 1}`
      );
    }

    const duplicateAcrossTrip = day.activities.some((activity) => {
      const key = normalize(activity.placeName);
      const exists = globalPlaces.has(key);
      globalPlaces.add(key);
      return exists;
    });

    if (duplicateAcrossTrip) {
      return fallbackDayFor(
        {
          ...tripInput,
          interests: [theme]
        },
        day.dayNumber || dayIndex + 1,
        request || `Repair duplicate-heavy day ${day.dayNumber || dayIndex + 1}`
      );
    }

    return {
      ...day,
      theme
    };
  });

  return repaired;
}
