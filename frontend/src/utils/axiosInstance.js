import axios from "axios";
import authService from "../services/authService";

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get token from localStorage
        const token = authService.getToken();

        // Add user token if available and not expired
        if (token && !authService.isTokenExpired(token)) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Do not override headers if `x-visitor-id` is already set
        if (!config.headers["x-visitor-id"]) {
            // Add visitorId if managing visitor session
            const visitorId = localStorage.getItem("visitorId");
            if (visitorId) {
                config.headers["x-visitor-id"] = visitorId;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;