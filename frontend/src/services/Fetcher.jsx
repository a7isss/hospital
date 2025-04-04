import mongoose from "mongoose"; // For MongoDB integration
import { ServiceModel } from "../models/models.js"; // Import models from the shared file

// Ensure the MongoDB connection uses the environment variable
const MONGODB_LINE = process.env.mongodb_Line;

// Initialize MongoDB connection
const connectToDatabase = async () => {
    if (!MONGODB_LINE) {
        throw new Error("Missing environment variable: mongodb_Line");
    }

    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(MONGODB_LINE, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Connected to MongoDB!");
        } catch (err) {
            console.error("Failed to connect to MongoDB:", err);
            throw new Error("Failed to connect to MongoDB.");
        }
    }
};

// Fetcher Service
const Fetcher = {
    /**
     * Fetch all services from the database.
     * @returns {Promise<Array>} An array of service documents.
     */
    fetchServices: async () => {
        try {
            await connectToDatabase(); // Ensure the database is connected
            const services = await ServiceModel.find({}); // Fetch all services
            return services;
        } catch (err) {
            console.error("Error fetching services:", err.message);
            throw new Error("Failed to fetch services.");
        }
    },

    /**
     * Fetch a single service by ID.
     * @param {String} id - The ID of the service to fetch.
     * @returns {Promise<Object>} The service document.
     */
    fetchServiceById: async (id) => {
        try {
            await connectToDatabase(); // Ensure the database is connected
            const service = await ServiceModel.findById(id); // Fetch the service by ID
            if (!service) {
                throw new Error("Service not found.");
            }
            return service;
        } catch (err) {
            console.error(`Error fetching service by ID (${id}):`, err.message);
            throw new Error("Failed to fetch the service.");
        }
    },

    /**
     * Fetch services based on a query (e.g., filters).
     * @param {Object} query - The MongoDB query object.
     * @returns {Promise<Array>} An array of filtered service documents.
     */
    fetchServicesByQuery: async (query) => {
        try {
            await connectToDatabase(); // Ensure the database is connected
            const services = await ServiceModel.find(query); // Apply the query to fetch services
            return services;
        } catch (err) {
            console.error("Error fetching services by query:", err.message);
            throw new Error("Failed to fetch services.");
        }
    },

    /**
     * Fetch an image for a service from the database.
     * Assumes the ServiceModel contains "image" data.
     * @param {String} id - The ID of the service whose image is being fetched.
     * @returns {Promise<Buffer>} The service's image buffer data.
     */
    fetchServiceImage: async (id) => {
        try {
            await connectToDatabase(); // Ensure the database is connected
            const service = await ServiceModel.findById(id, "image"); // Fetch only the image field
            if (!service || !service.image) {
                throw new Error("Image not found for the service.");
            }
            return service.image; // Assuming image is stored as binary data (Buffer)
        } catch (err) {
            console.error("Error fetching service image:", err.message);
            throw new Error("Failed to fetch service image.");
        }
    },

    /**
     * Generic method for fetching data from the database.
     * For custom operations, pass the model name and custom query.
     * @param {Object} options - Options for fetching data.
     * @param {mongoose.Model} options.model - The Mongoose model to query.
     * @param {Object} [options.query] - The query object to apply (default: {}).
     * @param {Object} [options.projection] - The fields to project (default: null).
     * @returns {Promise<Array|Object>} The query result.
     */
    fetchCustom: async ({ model, query = {}, projection = null }) => {
        try {
            await connectToDatabase(); // Ensure the database is connected
            const result = await model.find(query, projection); // Execute the query
            return result;
        } catch (err) {
            console.error("Error with custom fetch request:", err.message);
            throw new Error("Failed to execute the custom fetch.");
        }
    },
};

export default Fetcher;