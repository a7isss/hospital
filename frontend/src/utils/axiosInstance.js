import axios from "axios";
import authService from "../services/authService";

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = authService.getToken();

        // Automatically attempt to refresh token if expired
        if (token && authService.isTokenExpired(token)) {
            try {
                const { token: newToken } = await authService.refreshToken(); // Refresh if expired
                if (newToken) {
                    config.headers.Authorization = `Bearer ${newToken}`;
                }
            } catch (error) {
                console.error("axiosInstance -> Token refresh failed:", error);
                authService.logoutUser(); // Clear local session on failure
                throw error; // Reject the request with the error
            }
        } else if (token) {
            // Attach valid token
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add visitorId if managing visitor session and x-visitor-id is not already set
        if (!config.headers["x-visitor-id"]) {
            const visitorId = localStorage.getItem("visitorId");
            if (visitorId) {
                config.headers["x-visitor-id"] = visitorId;
            }
        }

        return config; // Return the modified config
    },
    (error) => {
        console.error("axiosInstance -> Request error:", error);
        return Promise.reject(error); // Forward the error
    }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response; // Return the response if no error
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error comes from an expired access token and refresh failed
        if (
            error.response &&
            error.response.status === 401 && // Unauthorized
            !originalRequest._retry // Avoid infinite loops
        ) {
            originalRequest._retry = true; // Mark the request for retry

            // Attempt to refresh token
            try {
                const { token } = await authService.refreshToken(); // Get a new token
                if (token) {
                    authService.setToken(token); // Save the new token
                    originalRequest.headers.Authorization = `Bearer ${token}`; // Update the request headers
                    return axiosInstance(originalRequest); // Retry the request
                }
            } catch (refreshError) {
                console.error("axiosInstance -> Token refresh failed during response interception:", refreshError);
                authService.logoutUser(); // Clear session if token refresh fails
                return Promise.reject(refreshError); // Forward refresh error
            }
        }

        console.error("axiosInstance -> Response error:", error);
        return Promise.reject(error); // Forward other errors
    }
);

export default axiosInstance;