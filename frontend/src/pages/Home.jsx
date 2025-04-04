import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthStore from "../store/authStore"; // Auth store for authenticated users
import useVisitorStore from "../store/visitorStore"; // Visitor store for visitors
import ServiceCards from "../components/ServiceCards"; // ServiceCards to display services
import { toast } from "react-toastify";

const Home = () => {
    const { t } = useTranslation(); // For translations
    const { isAuthenticated, userData, fetchUserData } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
        fetchUserData: state.fetchUserData,
    }));

    const { visitorId, generateVisitorId } = useVisitorStore((state) => ({
        visitorId: state.visitorId,
        generateVisitorId: state.generateVisitorId,
    }));

    const [userName, setUserName] = useState(t("visitor")); // Default to visitor's name

    // Initialize user or visitor information
    useEffect(() => {
        if (isAuthenticated) {
            // Fetch user data if authenticated
            fetchUserData().then(() => {
                setUserName(userData?.name || t("user")); // Set authenticated user's name
            }).catch(err => {
                console.error("Failed to fetch user data:", err.message);
                toast.error(t("error_fetching_user_data"));
            });
        } else {
            // Generate visitor ID if the user is not authenticated
            generateVisitorId();
        }
    }, [isAuthenticated, userData, fetchUserData, generateVisitorId]);

    return (
        <div>
            {/* User/Visitor Information */}
            <div style={{ textAlign: "right", margin: "10px" }}>
                <span>
                    {t("welcome")}, {isAuthenticated ? userName : t("visitor")}
                </span>

                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "24px",
                        color: "#333",
                    }}
                >
                    {t("our_services")}
                </h2>
                <ServiceCards /> {/* ServiceCards handles visitor and authenticated logic */}
            </div>
        </div>
    );
};

export default Home;