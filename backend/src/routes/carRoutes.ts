import { Router } from "express";
import {
  getAllCars,
  getCarsByMake,
  getCarsByYear,
  getCarsByClass,
  getCarsByFuelType,
  getCarsByDrive,
} from "../controllers/carController.js";

const router = Router();

router.get("/", getAllCars);
router.get("/make/:make", getCarsByMake);
router.get("/year/:year", getCarsByYear);
router.get("/class/:class", getCarsByClass);
router.get("/fuel-type/:fuelType", getCarsByFuelType);
router.get("/drive/:drive", getCarsByDrive);

export default router;
