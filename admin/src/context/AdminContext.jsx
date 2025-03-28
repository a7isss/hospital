import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// Create Admin Context
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const value = {
        setAToken, // Expose setAToken in the context
        // Other states and functions
    };

    // States
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dashData, setDashData] = useState(null);
    const [services, setServices] = useState([]); // New state for services

    // Set up Axios interceptor
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("aToken");
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);
//fetch services
    const getAllServices = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/services`, {
                headers: {
                    Authorization: `Bearer ${aToken}`
                },
            });

            if (data.success && Array.isArray(data.services)) {
                setServices(data.services); // Populate AdminContext state
                return data.services; // Return services to the caller
            } else {
                console.error("Error: Unexpected data shape:", data);
                return []; // Safe fallback
            }
        } catch (error) {
            console.error("Error in getAllServices:", error);
            return []; // Always return an array to avoid breaking loops
        }
    };
    // Add a new service
    const addService = async (serviceData) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/add-service`, serviceData, {
                headers: {
                    Authorization: `Bearer ${aToken}`, // Authorization token
                    "Content-Type": "multipart/form-data", // Correct Content-Type for FormData
                },
            });

            if (data.success) {
                toast.success("Service added successfully!");
                getAllServices(); // Refresh the services list
            } else {
                toast.error(data.message || "Failed to add service.");
            }
        } catch (error) {
            console.error("Error adding service:", error);
            toast.error(error.response?.data?.message || "An error occurred while adding the service.");
        }
    };
    // Delete a service
    const deleteService = async (serviceId) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                const { data } = await axios.delete(`${backendUrl}/api/admin/delete-service/${serviceId}`, {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                    },
                });

                if (data.success) {
                    toast.success("Service deleted successfully!");
                    getAllServices(); // Refresh the services list
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error deleting service:", error); // Debugging
                toast.error(error.response?.data?.message || "Failed to delete service.");
            }
        }
    };

    // Fetch all doctors
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`);
            if (data.success) {
                setDoctors(data.doctors);
                console.log("Doctors list updated:", data.doctors); // Debugging
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Fetch all appointments
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`);
            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Fetch dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`);
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Delete a doctor
    const deleteDoctor = async (doctorId) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            try {
                const { data } = await axios.delete(`${backendUrl}/api/admin/delete-doctor/${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${aToken}`, // Admin token
                    },
                });

                if (data.success) {
                    toast.success("Doctor deleted successfully!");
                    getAllDoctors(); // Refresh doctors
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error deleting doctor:", error); // Debugging
                toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            }
        }
    };

    // Change doctor availability
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`,
                { docId },
                {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                    },
                }
            );
            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Refresh doctors list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
   // Add logout function to handle logout logic for Admin
        const logout = () => {
            localStorage.removeItem('aToken'); // Clear the token from storage
            setAToken(''); // Clear the token from state
        };
    const login = (token) => {
        localStorage.setItem('aToken', token); // Save token to localStorage
        setAToken(token); // Update state
    };

    // Cancel an appointment
    const cancelAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                const { data } = await axios.post(
                    `${backendUrl}/api/admin/cancel-appointment`,
                    { appointmentId },
                    {
                        headers: {
                            Authorization: `Bearer ${aToken}`, // Admin token
                        },
                    }
                );

                if (data.success) {
                    toast.success("Appointment canceled successfully!");
                    getAllAppointments(); // Refresh appointments
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error canceling appointment:", error); // Debugging
                toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            }
        }
    };

    return (
        <AdminContext.Provider
            value={{
                setAToken,
                aToken,
                doctors,
                appointments,
                dashData,
                getAllDoctors,
                getAllAppointments,
                getDashData,
                deleteDoctor,
                logout,
                changeAvailability,
                cancelAppointment,
                getAllServices,
                addService,
                deleteService,
                login,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;