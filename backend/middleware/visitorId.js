import { v4 as uuidv4 } from "uuid";
import VisitorModel from "../models/visitorModel.js";

export const ensureVisitorSession = async (req, res, next) => {
    let visitorId = req.headers["visitor-id"]; // Retrieve visitor ID from headers

    if (!visitorId) {
        visitorId = uuidv4(); // Generate a new ID
        req.headers["visitor-id"] = visitorId;

        // Create a new visitor session in the database with an empty cart
        await VisitorModel.create({
            visitorId,
            sessionData: { cart: [] },
        });
    }

    req.body.visitorId = visitorId; // Attach visitorId to `req.body`
    next(); // Proceed to the controller
};