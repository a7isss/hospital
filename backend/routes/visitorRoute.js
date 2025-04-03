import express from "express";
import userRouter from "./userRoute.js";
import {
    createVisitorSession,
    getVisitorSession,
    updateVisitorSession,
    deleteVisitorSession,
    getVisitorCart,
    getAllServices
} from "../controllers/visitorController.js";
import { ensureVisitorSession } from "../middleware/visitorId.js";

const visitorRouter = express.Router();

// Visitor session routes
visitorRouter.post("/create", createVisitorSession); // Create a new visitor session
visitorRouter.get("/:visitorId", getVisitorSession); // Get visitor session by ID
visitorRouter.put("/:visitorId", updateVisitorSession); // Update visitor session data
visitorRouter.delete("/:visitorId", deleteVisitorSession); // Delete visitor session
visitorRouter.get("/services", getAllServices);
userRouter.get("/services", getAllServices);

// Visitor cart routes
visitorRouter.get("/:visitorId/cart", ensureVisitorSession, getVisitorCart); // Get visitor cart

export default visitorRouter;