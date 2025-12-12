import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
  getBookedCarIds,
  getAllBookings,
} from "../controllers/bookingController.js";

const router = Router();

// Public routes (no authentication required)
router.get("/availability", checkAvailability);
router.get("/booked-car-ids", getBookedCarIds);

// Protected routes (require authentication)
router.use(authenticateToken);

// User booking operations
router.post("/", createBooking); // Create booking for authenticated user
router.get("/user/:userId", getUserBookings); // Get bookings for specific user (user can only see their own, admin can see any)
router.get("/:id", getBookingById); // Get specific booking (user can only see their own, admin can see any)
router.patch("/:id/cancel", cancelBooking); // Cancel booking (user can only cancel their own, admin can cancel any)

// Admin-only routes
router.get("/", requireAdmin, getAllBookings); // Get all bookings (admin only)
router.patch("/:id/status", requireAdmin, updateBookingStatus); // Update booking status (admin only)

export default router;
