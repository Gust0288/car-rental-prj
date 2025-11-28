// backend/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";
import { logger } from "./utils/logger.js";

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3001",
  "http://localhost",
].filter((o): o is string => Boolean(o));

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Setup Swagger documentation
setupSwagger(app);

// Routes from modular structure
app.use("/api", routes);
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API server started`, {
    port: PORT,
    apiUrl: `http://localhost:${PORT}`,
    docsUrl: `http://localhost:${PORT}/api-docs`,
  });
});
