import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env
dotenv.config({
  path: path.join(__dirname, ".env"),
});

// Import dependencies after loading environment variables
const [express, mongoose, cors, documentRoutes, aiRoutes] = await Promise.all([
  import("express"),
  import("mongoose"),
  import("cors"),
  import("./routes/documentRoutes.js"),
  import("./routes/aiRoutes.js"),
]);

const app = express.default();
const db = mongoose.default;
const corsMiddleware = cors.default;

app.use(corsMiddleware());
app.use(express.default.json());

// MongoDB connection
db.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Backend API routes
app.use("/api/documents", documentRoutes.default);
app.use("/api/ai", aiRoutes.default);

// Frontend production build
const frontendPath = path.resolve(__dirname, "../frontend/dist");

app.use(express.default.static(frontendPath));

// React frontend fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
