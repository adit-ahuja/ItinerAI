import express from "express";
import crypto from "node:crypto";
import { TripSession } from "../models/TripSession.js";
import { databaseAvailable } from "../config/db.js";
import { buildHistoryEntry } from "../utils/normalizers.js";
import { generateItineraryWithAI, modifyItineraryWithAI } from "../services/openaiService.js";

const router = express.Router();
const memoryStore = new Map();

function toStoredSession(record) {
  return {
    shareId: record.shareId,
    destination: record.destination,
    tripInput: record.tripInput,
    itinerary: record.itinerary,
    history: record.history,
    messages: record.messages,
    lastOpenAIResponseId: record.lastOpenAIResponseId,
    updatedAt: record.updatedAt || new Date()
  };
}

async function saveSession(session) {
  if (databaseAvailable()) {
    await TripSession.findOneAndUpdate({ shareId: session.shareId }, session, {
      upsert: true,
      new: true
    });
    return session;
  }

  memoryStore.set(session.shareId, session);
  return session;
}

async function readSession(shareId) {
  if (databaseAvailable()) {
    return TripSession.findOne({ shareId }).lean();
  }

  return memoryStore.get(shareId);
}

router.get("/health", (_, res) => {
  res.json({ ok: true, service: "iteanary-ai-backend" });
});

router.post("/generate-itinerary", async (req, res) => {
  try {
    const tripInput = req.body;
    const aiResult = await generateItineraryWithAI(tripInput);
    const itinerary = aiResult.itinerary;
    const shareId = crypto.randomUUID();

    const session = toStoredSession({
      shareId,
      destination: tripInput.destination,
      tripInput,
      itinerary,
      history: [buildHistoryEntry(itinerary)],
      messages: [{ role: "assistant", content: "Initial itinerary generated." }],
      lastOpenAIResponseId: aiResult.responseId || null
    });

    await saveSession(session);

    res.json({
      shareId,
      itinerary,
      history: session.history,
      messages: session.messages
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate itinerary", error: error.message });
  }
});

router.post("/modify-itinerary", async (req, res) => {
  try {
    const { shareId, message, itinerary, tripInput, regenerateDay } = req.body;
    const currentSession = shareId ? await readSession(shareId) : null;
    const baseItinerary = currentSession?.itinerary || itinerary;
    const baseTripInput = currentSession?.tripInput || tripInput;

    if (!baseItinerary || !baseTripInput) {
      return res.status(400).json({ message: "Missing itinerary context." });
    }

    const aiResult = await modifyItineraryWithAI({
      message,
      itinerary: baseItinerary,
      tripInput: baseTripInput,
      regenerateDay,
      previousResponseId: currentSession?.lastOpenAIResponseId
    });
    const updatedItinerary = aiResult.itinerary;

    const updatedSession = toStoredSession({
      shareId: shareId || crypto.randomUUID(),
      destination: baseTripInput.destination,
      tripInput: baseTripInput,
      itinerary: updatedItinerary,
      history: [
        ...(currentSession?.history || []),
        buildHistoryEntry(updatedItinerary, message)
      ],
      messages: [
        ...(currentSession?.messages || []),
        { role: "user", content: message },
        { role: "assistant", content: "Itinerary updated." }
      ],
      lastOpenAIResponseId: aiResult.responseId || currentSession?.lastOpenAIResponseId || null,
      updatedAt: new Date()
    });

    await saveSession(updatedSession);

    res.json({
      shareId: updatedSession.shareId,
      itinerary: updatedItinerary,
      history: updatedSession.history,
      messages: updatedSession.messages
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to modify itinerary", error: error.message });
  }
});

router.get("/itinerary/:shareId", async (req, res) => {
  const session = await readSession(req.params.shareId);

  if (!session) {
    return res.status(404).json({ message: "Itinerary not found." });
  }

  res.json(session);
});

router.post("/save-itinerary", async (req, res) => {
  try {
    const session = req.body;
    await saveSession(toStoredSession(session));
    res.json({ saved: true, shareId: session.shareId });
  } catch (error) {
    res.status(500).json({ message: "Failed to save itinerary", error: error.message });
  }
});

export default router;
