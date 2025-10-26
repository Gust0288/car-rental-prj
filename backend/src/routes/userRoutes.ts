import { Router } from "express";
import { 
  signupUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUser 
} from "../controllers/userController.js";

const router = Router();


router.post("/signup", signupUser);
router.post("/login", loginUser);


router.get("/profile/:userId", getUserProfile);
router.put("/profile/:userId", updateUserProfile);
router.delete("/profile/:userId", deleteUser);

export default router;