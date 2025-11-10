import { Request, Response } from "express";
import { userPool } from "../config/database.js";
import { logger } from "../utils/logger.js";

// List users (admin)
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const { rows } = await userPool.query(
      `SELECT id, username, name, user_last_name, email, admin, user_created_at, user_deleted_at
       FROM public.users
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (error) {
    logger.error("Error listing users", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Soft delete user (admin)
export const softDeleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { rows } = await userPool.query(
      `UPDATE public.users SET user_deleted_at = NOW() WHERE id = $1 AND user_deleted_at IS NULL RETURNING id`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("User soft-deleted by admin", { userId });
    res.json({ message: "User soft-deleted successfully" });
  } catch (error) {
    logger.error("Error soft-deleting user", error, { userId });
    res.status(500).json({ error: "Internal server error" });
  }
};

// Placeholder: list bookings for a user (admin). Adjust query to match your bookings schema.
export const listUserBookings = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Example query - replace with real bookings table/columns
    const { rows } = await userPool.query(
      `SELECT * FROM public.bookings WHERE user_id = $1 ORDER BY id ASC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    logger.error("Error fetching user bookings", error, { userId });
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {};
