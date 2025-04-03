import { v4 as uuidv4 } from "uuid"; // Generate unique visitor IDs
import { VisitorModel, ServiceModel } from "../models/models.js";

// ============================
// Create a New Visitor Session
// ============================
export const createVisitorSession = async (req, res) => {
    try {
        const visitorId = uuidv4(); // Generate unique visitor ID
        const newVisitor = await VisitorModel.create({
            visitorId,
            sessionData: {}, // Empty session to start
        });

        res.status(201).json({
            success: true,
            visitorId,
            message: "Visitor session created successfully.",
        });
    } catch (error) {
        console.error("Error creating visitor session:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error while creating visitor session.",
            error: error.message,
        });
    }
};

// ============================
// Get Current Visitor Session
// ============================
export const getVisitorSession = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor session not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Visitor session fetched successfully.",
            data: visitor,
        });
    } catch (error) {
        console.error("Error fetching visitor session:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching visitor session.",
            error: error.message,
        });
    }
};

// ============================
// Update Visitor Session Data
// ============================
export const updateVisitorSession = async (req, res) => {
    const { visitorId } = req.params;
    const { sessionData } = req.body;

    try {
        const visitor = await VisitorModel.findOneAndUpdate(
            { visitorId },
            { sessionData },
            { new: true } // Return the updated object
        );

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor session not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Visitor session updated successfully.",
            data: visitor,
        });
    } catch (error) {
        console.error("Error updating visitor session:", error.message);
        res.status(500).json({
            success: false,
            message: "Error updating visitor session.",
            error: error.message,
        });
    }
};

// ============================
// Delete Visitor Session
// ============================
export const deleteVisitorSession = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const deletedVisitor = await VisitorModel.findOneAndDelete({ visitorId });
        if (!deletedVisitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor session not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Visitor session deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting visitor session:", error.message);
        res.status(500).json({
            success: false,
            message: "Error deleting visitor session.",
            error: error.message,
        });
    }
};

// ============================
// Fetch All Services
// ============================
export const getAllServices = async (req, res) => {
    try {
        // Fetch all available services
        const services = await ServiceModel.find({});
        if (!services || services.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No services found.",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Services fetched successfully.",
            data: services,
        });
    } catch (error) {
        console.error("Error fetching services:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching services.",
            error: error.message,
        });
    }
};

// ============================
// Get Visitor Cart
// ============================
export const getVisitorCart = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor || !visitor.sessionData.cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found for the given visitor.",
                data: { cart: [], totalPrice: 0 },
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully.",
            data: visitor.sessionData.cart,
        });
    } catch (error) {
        console.error("Error fetching visitor cart:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching visitor cart.",
            error: error.message,
        });
    }
};