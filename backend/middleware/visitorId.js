import { v4 as uuidv4 } from "uuid";
import VisitorModel from "../models/visitorModel.js";

export const ensureVisitorSession = async (req, res, next) => {
    try {
        const visitorId = req.headers.authorization?.replace("Bearer ", ""); // Extract visitorId from Authorization header

        if (!visitorId) {
            // Generate new visitorId if none is provided
            const newVisitorId = uuidv4();
            console.log("No visitor-id provided; generating new ID:", newVisitorId);

            // Create a new visitor session with an empty cart
            await VisitorModel.create({
                visitorId: newVisitorId,
                sessionData: { cart: [] },
            });

            req.headers.authorization = `Bearer ${newVisitorId}`;
        } else {
            // Ensure visitor session exists
            let visitor = await VisitorModel.findOne({ visitorId });
            if (!visitor) {
                console.log("Visitor does not exist. Creating a new session.");
                visitor = await VisitorModel.create({
                    visitorId,
                    sessionData: { cart: [] },
                });
            }
        }

        next();
    } catch (error) {
        console.error("Error in ensureVisitorSession:", error.message);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};