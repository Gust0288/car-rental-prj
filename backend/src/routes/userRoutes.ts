import { Router } from "express";
import { 
  signupUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUser 
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Protected routes 
router.get("/profile/:userId", authenticateToken, getUserProfile);
router.put("/profile/:userId", authenticateToken, updateUserProfile);
router.delete("/profile/:userId", authenticateToken, deleteUser);

export default router;