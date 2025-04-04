import { VisitorModel } from "../models/models.js";

const ensureVisitorSession = async (req, res, next) => {
    try {
        let visitor = await VisitorModel.findOne();

        if (!visitor) {
            visitor = new VisitorModel({ sessionData: { cart: [], totalPrice: 0 } });
            await visitor.save();
        }

        req.visitor = visitor;
        next();
    } catch (error) {
        console.error("ensureVisitorSession - Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to ensure session.", error: error.message });
    }
};

export default ensureVisitorSession;