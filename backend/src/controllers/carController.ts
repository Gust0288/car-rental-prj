import { Request, Response } from "express";
import { pool } from "../config/database.js";
import { logger } from "../utils/logger.js";

export const getAllCars = async (req: Request, res: Response) => {
  try {
    logger.info("Fetching all cars");

    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
    const offset = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;

    let baseQuery = `SELECT id, make, model, year, class, city_mpg, highway_mpg, 
              combination_mpg, fuel_type, drive, transmission, 
              cylinders, displacement, img_path, car_location
       FROM public.cars`;

    const params: Array<string | number> = [];

    if (search && search.length > 0) {
      // search across make, model and class (case-insensitive)
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      baseQuery += ` WHERE make ILIKE $1 OR model ILIKE $2 OR class ILIKE $3`;
    }

    baseQuery += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit);
    params.push(offset);

    const { rows } = await pool.query(baseQuery, params as any[]);

    logger.info("Successfully fetched cars", { count: rows.length });
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
