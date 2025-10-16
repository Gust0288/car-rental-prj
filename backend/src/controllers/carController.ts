import { Request, Response } from "express";
import { pool } from "../config/database.js";

export const getAllCars = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByMake = async (req: Request, res: Response) => {
  const { make } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(make) = LOWER($1) 
       ORDER BY id ASC`,
      [make]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cars by make:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByYear = async (req: Request, res: Response) => {
  const { year } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE year = $1 
       ORDER BY id ASC`,
      [year]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cars by year:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByClass = async (req: Request, res: Response) => {
  const { class: carClass } = req.params;

  // Remove all spaces from the class parameter
  const cleanClassName = carClass.replace(/\s+/g, "");

  try {
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(REPLACE(class, ' ', '')) = LOWER($1) 
       ORDER BY id ASC`,
      [cleanClassName]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cars by class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByFuelType = async (req: Request, res: Response) => {
  const { fuelType } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(fuel_type) = LOWER($1) 
       ORDER BY id ASC`,
      [fuelType]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cars by fuel type:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByDrive = async (req: Request, res: Response) => {
  const { drive } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(drive) = LOWER($1) 
       ORDER BY id ASC`,
      [drive]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching cars by drive:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
