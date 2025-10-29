import { Request, Response } from "express";
import { pool } from "../config/database.js";
import { logger } from "../utils/logger.js";

export const getHealth = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("select now()");
    logger.info("Health check successful", { dbTime: rows[0].now });
    res.json({ ok: true, time: rows[0].now });
  } catch (error) {
    logger.error("Health check failed", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
