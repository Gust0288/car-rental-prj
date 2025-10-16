import { Router } from "express";
import carRoutes from "./carRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/cars", carRoutes);

export default router;
