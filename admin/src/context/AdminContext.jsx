import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // State to manage admin token
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dashData, setDashData] = useState(false);

    // Axios Interceptor to Add Authorization Header to All Requests
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("aToken"); // Retrieve the token from localStorage
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`; // Add the token to the request
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Cleanup the interceptor when the component unmounts
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    // Fetch all doctors from the database using API
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/all-doctors");
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
    //delete a doctor using api
    const deleteDoctor = async (doctorId) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            try {
                console.log(`Deleting doctor with ID: ${doctorId}`); // Debugging

                const { data } = await axios.delete(`${backendUrl}/api/admin/delete-doctor/${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${aToken}`, // Check if this token is valid
                    },
                });

                if (data.success) {
                    console.log("Doctor deleted successfully:", data); // Debugging
                    toast.success("Doctor deleted successfully!");
                    getAllDoctors(); // Refresh doctors list after successful deletion
                } else {
                    console.warn("Delete doctor failed:", data.message); // Debugging
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error deleting doctor:", error); // Debugging
                toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            }
        }
    };
    // Change doctor availability using API
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/change-availability",
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

    return (
        <AdminContext.Provider
            value={{
                aToken,
                doctors,
                getAllDoctors,
                deleteDoctor,
                changeAvailability,
            }}
        >
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;