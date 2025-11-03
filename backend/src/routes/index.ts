import { Router } from "express";
import carRoutes from "./carRoutes.js";
import healthRoutes from "./healthRoutes.js";
import userRoutes from "./userRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/cars", carRoutes);
router.use("/users", userRoutes);
router.use("/bookings", bookingRoutes);
router.use("/admin", adminRoutes);

export default router;
