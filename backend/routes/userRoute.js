import express from "express";
import {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js"; // For profile image upload
import authUser from "../middleware/authUser.js"; // Authentication middleware

const userRouter = express.Router();

// ===============================
// User Authentication Routes
// ===============================

// Register a new user
userRouter.post("/register", registerUser);

// Login an existing user
userRouter.post("/login", loginUser);

// ===============================
// Protected Routes (Require authUser middleware)
// ===============================

// Get authenticated user's profile
userRouter.get("/profile", authUser, getProfile);

// Update authenticated user's profile (with optional image upload)
userRouter.put("/profile/update", authUser, upload.single("image"), updateProfile);

export default userRouter;