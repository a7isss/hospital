import axios from "axios";
import authService from "../services/authService"; // Importing the updated authService for token handling

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get token from localStorage
        const token = authService.getToken();

        // Check if the token exists and validate its expiration
        if (token) {
            if (authService.isTokenExpired(token)) {
                // Clear expired token and optionally handle global session cleanup
                authService.logoutUser();
                throw new Error("Token expired. Please log in again.");
            }

            // Add the valid token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Return the modified config
    },
    (error) => {
        // Handle errors before the request is sent
        return Promise.reject(error);
    }
);

export default axiosInstance;