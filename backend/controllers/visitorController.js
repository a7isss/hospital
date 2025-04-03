import { v4 as uuidv4 } from "uuid"; // Use uuid to generate unique visitor IDs
import { UserModel, VisitorModel, ServiceModel, CartModel, DoctorModel } from '../models/models.js';

// Controller function to fetch all services
const getAllServices = async (req, res) => {
    try {
        const services = await ServiceModel.find({}); // Fetch all services from the database
        res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            data: services,
        });
    } catch (error) {
        console.error("Error fetching services:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch services",
            error: error.message,
        });
    }
};

module.exports = {
    getAllServices,
    // Export other controllers if necessary
};

// Create a new visitor session
export const createVisitorSession = async (req, res) => {
    try {
        const visitorId = uuidv4(); // Generate a unique ID
        const newVisitor = await VisitorModel.create({
            visitorId,
            sessionData: {}, // Initialize with empty session data
        });

        res.status(201).json({
            success: true,
            visitorId,
            message: "Visitor session created successfully.",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create visitor session.",
            error: err.message,
        });
    }
};

// Get a visitor session
export const getVisitorSession = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor) {
            return res
                .status(404)
                .json({ success: false, message: "Visitor session not found." });
        }

        res.status(200).json({ success: true, visitor });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch visitor session.",
            error: err.message,
        });
    }
};

// Update visitor session data (e.g., cart items)
export const updateVisitorSession = async (req, res) => {
    const { visitorId } = req.params;
    const { sessionData } = req.body;

    try {
        const visitor = await VisitorModel.findOneAndUpdate(
            { visitorId },
            { sessionData },
            { new: true } // Return the updated document
        );

        if (!visitor) {
            return res
                .status(404)
                .json({ success: false, message: "Visitor session not found." });
        }

        res.status(200).json({
            success: true,
            visitor,
            message: "Visitor session updated successfully.",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update visitor session.",
            error: err.message,
        });
    }
};

// Delete a visitor session
export const deleteVisitorSession = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOneAndDelete({ visitorId });
        if (!visitor) {
            return res
                .status(404)
                .json({ success: false, message: "Visitor session not found." });
        }

        res.status(200).json({
            success: true,
            message: "Visitor session deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete visitor session.",
            error: err.message,
        });
    }
};

// Fetch the visitor cart
export const getVisitorCart = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor || !visitor.sessionData.cart) {
            return res
                .status(404)
                .json({ success: false, message: "Visitor session or cart not found." });
        }

        res.status(200).json({
            success: true,
            message: "Visitor cart fetched successfully.",
            cart: visitor.sessionData.cart,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch visitor cart.",
            error: err.message,
        });
    }
};

// Add item to visitor cart
export const addToVisitorCart = async (req, res) => {
    const { visitorId } = req.params;
    const { itemId, name, price, quantity } = req.body;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor) {
            return res.status(404).json({ success: false, message: "Visitor session not found." });
        }

        if (!visitor.sessionData.cart) {
            visitor.sessionData.cart = [];
        }

        // Check if item is already in the cart
        const existingItem = visitor.sessionData.cart.find(
            (item) => item.itemId === itemId
        );
        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            visitor.sessionData.cart.push({
                itemId,
                name,
                price,
                quantity: quantity || 1,
            });
        }

        await visitor.save();

        return res.status(200).json({
            success: true,
            message: "Item added to visitor's cart successfully.",
            cart: visitor.sessionData.cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add item to visitor cart.",
            error: error.message,
        });
    }
};

// Remove item from visitor cart
export const removeFromVisitorCart = async (req, res) => {
    const { visitorId } = req.params;
    const { itemId } = req.body;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor || !visitor.sessionData.cart) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Visitor session or cart not found.",
                });
        }

        visitor.sessionData.cart = visitor.sessionData.cart.filter(
            (item) => item.itemId !== itemId
        );
        await visitor.save();

        return res.status(200).json({
            success: true,
            message: "Item removed from visitor cart successfully.",
            cart: visitor.sessionData.cart,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to remove item from visitor cart.",
            error: err.message,
        });
    }
};

// Clear visitor cart
export const clearVisitorCart = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor session not found.",
            });
        }

        visitor.sessionData.cart = [];
        await visitor.save();

        return res.status(200).json({
            success: true,
            message: "Visitor cart cleared successfully.",
            cart: [],
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to clear visitor cart.",
            error: err.message,
        });
    }
};