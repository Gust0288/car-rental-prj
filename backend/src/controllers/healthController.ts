import { Request, Response } from "express";
import { pool } from "../config/database.js";

export const getHealth = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("select now()");
    res.json({ ok: true, time: rows[0].now });
  } catch (error) {
    console.error("Error in health check:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
