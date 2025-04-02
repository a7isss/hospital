import { v4 as uuidv4 } from "uuid";
import { VisitorModel } from "../models/models.js";

export const ensureVisitorSession = async (req, res, next) => {
    try {
        // Extract visitorId from the custom header
        const visitorId = req.headers["x-visitor-id"];

        // Check if visitorId exists and is valid
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (visitor) {
                // Visitor session exists, proceed to next middleware
                req.visitorId = visitorId; // Attach visitorId to the request
                return next();
            } else {
                console.log("Visitor ID provided but no session found, creating a new session.");
            }
        }

        // Generate a new visitorId if none exists or session was not found
        const newVisitorId = uuidv4();
        console.log("No valid visitorId provided; generating new ID:", newVisitorId);

        // Create a new visitor session with an empty cart
        await VisitorModel.create({
            visitorId: newVisitorId,
            sessionData: { cart: [] },
        });

        // Attach the new visitorId to the request and response
        req.visitorId = newVisitorId;
        res.setHeader("x-visitor-id", newVisitorId); // Return new visitorId in the response for frontend storage

        next(); // Proceed to the next route
    } catch (error) {
        console.error("Error in ensureVisitorSession:", error.message);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};