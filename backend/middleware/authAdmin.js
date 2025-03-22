// admin authentication middleware
import jwt from 'jsonwebtoken';
const authAdmin = async (req, res, next) => {
    try {
        // Extract the token from the headers (case-insensitive, handle Bearer tokens)
        const aToken = req.headers['aToken'] || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
        console.log("Received Token (aToken):", aToken);

        // Check if the token exists
        if (!aToken) {
            console.log("No token provided");
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        // Verify the token
        const token_decode = jwt.verify(aToken, process.env.JWT_SECRET);

        // Debug log for decoded token
        console.log("Decoded Token:", token_decode);

        // Check if the username in the token matches the admin email
        if (token_decode.username !== process.env.ADMIN_EMAIL) {
            console.log("Token username does not match admin email");
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log("Error in authAdmin middleware:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token. Login Again." });
    }
};

export default authAdmin;