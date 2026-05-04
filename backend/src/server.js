import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5050;
const app = createApp();

await connectDatabase();

app.listen(port, () => {
  console.log(`Iteanary.ai backend running on http://localhost:${port}`);
});
