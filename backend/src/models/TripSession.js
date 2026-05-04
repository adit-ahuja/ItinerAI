import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    id: String,
    timeOfDay: String,
    startTime: String,
    endTime: String,
    title: String,
    description: String,
    location: String,
    placeName: String,
    neighborhood: String,
    cost: String,
    icon: String,
    mapHint: String,
    bookingNote: String,
    transitNote: String,
    tags: [String]
  },
  { _id: false }
);

const DaySchema = new mongoose.Schema(
  {
    id: String,
    dayNumber: Number,
    title: String,
    theme: String,
    summary: String,
    weatherHint: String,
    activities: [ActivitySchema]
  },
  { _id: false }
);

const ItinerarySnapshotSchema = new mongoose.Schema(
  {
    versionLabel: String,
    itinerary: mongoose.Schema.Types.Mixed,
    userMessage: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const MessageSchema = new mongoose.Schema(
  {
    role: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const TripSessionSchema = new mongoose.Schema(
  {
    shareId: {
      type: String,
      unique: true,
      index: true
    },
    destination: String,
    tripInput: mongoose.Schema.Types.Mixed,
    itinerary: {
      title: String,
      tripLength: Number,
      overview: String,
      budgetSummary: String,
      travelStyle: String,
      highlights: [String],
      aiSuggestions: [String],
      days: [DaySchema]
    },
    history: [ItinerarySnapshotSchema],
    messages: [MessageSchema],
    lastOpenAIResponseId: String
  },
  {
    timestamps: true
  }
);

export const TripSession = mongoose.models.TripSession || mongoose.model("TripSession", TripSessionSchema);
