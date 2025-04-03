import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { UserModel, ServiceModel } from "../models/models.js";
import logger from "../middleware/logger.js";

// ================================
// Register a New User
// ================================
export const registerUser = async (req, res) => {
    const { name, phone, age, password } = req.body;

    if (!name || !phone || !age || !password) {
        logger.warn("Register Attempt: Missing required fields");
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields: name, phone, age, and password.",
        });
    }

    try {
        const existingUser = await UserModel.findOne({ phone });
        if (existingUser) {
            logger.info(`Registration Failed. User with phone ${phone} already exists.`);
            return res.status(409).json({
                success: false,
                message: "A user with this phone number already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            name,
            phone,
            age,
            password: hashedPassword,
        });

        const payload = { id: newUser._id, role: newUser.role };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        logger.info(`User Registered: ${phone}`);
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        logger.error("Error during user registration:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
};

// ================================
// User Login
// ================================
export const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        logger.warn("Login Attempt: Missing credentials");
        return res.status(400).json({
            success: false,
            message: "Please provide both phone and password.",
        });
    }

    try {
        const user = await UserModel.findOne({ phone });
        if (!user) {
            logger.info(`Login Failed. User with phone ${phone} not found.`);
            return res.status(404).json({
                success: false,
                message: "User not found. Please register first.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Login Failed. Incorrect password for user: ${phone}`);
            return res.status(401).json({
                success: false,
                message: "Invalid credentials. Please try again.",
            });
        }

        const payload = { id: user._id, role: user.role };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        logger.info(`User Logged In: ${phone}`);
        res.status(200).json({
            success: true,
            message: "Login successful.",
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        logger.error("Error during user login:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
};

// ================================
// Get User Profile
// ================================
export const getProfile = async (req, res) => {
    const { userId } = req.user; // Extracted from `authUser` middleware

    try {
        const user = await UserModel.findById(userId).select("-password");
        if (!user) {
            logger.warn(`Profile Fetch Failed. User not found: ${userId}`);
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully.",
            data: user,
        });
    } catch (error) {
        logger.error("Error fetching user profile:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Could not fetch profile.",
        });
    }
};

// ================================
// Update User Profile
// ================================
export const updateProfile = async (req, res) => {
    const { userId } = req.user; // Extracted from `authUser` middleware
    const { name, age } = req.body;

    try {
        const updates = {};
        if (name) updates.name = name;
        if (age) updates.age = age;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "users",
                public_id: `user_${userId}_profile`,
            });
            updates.profileImage = uploadResult.secure_url;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
        if (!updatedUser) {
            logger.warn(`Profile Update Failed. User not found: ${userId}`);
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        logger.info(`User Profile Updated: ${userId}`);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedUser,
        });
    } catch (error) {
        logger.error("Error updating user profile:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Could not update profile.",
        });
    }
};
