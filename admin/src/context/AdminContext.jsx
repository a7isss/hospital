import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Debug: Log backend URL at initialization
    console.log("Backend URL:", backendUrl);

    // State to manage admin token
    const [aToken, setAToken] = useState(
        localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
    );

    // Debug: Log stored token in state and localStorage when component loads
    console.log("Initial aToken state:", aToken);
    console.log("Stored aToken in LocalStorage:", localStorage.getItem("aToken"));

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dashData, setDashData] = useState(false);

    // Axios Interceptor to Add aToken to All Requests
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("aToken"); // Retrieve the token from localStorage
                console.log("Outgoing Request URL:", config.url); // Debug: Log URL of request
                if (token) {
                    config.headers["aToken"] = token; // Add the token to the headers
                    console.log("Token added to headers:", token);
                } else {
                    console.warn("No token found in localStorage");
                }
                return config;
            },
            (error) => {
                console.error("Error in request interceptor:", error); // Debug: Log request interceptor error
                return Promise.reject(error);
            }
        );

        // Cleanup the interceptor when the component unmounts
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        console.log("Fetching all doctors...");
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/all-doctors");
            console.log("getAllDoctors Response:", data); // Debug: Log API response
            if (data.success) {
                setDoctors(data.doctors);
                console.log("Doctors list updated:", data.doctors); // Debug: Log updated doctors
            } else {
                console.warn("getAllDoctors API failed:", data.message); // Debug: Warn on API failure
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in getAllDoctors:", error); // Debug: Log the error
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Function to change doctor availability using API
    const changeAvailability = async (docId) => {
        console.log("Changing doctor availability for Doc ID:", docId);
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/change-availability", { docId });
            console.log("changeAvailability Response:", data); // Debug: Log API response
            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Refresh the doctors list
            } else {
                console.warn("changeAvailability API failed:", data.message); // Debug: Warn on API failure
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in changeAvailability:", error); // Debug: Log the error
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        console.log("Fetching all appointments...");
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/appointments");
            console.log("getAllAppointments Response:", data); // Debug: Log API response
            if (data.success) {
                const reversedAppointments = data.appointments.reverse();
                console.log("Appointments reversed:", reversedAppointments); // Debug: Log reversed list
                setAppointments(reversedAppointments);
            } else {
                console.warn("getAllAppointments API failed:", data.message); // Debug: Warn on API failure
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in getAllAppointments:", error); // Debug: Log the error
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        console.log("Cancelling appointment with ID:", appointmentId);
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/cancel-appointment", { appointmentId });
            console.log("cancelAppointment Response:", data); // Debug: Log API response
            if (data.success) {
                toast.success(data.message);
                getAllAppointments(); // Refresh the appointments list
            } else {
                console.warn("cancelAppointment API failed:", data.message); // Debug: Warn on API failure
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in cancelAppointment:", error); // Debug: Log the error
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        console.log("Fetching admin dashboard data...");
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/dashboard");
            console.log("getDashData Response:", data); // Debug: Log API response
            if (data.success) {
                setDashData(data.dashData);
                console.log("Dashboard data updated:", data.dashData); // Debug: Log updated dashboard data
            } else {
                console.warn("getDashData API failed:", data.message); // Debug: Warn on API failure
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in getDashData:", error); // Debug: Log the error
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Debug the submit process (external implementation might interact via API for login)
    const submitLogin = async (username, password) => {
        console.log("Submitting login with credentials:", { username, password });
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/login", { username, password });
            console.log("submitLogin Response:", data); // Debug: Log API response
            if (data.success) {
                console.log("Login successful, token received:", data.token); // Debug: Log token
                setAToken(data.token);
                localStorage.setItem("aToken", data.token); // Save token in localStorage
                toast.success("Login successful!");
            } else {
                console.warn("Login failed:", data.message); // Debug: Warn on login failure
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in submitLogin:", error); // Debug: Log the error
            toast.error(error.response?.data?.message || error.message);
        }
    };

    /** Context Values to Share **/
    const value = {
        aToken,
        setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        submitLogin, // Added for handling login
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;