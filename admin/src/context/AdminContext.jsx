import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // States
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dashData, setDashData] = useState(null);

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
                console.log(`Deleting doctor with ID: ${doctorId}`); // Debugging

                const { data } = await axios.delete(`${backendUrl}/api/admin/delete-doctor/${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${aToken}`, // Admin token
                    },
                });

                if (data.success) {
                    console.log("Doctor deleted successfully:", data); // Debugging
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

    // Cancel an appointment
    const cancelAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                console.log(`Canceling appointment with ID: ${appointmentId}`); // Debugging

                const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, {
                    headers: {
                        Authorization: `Bearer ${aToken}`, // Admin token
                    },
                });

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
                aToken,
                doctors,
                appointments,
                dashData,
                getAllDoctors,
                getAllAppointments,
                getDashData,
                deleteDoctor,
                changeAvailability,
                cancelAppointment, // Added this function
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;