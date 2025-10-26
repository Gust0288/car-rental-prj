import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userPool } from "../config/database.js";

// User signup
export const signupUser = async (req: Request, res: Response) => {
  const { username, name, user_last_name, email, password } = req.body;

  try {
    console.log("Signup attempt - using USER_DATABASE_URL:", process.env.USER_DATABASE_URL);
    
  
    const existingUser = await userPool.query(
      "SELECT id FROM public.users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists with this email" });
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
        email: newUser.email 
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        user_last_name: newUser.user_last_name,
        email: newUser.email,
        user_created_at: newUser.user_created_at
      },
      token
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {

    const { rows } = await userPool.query(
      `SELECT id, username, name, user_last_name, email, password, user_created_at 
       FROM public.users 
       WHERE email = $1 AND user_deleted_at IS NULL`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

 
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

   
    await userPool.query(
      "UPDATE public.users SET user_updated_at = NOW() WHERE id = $1",
      [user.id]
    );

  
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        user_last_name: user.user_last_name,
        email: user.email,
        user_created_at: user.user_created_at
      },
      token
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { rows } = await userPool.query(
      `SELECT id, username, name, user_last_name, email, user_created_at, user_updated_at 
       FROM public.users 
       WHERE id = $1 AND user_deleted_at IS NULL`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { username, name, user_last_name, email } = req.body;

  try {
    const { rows } = await userPool.query(
      `UPDATE public.users 
       SET username = $2, name = $3, user_last_name = $4, email = $5, user_updated_at = NOW() 
       WHERE id = $1 AND user_deleted_at IS NULL 
       RETURNING id, username, name, user_last_name, email, user_updated_at`,
      [userId, username, name, user_last_name, email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: rows[0]
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { rows } = await userPool.query(
      `UPDATE public.users 
       SET user_deleted_at = NOW() 
       WHERE id = $1 AND user_deleted_at IS NULL 
       RETURNING id`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};