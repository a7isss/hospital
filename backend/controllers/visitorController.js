import { v4 as uuidv4 } from "uuid"; // Generate UUID for visitorId
import { VisitorModel, ServiceModel } from "../models/models.js";

// ============================
// Middleware: Ensure Visitor Session
// ============================
export const ensureVisitorSession = async (req, res, next) => {
    try {
        // Extract visitorId from headers
        let visitorId = req.headers["x-visitor-id"];

        // Check for a valid visitor session
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (visitor) {
                req.visitorId = visitorId; // Attach visitorId for other routes
                return next(); // Proceed if visitorId is valid
            } else {
                console.log("Invalid visitorId provided; creating new visitor session.");
            }
        }

        // Generate a new visitorId if none found or invalid
        visitorId = uuidv4();
        console.log("No valid visitorId provided. Generated new visitorId:", visitorId);

        // Create a new visitor session in the database
        await VisitorModel.create({
            visitorId,
            sessionData: { cart: [] }, // Initialize with empty cart
        });

        // Pass the new visitorId to request and add it to response headers
        req.visitorId = visitorId;
        res.setHeader("x-visitor-id", visitorId);

        next(); // Continue to the next middleware/route
    } catch (error) {
        console.error("Error ensuring visitor session:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error ensuring visitor session.",
            error: error.message,
        });
    }
};
// ============================
// Get Visitor's Cart
// ============================
export const getVisitorCart = async (req, res) => {
    const { visitorId } = req.params; // Extract visitorId from the request params

    try {
        const visitor = await VisitorModel.findOne({ visitorId }); // Find the visitor by visitorId

        if (!visitor || !visitor.sessionData.cart) {
            return res.status(404).json({
                success: false,
                message: "Visitor cart not found.",
            });
        }

        // Return the cart data
        res.status(200).json({
            success: true,
            message: "Visitor cart fetched successfully.",
            cart: visitor.sessionData.cart,
        });
    } catch (error) {
        console.error("Error fetching visitor cart:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error fetching visitor cart.",
            error: error.message,
        });
    }
};

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
            message: "Internal server error creating visitor session.",
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
        const services = await ServiceModel.find({});
        if (!services || services.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No services found.",
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
            message: "Internal server error fetching services.",
            error: error.message,
        });
    }
};