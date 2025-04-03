import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import useAuthStore from "../store/authStore"; // Zustand's global state

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate();
    const { t } = useTranslation(); // Initialize translation

    const { doctors, backendUrl, token, setDoctors, loading, setLoading, error, setError } =
        useAuthStore((state) => ({
            doctors: state.doctors, // Global state for doctors
            backendUrl: state.backendUrl, // API base URL
            token: state.token, // Authentication token
            setDoctors: state.setDoctors, // Action to update doctors globally in Zustand
            loading: state.loading, // Global loading state
            setLoading: state.setLoading, // Action to update loading state globally
            error: state.error, // Global error state
            setError: state.setError, // Action to update error state
        }));

    const [relDoc, setRelDoc] = useState([]); // Local state to store related doctors

    // Fetch related doctors if not already in the Zustand store
    const fetchDoctors = async () => {
        try {
            setLoading(true); // Set global loading state
            const response = await fetch(`${backendUrl}/api/doctors`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setDoctors(data.doctors || []); // Populate global Zustand store with doctors
                setError(null); // Clear errors if successful
            } else {
                throw new Error(data.message || "Failed to fetch doctors.");
            }
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError("Failed to load doctors. Try again later."); // Set global error state
        } finally {
            setLoading(false); // Reset global loading state
        }
    };

    // On component mount, fetch doctors if not already loaded
    useEffect(() => {
        if (doctors.length === 0) {
            fetchDoctors();
        }
    }, []); // Fetch doctors only once on mount

    // Filter doctors based on speciality and exclude the current doctor
    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const filteredDoctors = doctors.filter(
                (doc) => doc.speciality === speciality && doc._id !== docId
            );
            setRelDoc(filteredDoctors);
        }
    }, [doctors, speciality, docId]);

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-[#262626]">
            <h1 className="text-3xl font-medium">{t("related_doctors")}</h1>
            <p className="sm:w-1/3 text-center text-sm">{t("browse_trusted_doctors")}</p>

            {/* Loading State */}
            {loading && <p className="text-gray-500">{t("loading")}</p>}

            {/* Error State */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Render Related Doctors */}
            {!loading && !error && relDoc.length > 0 && (
                <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                    {relDoc.map((item, index) => (
                        <div
                            onClick={() => {
                                navigate(`/appointment/${item._id}`);
                                scrollTo(0, 0);
                            }}
                            className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                            key={index}
                        >
                            <img className="bg-[#EAEFFF]" src={item.image} alt="" />
                            <div className="p-4">
                                {/* Availability */}
                                <div
                                    className={`flex items-center gap-2 text-sm text-center ${
                                        item.available ? "text-green-500" : "text-gray-500"
                                    }`}
                                >
                                    <p
                                        className={`w-2 h-2 rounded-full ${
                                            item.available ? "bg-green-500" : "bg-gray-500"
                                        }`}
                                    ></p>
                                    <p>{item.available ? t("available") : t("not_available")}</p>
                                </div>

                                {/* Doctor Information */}
                                <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Related Doctors Available */}
            {!loading && !error && relDoc.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                    {t("no_related_doctors")}
                </p>
            )}
        </div>
    );
};

export default RelatedDoctors;