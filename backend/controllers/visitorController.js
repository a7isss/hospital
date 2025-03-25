import VisitorModel from "../models/visitorModel.js";
import { v4 as uuidv4 } from 'uuid'; // Use uuid for generating unique visitor IDs

// Create a new visitor session
export const createVisitorSession = async (req, res) => {
    try {
        const visitorId = uuidv4(); // Generate a unique ID
        const newVisitor = await VisitorModel.create({
            visitorId,
            sessionData: {}, // Initialize with empty data
        });

        res.status(201).json({ success: true, visitorId, message: "Visitor session created successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create visitor session", error: err.message });
    }
};

// Get a visitor session
export const getVisitorSession = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOne({ visitorId });
        if (!visitor) {
            return res.status(404).json({ success: false, message: "Visitor session not found" });
        }

        res.status(200).json({ success: true, visitor });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch visitor session", error: err.message });
    }
};

// Update visitor session data
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
            return res.status(404).json({ success: false, message: "Visitor session not found" });
        }

        res.status(200).json({ success: true, visitor, message: "Visitor session updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update visitor session", error: err.message });
    }
};

// Delete a visitor session
export const deleteVisitorSession = async (req, res) => {
    const { visitorId } = req.params;

    try {
        const visitor = await VisitorModel.findOneAndDelete({ visitorId });
        if (!visitor) {
            return res.status(404).json({ success: false, message: "Visitor session not found" });
        }

        res.status(200).json({ success: true, message: "Visitor session deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete visitor session", error: err.message });
    }
};