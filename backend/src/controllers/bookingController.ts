import { Request, Response } from "express";
import { pool, userPool } from "../config/database.js";

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  const {
    car_id,
    user_id,
    pickup_at,
    return_at,
  } = req.body;

  // Validate required fields
  if (!car_id || !user_id || !pickup_at || !return_at) {
    return res.status(400).json({
      error: "Missing required fields: car_id, user_id, pickup_at, return_at",
    });
  }

  // Validate dates
  const pickupDate = new Date(pickup_at);
  const returnDate = new Date(return_at);

  if (isNaN(pickupDate.getTime()) || isNaN(returnDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  if (returnDate <= pickupDate) {
    return res.status(400).json({
      error: "Return date must be after pickup date",
    });
  }

  if (pickupDate < new Date()) {
    return res.status(400).json({
      error: "Pickup date must be in the future",
    });
  }

  try {
    // Check if car is available for the selected dates
    const { rows: conflicts } = await userPool.query(
      `SELECT COUNT(*) as conflict_count
       FROM bookings
       WHERE car_id = $1
       AND status IN ('pending', 'confirmed', 'in_progress')
       AND tstzrange(pickup_at, return_at, '[)') && tstzrange($2::timestamptz, $3::timestamptz, '[)')`,
      [car_id, pickup_at, return_at]
    );

    const hasConflict = parseInt(conflicts[0].conflict_count) > 0;

    if (hasConflict) {
      return res.status(409).json({
        error: "Car is not available for the selected dates",
      });
    }

    // Calculate rental days and price
    const dayMs = 24 * 60 * 60 * 1000;
    const rentalDays = Math.ceil(
      (returnDate.getTime() - pickupDate.getTime()) / dayMs
    );
    const dailyRate = 399; // DKK per day
    const priceTotal = rentalDays * dailyRate;

    // Insert the booking with 'confirmed' status since car is available
    const { rows } = await userPool.query(
      `INSERT INTO bookings (
        car_id, 
        user_id, 
        pickup_at, 
        return_at, 
        status, 
        price_total
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        car_id,
        user_id,
        pickup_at,
        return_at,
        "confirmed", // Set to confirmed if car is available
        priceTotal,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error("Error creating booking:", error);

    // Check for overlap constraint violation
    if (error.code === "23P01") {
      // exclusion_violation
      return res.status(409).json({
        error: "Car is not available for the selected dates",
      });
    }

    // Check for foreign key constraint violation
    if (error.code === "23503") {
      return res.status(404).json({
        error: "Car not found",
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Get bookings from user database
    const { rows: bookings } = await userPool.query(
      `SELECT 
        id,
        car_id,
        user_id,
        pickup_at,
        return_at,
        status,
        price_total,
        created_at,
        updated_at
      FROM bookings
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    // If no bookings, return empty array
    if (bookings.length === 0) {
      return res.json([]);
    }

    // Get car details from cars database
    const carIds = bookings.map(b => b.car_id);
    const { rows: cars } = await pool.query(
      `SELECT id, make, model, year, img_path, car_location
       FROM cars
       WHERE id = ANY($1)`,
      [carIds]
    );

    // Create a map of car details by id
    const carsMap = new Map(cars.map(car => [car.id, car]));

    // Combine booking and car data
    const bookingsWithCarDetails = bookings.map(booking => {
      const car = carsMap.get(booking.car_id) || {};
      return {
        ...booking,
        make: car.make,
        model: car.model,
        year: car.year,
        img_path: car.img_path,
        car_location: car.car_location,
      };
    });

    res.json(bookingsWithCarDetails);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Get booking from user database
    const { rows: bookings } = await userPool.query(
      `SELECT 
        id,
        car_id,
        user_id,
        pickup_at,
        return_at,
        status,
        price_total,
        created_at,
        updated_at
      FROM bookings
      WHERE id = $1`,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookings[0];

    // Get car details from cars database
    const { rows: cars } = await pool.query(
      `SELECT make, model, year, class, fuel_type, img_path, car_location
       FROM cars
       WHERE id = $1`,
      [booking.car_id]
    );

    const car = cars[0] || {};

    // Combine booking and car data
    const bookingWithCarDetails = {
      ...booking,
      make: car.make,
      model: car.model,
      year: car.year,
      class: car.class,
      fuel_type: car.fuel_type,
      img_path: car.img_path,
      car_location: car.car_location,
    };

    res.json(bookingWithCarDetails);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "in_progress",
    "returned",
    "canceled",
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  try {
    const { rows } = await userPool.query(
      `UPDATE bookings 
       SET status = $1, updated_at = now() 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cancel a booking
export const cancelBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { rows } = await userPool.query(
      `UPDATE bookings 
       SET status = 'canceled', updated_at = now() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check car availability for a date range
export const checkAvailability = async (req: Request, res: Response) => {
  const { car_id, pickup_at, return_at } = req.query;

  if (!car_id || !pickup_at || !return_at) {
    return res.status(400).json({
      error: "Missing required parameters: car_id, pickup_at, return_at",
    });
  }

  try {
    const { rows } = await userPool.query(
      `SELECT COUNT(*) as conflict_count
       FROM bookings
       WHERE car_id = $1
       AND status IN ('pending', 'confirmed', 'in_progress')
       AND tstzrange(pickup_at, return_at, '[)') && tstzrange($2::timestamptz, $3::timestamptz, '[)')`,
      [car_id, pickup_at, return_at]
    );

    const isAvailable = parseInt(rows[0].conflict_count) === 0;

    res.json({
      available: isAvailable,
      car_id,
      pickup_at,
      return_at,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all active bookings (for filtering booked cars)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { rows } = await userPool.query(
      `SELECT 
        id,
        car_id,
        user_id,
        pickup_at,
        return_at,
        status,
        price_total,
        created_at,
        updated_at
      FROM bookings
      WHERE status IN ('pending', 'confirmed', 'in_progress')
      ORDER BY created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
