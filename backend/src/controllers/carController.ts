import { Request, Response } from "express";
import { pool } from "../config/database.js";
import { logger } from "../utils/logger.js";

export const getAllCars = async (_req: Request, res: Response) => {
  try {
    logger.info("Fetching all cars");
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement, img_path, car_location
       FROM public.cars 
       ORDER BY id ASC`
    );
    logger.info("Successfully fetched all cars", { count: rows.length });
    res.json(rows);
  } catch (error) {
    logger.error("Failed to fetch all cars", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByMake = async (req: Request, res: Response) => {
  const { make } = req.params;

  try {
    logger.info("Fetching cars by make", { make });
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(make) = LOWER($1) 
       ORDER BY id ASC`,
      [make]
    );
    logger.info("Successfully fetched cars by make", {
      make,
      count: rows.length,
    });
    res.json(rows);
  } catch (error) {
    logger.error("Failed to fetch cars by make", error, { make });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByYear = async (req: Request, res: Response) => {
  const { year } = req.params;

  try {
    logger.info("Fetching cars by year", { year });
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE year = $1 
       ORDER BY id ASC`,
      [year]
    );
    logger.info("Successfully fetched cars by year", {
      year,
      count: rows.length,
    });
    res.json(rows);
  } catch (error) {
    logger.error("Failed to fetch cars by year", error, { year });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByClass = async (req: Request, res: Response) => {
  const { class: carClass } = req.params;

  // Remove all spaces from the class parameter
  const cleanClassName = carClass.replace(/\s+/g, "");

  try {
    logger.info("Fetching cars by class", {
      class: carClass,
      cleanClass: cleanClassName,
    });
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(REPLACE(class, ' ', '')) = LOWER($1) 
       ORDER BY id ASC`,
      [cleanClassName]
    );
    logger.info("Successfully fetched cars by class", {
      class: carClass,
      count: rows.length,
    });
    res.json(rows);
  } catch (error) {
    logger.error("Failed to fetch cars by class", error, { class: carClass });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByFuelType = async (req: Request, res: Response) => {
  const { fuelType } = req.params;

  try {
    logger.info("Fetching cars by fuel type", { fuelType });
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(fuel_type) = LOWER($1) 
       ORDER BY id ASC`,
      [fuelType]
    );
    logger.info("Successfully fetched cars by fuel type", {
      fuelType,
      count: rows.length,
    });
    res.json(rows);
  } catch (error) {
    logger.error("Failed to fetch cars by fuel type", error, { fuelType });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByDrive = async (req: Request, res: Response) => {
  const { drive } = req.params;

  try {
    logger.info("Fetching cars by drive type", { drive });
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement 
       FROM public.cars 
       WHERE LOWER(drive) = LOWER($1) 
       ORDER BY id ASC`,
      [drive]
    );
    logger.info("Successfully fetched cars by drive type", {
      drive,
      count: rows.length,
    });
    res.json(rows);
  } catch (error) {
    logger.error("Failed to fetch cars by drive type", error, { drive });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCarsByLocation = async (req: Request, res: Response) => {
  const { location } = req.params;

  try {
    logger.info("Fetching cars by location", { location });
    const { rows } = await pool.query(
      `SELECT id, make, model, year, class, city_mpg, highway_mpg,
              combination_mpg, fuel_type, drive, transmission,
              cylinders, displacement, img_path, car_location
       FROM public.cars
       WHERE LOWER(car_location) = LOWER($1)
       ORDER BY id ASC`,
      [location]
    );
    logger.info("Successfully fetched cars by location", {
      location,
      count: rows.length,
    });
    res.json(rows);
  } catch (error) {
    logger.error("Failed to fetch cars by location", error, { location });
    res.status(500).json({ error: "Internal server error" });
  }
};
