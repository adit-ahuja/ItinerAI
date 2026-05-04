import mongoose from "mongoose";

let isDbConnected = false;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set. Running without persistence.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    isDbConnected = true;
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to in-memory mode.", error.message);
    isDbConnected = false;
    return false;
  }
}

export function databaseAvailable() {
  return isDbConnected;
}
