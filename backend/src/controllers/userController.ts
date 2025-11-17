import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userPool } from "../config/database.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

// User signup
export const signupUser = async (req: Request, res: Response) => {
  const { username, name, user_last_name, email, password } = req.body;

  try {
    logger.info("User signup attempt", { username, email });
    logger.debug("Using USER_DATABASE_URL", {
      dbUrl: process.env.USER_DATABASE_URL,
    });

    const existingUser = await userPool.query(
      "SELECT id FROM public.users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      logger.warn("Signup failed: User already exists", { email });
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { rows } = await userPool.query(
      `INSERT INTO public.users (username, name, user_last_name, email, password, user_created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, username, name, user_last_name, email, user_created_at`,
      [username, name, user_last_name, email, hashedPassword]
    );

    const newUser = rows[0];

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    logger.info("User signup successful", {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        user_last_name: newUser.user_last_name,
        email: newUser.email,
        user_created_at: newUser.user_created_at,
      },
      token,
    });
  } catch (error) {
    logger.error("Error creating user", error, {
      username: req.body?.username,
      email: req.body?.email,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    logger.info("User login attempt", { email });

    const { rows } = await userPool.query(
      `SELECT id, username, name, user_last_name, email, password, user_created_at, is_admin 
       FROM public.users 
       WHERE email = $1 AND user_deleted_at IS NULL`,
      [email]
    );

    if (rows.length === 0) {
      logger.warn("Login failed: User not found", { email });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn("Login failed: Invalid password", { email, userId: user.id });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    await userPool.query(
      "UPDATE public.users SET user_updated_at = NOW() WHERE id = $1",
      [user.id]
    );

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin === 1,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    logger.info("User login successful", {
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        user_last_name: user.user_last_name,
        email: user.email,
        user_created_at: user.user_created_at,
        is_admin: user.is_admin,
      },
      token,
    });
  } catch (error) {
    logger.error("Error logging in user", error, { email: req.body?.email });
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user profile
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.params;

  try {
    logger.info("Fetching user profile", {
      userId,
      requestingUserId: req.userId,
    });

    // Check if the authenticated user is requesting their own profile
    if (req.userId !== parseInt(userId)) {
      logger.warn("Profile access denied: Forbidden", {
        userId,
        requestingUserId: req.userId,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only access your own profile",
      });
    }

    const { rows } = await userPool.query(
      `SELECT id, username, name, user_last_name, email, user_created_at, user_updated_at 
       FROM public.users 
       WHERE id = $1 AND user_deleted_at IS NULL`,
      [userId]
    );

    if (rows.length === 0) {
      logger.warn("Profile not found", { userId });
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("User profile fetched successfully", { userId });
    res.json(rows[0]);
  } catch (error) {
    logger.error("Error fetching user profile", error, { userId });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.params;
  const { username, name, user_last_name, email } = req.body;

  try {
    logger.info("Updating user profile", {
      userId,
      requestingUserId: req.userId,
    });

    // Check if the authenticated user is updating their own profile
    if (req.userId !== parseInt(userId)) {
      logger.warn("Profile update denied: Forbidden", {
        userId,
        requestingUserId: req.userId,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only update your own profile",
      });
    }

    const { rows } = await userPool.query(
      `UPDATE public.users 
       SET username = $2, name = $3, user_last_name = $4, email = $5, user_updated_at = NOW() 
       WHERE id = $1 AND user_deleted_at IS NULL 
       RETURNING id, username, name, user_last_name, email, user_updated_at`,
      [userId, username, name, user_last_name, email]
    );

    if (rows.length === 0) {
      logger.warn("Profile update failed: User not found", { userId });
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("User profile updated successfully", { userId, username });

    res.json({
      message: "Profile updated successfully",
      user: rows[0],
    });
  } catch (error) {
    logger.error("Error updating user profile", error, { userId });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    logger.info("Deleting user account", {
      userId,
      requestingUserId: req.userId,
    });

    // Check if the authenticated user is deleting their own account
    if (req.userId !== parseInt(userId)) {
      logger.warn("Account deletion denied: Forbidden", {
        userId,
        requestingUserId: req.userId,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own account",
      });
    }

    const { rows } = await userPool.query(
      `UPDATE public.users 
       SET user_deleted_at = NOW() 
       WHERE id = $1 AND user_deleted_at IS NULL 
       RETURNING id`,
      [userId]
    );

    if (rows.length === 0) {
      logger.warn("Account deletion failed: User not found", { userId });
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("User account deleted successfully", { userId });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user", error, { userId });
    res.status(500).json({ error: "Internal server error" });
  }
};
