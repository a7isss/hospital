// doctors new page
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // Axios for API requests
import doctorImagePlaceholder from "../assets/doc1.png"; // Fallback image for doctors

const Doctors = () => {
    const [doctors, setDoctors] = useState([]); // Stores the list of doctors
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [error, setError] = useState(null); // Tracks API errors

    // Fetch doctors from the API on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get("/api/doctors"); // Replace with your API endpoint
                setDoctors(response.data); // Set fetched doctors in state
            } catch (error) {
                setError("Failed to fetch doctors. Please try again."); // Handle errors gracefully
            } finally {
                setLoading(false); // Hide loader when done
            }
        };

        fetchDoctors();
    }, []); // Empty dependency array means this runs only once

    if (loading) return <div className="text-center">Loading...</div>; // Show loader
    if (error) return <div className="text-center text-red-500">{error}</div>; // Show error message

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
                    Meet Our Doctors
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map((doctor) => (
                        <div
                            key={doctor._id}
                            className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col items-stretch shadow hover:shadow-lg transition-shadow"
                        >
                            {/* Doctor Image */}
                            <div className="w-full flex items-center justify-center bg-gray-100">
                                <img
                                    src={doctor.image || doctorImagePlaceholder}
                                    alt={doctor.name}
                                    className="h-40 w-40 object-cover rounded-full border-4 border-white shadow-lg"
                                />
                            </div>

                            {/* Doctor Details */}
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {doctor.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {doctor.speciality} - {doctor.degree}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    {doctor.experience}
                                </p>
                                <p className="font-semibold text-primary mb-4">
                                    ${doctor.fees} per consultation
                                </p>

                                <p className="text-xs text-gray-500 italic">
                                    {doctor.address.city}, {doctor.address.country}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Doctors;