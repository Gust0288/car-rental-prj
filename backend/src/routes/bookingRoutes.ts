import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
  getAllBookings,
} from "../controllers/bookingController.js";

const router = Router();

// Create a new booking
router.post("/", createBooking);

// Check car availability
router.get("/availability", checkAvailability);

// Get all active bookings
router.get("/", getAllBookings);

// Get all bookings for a specific user
router.get("/user/:userId", getUserBookings);

// Get a specific booking by ID
router.get("/:id", getBookingById);

// Update booking status
router.patch("/:id/status", updateBookingStatus);

// Cancel a booking
router.patch("/:id/cancel", cancelBooking);

export default router;
