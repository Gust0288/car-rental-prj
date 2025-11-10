import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import {
  listUsers,
  softDeleteUser,
  listUserBookings,
} from "../controllers/adminController.js";

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticateToken, requireAdmin);

// List all users
router.get("/users", listUsers);

// Soft delete a user by id
router.delete("/users/:userId", softDeleteUser);

// List bookings for a user (admin)
router.get("/users/:userId/bookings", listUserBookings);

export default router;
