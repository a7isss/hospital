import VisitorModel from "../models/visitorModel.js";

export const ensureVisitorSession = async (req, res, next) => {
    let visitorId = req.headers["visitor-id"];

    if (!visitorId) {
        visitorId = uuidv4();
        req.headers["visitor-id"] = visitorId;

        // Create a new visitor session in the database
        await VisitorModel.create({
            visitorId,
            sessionData: { cart: [] },
        });
    }
    req.visitorId = visitorId; // Attach visitorId to request object
    next();
};