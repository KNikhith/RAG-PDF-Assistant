import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env before importing routes
dotenv.config({
  path: path.join(__dirname, ".env"),
});

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

db.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/api/documents", documentRoutes.default);
app.use("/api/ai", aiRoutes.default);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
