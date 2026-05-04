import express from "express";
import cors from "cors";
import itineraryRoutes from "./routes/itineraryRoutes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173"
    })
  );
  app.use(express.json({ limit: "2mb" }));

  app.use("/", itineraryRoutes);

  return app;
}
