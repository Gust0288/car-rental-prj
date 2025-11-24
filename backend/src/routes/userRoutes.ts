import { Router } from "express";
import { 
  signupUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUser 
} from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Protected routes 
router.get("/profile/:userId", authenticateToken, getUserProfile);
router.put("/profile/:userId", authenticateToken, updateUserProfile);
router.delete("/profile/:userId", authenticateToken, requireAdmin, deleteUser);

export default router;