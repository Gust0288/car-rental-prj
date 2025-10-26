// backend/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3001",
      "http://localhost",
    ],
  })
);

// Setup Swagger documentation
setupSwagger(app);

// Routes from modular structure
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
