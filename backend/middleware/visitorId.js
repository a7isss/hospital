import { v4 as uuidv4 } from "uuid";
import VisitorModel from "../models/visitorModel.js";

export const ensureVisitorSession = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const visitorId = authorizationHeader?.replace("Bearer ", ""); // Extract visitorId from Authorization header

        // Check if visitorId exists and is valid
        if (visitorId) {
            const visitor = await VisitorModel.findOne({ visitorId });
            if (visitor) {
                // Visitor session exists, proceed to next middleware
                req.visitorId = visitorId; // Attach to request for further use
                return next();
            } else {
                console.log("Visitor ID provided but session not found, creating a new session.");
            }
        }

        // Generate a new visitorId if none exists or session was not found
        const newVisitorId = uuidv4();
        console.log("No valid visitor-id; generating new ID:", newVisitorId);

        // Create a new visitor session with an empty cart
        await VisitorModel.create({
            visitorId: newVisitorId,
            sessionData: { cart: [] },
        });

        // Attach the new visitorId to request and response
        req.visitorId = newVisitorId;
        res.setHeader("x-visitor-id", newVisitorId); // Return new visitorId in response for frontend storage

        next(); // Proceed to the next route
    } catch (error) {
        console.error("Error in ensureVisitorSession:", error.message);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};