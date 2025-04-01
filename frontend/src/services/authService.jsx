import axios from 'axios';
import { useHistory } from 'react-router-dom';
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/`; // Use the environment variable

const registerUser = async (payload) => {
    const response = await axios.post(`${API_URL}register`, payload);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
    }
    return response.data;
};

const loginUser = async (payload) => {
    const response = await axios.post(`${API_URL}login`, payload);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
    }
    return response.data;
};

// Authentication check function
const checkAuth = (history) => {
    const token = localStorage.getItem('token');
    if (!token) {
        history.push('/'); // Redirect to homepage if not authenticated
    }
};
// subscription creation function
const substart = async (docId, slotDate, slotTime, token) => {
    const response = await axios.post(`${API_URL}user/book-appointment`, 
        { docId, slotDate, slotTime }, 
        { headers: { token } }
    );
    return response.data;
};
const authService = {
    registerUser,
    loginUser,
    checkAuth,
    substart, // Exporting the new function
};

export default authService;