
import express from "express";
import { registerUser } from "../controllers/authController";
import { loginUser } from "../controllers/authController";
import { getCurrentUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";


const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

router.post('/register', registerUser);

router.post("/login", loginUser);

export default router;
