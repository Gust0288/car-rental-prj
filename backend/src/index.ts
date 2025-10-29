// backend/src/index.ts
import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";
import { pool, userPool } from "./config/database.js";
import bcrypt from "bcrypt";
import { logger } from "./utils/logger.js";

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
app.use("/", routes);

// Authentication endpoints
// signup endpoint
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { username, name, email, password, confirmPassword } = req.body;

    logger.info("Signup attempt", { username, email });

    // Validate required fields
    if (!username || !name || !email || !password || !confirmPassword) {
      logger.warn("Signup failed: missing required fields", {
        username,
        email,
      });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      logger.warn("Signup failed: passwords do not match", { username, email });
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await userPool.query(
      "SELECT id FROM public.users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      logger.warn("Signup failed: user already exists", { username, email });
      return res.status(409).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user (matching the user database schema)
    const result = await userPool.query(
      "INSERT INTO public.users (username, name, user_last_name, email, password, user_created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, username, name, user_last_name, email, user_created_at",
      [username, name, "", email, hashedPassword]
    );

    const newUser = result.rows[0];

    logger.info("User created successfully", {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.user_created_at,
      },
    });
  } catch (error) {
    logger.error("Signup error", error, {
      username: req.body?.username,
      email: req.body?.email,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// login endpoint
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    logger.info("Login attempt", { email });

    // Validate required fields
    if (!email || !password) {
      logger.warn("Login failed: missing credentials", { email });
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const userResult = await userPool.query(
      "SELECT id, username, name, email, password FROM public.users WHERE email = $1 AND user_deleted_at IS NULL",
      [email]
    );

    if (userResult.rows.length === 0) {
      logger.warn("Login failed: user not found", { email });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = userResult.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn("Login failed: invalid password", { email, userId: user.id });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    logger.info("Login successful", {
      email,
      userId: user.id,
      username: user.username,
    });

    // Return user data (without password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Login error", error, { email: req.body?.email });
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API server started`, {
    port: PORT,
    apiUrl: `http://localhost:${PORT}`,
    docsUrl: `http://localhost:${PORT}/api-docs`,
  });
});
