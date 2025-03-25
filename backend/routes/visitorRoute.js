import express from "express";
import {
    createVisitorSession,
    getVisitorSession,
    updateVisitorSession,
    deleteVisitorSession,
    getVisitorCart,
    addToVisitorCart,
    removeFromVisitorCart,
    clearVisitorCart
} from "../controllers/visitorController.js";

const visitorRouter = express.Router();

// Visitor session routes
visitorRouter.post("/create", createVisitorSession);
visitorRouter.get("/:visitorId", getVisitorSession);
visitorRouter.put("/:visitorId", updateVisitorSession);
visitorRouter.delete("/:visitorId", deleteVisitorSession);

// Visitor cart routes
visitorRouter.get("/:visitorId/cart", getVisitorCart); // Fetch cart items
visitorRouter.post("/:visitorId/cart/add", addToVisitorCart); // Add item to cart
visitorRouter.delete("/:visitorId/cart/remove", removeFromVisitorCart); // Remove item from cart
visitorRouter.delete("/:visitorId/cart/clear", clearVisitorCart); // Clear the cart

export default visitorRouter;