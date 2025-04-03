import jwt from "jsonwebtoken";
import logger from "../middleware/logger.js"; // Logger utility for centralized logging

const authUser = (req, res, next) => {
    try {
        // Check if Authorization token exists in the headers
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            logger.warn("Authorization failed: Token missing from request headers.");
            return res.status(401).json({ success: false, message: "Token missing. Authorization denied." });
        }

        // Verify the token validity
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request object for further use
        logger.info(`Authorization successful for userID: ${decoded.id}`);

        next(); // Proceed to the next middleware
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            logger.warn("Authorization failed: Token expired.");
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        } else if (error.name === "JsonWebTokenError") {
            logger.warn("Authorization failed: Invalid token.");
            return res.status(401).json({ success: false, message: "Invalid token. Authorization denied." });
        } else {
            // Generic error fallback
            logger.error("An unexpected error occurred during authorization:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
};

export default authUser;