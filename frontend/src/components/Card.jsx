import React, { useEffect } from "react";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore"; // Handles authenticated users
import useVisitorStore from "../store/visitorStore"; // Handles visitors
import Card from "../components/Card"; // Single service card component

const Services = () => {
    const { isAuthenticated, fetchServices: fetchAuthServices, services: authServices } = useAuthStore(
        (state) => ({
            isAuthenticated: state.isAuthenticated,
            fetchServices: state.fetchServices,
            services: state.services,
        })
    );

    const { fetchServices: fetchVisitorServices, services: visitorServices } = useVisitorStore(
        (state) => ({
            fetchServices: state.fetchServices,
            services: state.services,
        })
    );

    // Fetch services based on authentication state
    useEffect(() => {
        const fetchServices = async () => {
            try {
                if (isAuthenticated) {
                    await fetchAuthServices(); // Fetch services for authenticated users
                } else {
                    await fetchVisitorServices(); // Fetch services for visitors
                }
            } catch (err) {
                console.error("Error fetching services:", err);
                toast.error("Failed to load services. Please try again later.");
            }
        };

        fetchServices();
    }, [isAuthenticated, fetchAuthServices, fetchVisitorServices]);

    // Select the appropriate services list based on the user's authentication state
    const services = isAuthenticated ? authServices : visitorServices;

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Page Heading */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Services</h1>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {services && services.length > 0 ? (
                    services.map((service) => (
                        <Card key={service._id} service={service} /> // Render a Card for each service
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No services available at the moment.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Services;