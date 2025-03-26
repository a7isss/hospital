import { v4 as uuidv4 } from "uuid";
import VisitorModel from "../models/visitorModel.js";

export const ensureVisitorSession = async (req, res, next) => {
    // Retrieve visitorId from body, or fallback to headers
    let visitorId = req.body.visitorId || req.headers["visitor-id"];

    if (!visitorId) {
        // If no `visitorId` is provided, generate a new one
        visitorId = uuidv4();
        console.log("No visitor-id provided; generating new ID:", visitorId);

        // Create a new visitor record in the database (with an empty cart)
        await VisitorModel.create({
            visitorId,
            sessionData: { cart: [] },
        });
    } else {
        // Log the provided visitor ID for debugging
        console.log("Received visitor-id from client:", visitorId);
    }

    // Attach the visitorId back to both the headers (for backward compatibility)
    // and request body (for downstream use)
    req.headers["visitor-id"] = visitorId;
    req.body.visitorId = visitorId;

    next(); // Proceed to the controller
};