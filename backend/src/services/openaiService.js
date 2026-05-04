import OpenAI from "openai";
import { buildFallbackItinerary } from "./fallbackData.js";
import { repairItineraryQuality, summarizeDestinationProfile } from "./itineraryQuality.js";

const SYSTEM_PROMPT = `You are an expert AI travel planner and assistant.
You will:
Generate travel plans
Modify them based on user input
Rules:
Keep responses structured in JSON
Optimize for real-world travel efficiency
Maintain consistency
Modify only necessary parts when editing
Every day must be meaningfully different from the others
Every activity must include a specific place name and time window
Prefer realistic neighborhoods, routing, and pacing
Return ONLY JSON.`;

const itinerarySchema = {
  name: "travel_itinerary",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "tripLength", "overview", "budgetSummary", "travelStyle", "highlights", "aiSuggestions", "days"],
    properties: {
      title: { type: "string" },
      tripLength: { type: "number" },
      overview: { type: "string" },
      budgetSummary: { type: "string" },
      travelStyle: { type: "string" },
      highlights: { type: "array", items: { type: "string" } },
      aiSuggestions: { type: "array", items: { type: "string" } },
      days: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "dayNumber", "title", "theme", "summary", "weatherHint", "activities"],
          properties: {
            id: { type: "string" },
            dayNumber: { type: "number" },
            title: { type: "string" },
            theme: { type: "string" },
            summary: { type: "string" },
            weatherHint: { type: "string" },
            activities: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "id",
                  "timeOfDay",
                  "startTime",
                  "endTime",
                  "title",
                  "description",
                  "location",
                  "placeName",
                  "neighborhood",
                  "cost",
                  "icon",
                  "mapHint",
                  "bookingNote",
                  "transitNote",
                  "tags"
                ],
                properties: {
                  id: { type: "string" },
                  timeOfDay: { type: "string" },
                  startTime: { type: "string" },
                  endTime: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  placeName: { type: "string" },
                  neighborhood: { type: "string" },
                  cost: { type: "string" },
                  icon: { type: "string" },
                  mapHint: { type: "string" },
                  bookingNote: { type: "string" },
                  transitNote: { type: "string" },
                  tags: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    }
  }
};

let openaiClient;

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function buildGeneratePrompt(input) {
  return `
Create a premium travel itinerary JSON for the following trip.

Input:
${JSON.stringify(input, null, 2)}

Destination grounding:
${summarizeDestinationProfile(input.destination, input.interests || [])}

Requirements:
- Ensure each day has 3 to 5 activities and feels genuinely different
- Use explicit time ranges like 08:00 and 10:30
- Include actual places or clearly plausible named places within the destination
- Keep routing realistic and cluster nearby visits together
- Mix iconic stops with local gems
- Make costs human-readable
- Avoid vague placeholders like "central market" unless absolutely necessary
`;
}

function buildModifyPrompt({ message, itinerary, tripInput, regenerateDay }) {
  return `
Modify an existing itinerary.

Trip input:
${JSON.stringify(tripInput, null, 2)}

Destination grounding:
${summarizeDestinationProfile(tripInput.destination, tripInput.interests || [])}

Current itinerary:
${JSON.stringify(itinerary, null, 2)}

User request:
${message}

${regenerateDay ? `Focus especially on regenerating day ${regenerateDay}.` : "Modify only necessary parts while maintaining consistency elsewhere."}

Requirements:
- Preserve all untouched days as much as possible
- If changing one day, keep the rest coherent
- Keep explicit time ranges and specific place names
- Avoid repeating the same attractions across multiple days unless the user explicitly asks
- Prefer recognized attractions, neighborhoods, museums, markets, parks, and venues over generic labels
`;
}

export async function generateItineraryWithAI(input) {
  const client = getClient();
  if (!client) {
    return { itinerary: buildFallbackItinerary(input), responseId: null };
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: SYSTEM_PROMPT,
      reasoning: { effort: "medium" },
      temperature: 0.8,
      input: buildGeneratePrompt(input),
      text: {
        format: {
          type: "json_schema",
          ...itinerarySchema
        },
        verbosity: "medium"
      }
    });

    return {
      itinerary: repairItineraryQuality(JSON.parse(response.output_text), input),
      responseId: response.id
    };
  } catch (error) {
    console.warn("OpenAI generation failed. Using fallback itinerary.", error.message);
    return { itinerary: buildFallbackItinerary(input), responseId: null };
  }
}

export async function modifyItineraryWithAI(payload) {
  const client = getClient();
  if (!client) {
    return {
      itinerary: buildFallbackItinerary(payload.tripInput, "modify", payload.message),
      responseId: null
    };
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: SYSTEM_PROMPT,
      previous_response_id: payload.previousResponseId || undefined,
      reasoning: { effort: "medium" },
      temperature: 0.6,
      input: buildModifyPrompt(payload),
      text: {
        format: {
          type: "json_schema",
          ...itinerarySchema
        },
        verbosity: "medium"
      }
    });

    return {
      itinerary: repairItineraryQuality(JSON.parse(response.output_text), payload.tripInput, payload.message),
      responseId: response.id
    };
  } catch (error) {
    console.warn("OpenAI modification failed. Using fallback itinerary.", error.message);
    return {
      itinerary: buildFallbackItinerary(payload.tripInput, "modify", payload.message),
      responseId: null
    };
  }
}
