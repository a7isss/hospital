import jwt from "jsonwebtoken"; // Import JWT for token verification

const authUser = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "Token missing. Authorization denied." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        return res.status(401).json({ success: false, message: "Invalid token. Authorization denied." });
    }
};

export default authUser;