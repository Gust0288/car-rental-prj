import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the JSON file synchronously
const apiSpecPath = join(__dirname, "api-spec.json");
const apiSpec = JSON.parse(readFileSync(apiSpecPath, "utf-8"));

// Update server URL based on environment
const spec = {
  ...apiSpec,
  servers: [
    {
      url:
        process.env.NODE_ENV === "production"
          ? "https://your-production-url.com"
          : "http://localhost:3000",
      description:
        process.env.NODE_ENV === "production"
          ? "Production server"
          : "Development server",
    },
  ],
};

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

  // JSON endpoint for the raw swagger spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });
};

export default spec;
