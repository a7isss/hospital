import { UserModel } from "../models/models.js"; // Adjust the import path based on your project structure

/**
 * Middleware to search users with a specific doctorId in 'accessibleDoctors'.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const findUsersByDoctorId = async (req, res, next) => {
    try {
        const { doctorId } = req.query; // Assuming the doctorId is sent as a query parameter

        if (!doctorId) {
            return res.status(400).json({ error: "Missing 'doctorId' in query parameters." });
        }

        // Search for users with the given doctorId in their 'accessibleDoctors' field
        const users = await UserModel.find({ "subscription.accessibleDoctors": doctorId });

        // Make the result accessible to the next middleware or route handler
        req.foundUsers = users;

        return next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle errors (e.g., database issues)
        return res.status(500).json({ error: "An error occurred while searching for users.", details: error.message });
    }
};

export default findUsersByDoctorId;