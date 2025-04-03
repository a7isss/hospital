import React, { useEffect } from "react";
import Banner from "../components/Banner"; // Import Banner component
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore"; // Zustand's authStore

const Subscriptions = () => {
    const {
        backendUrl,
        userData,
        token,
        subscriptions,
        loading,
        setLoading,
        error,
        setError,
    } = useAuthStore((state) => ({
        backendUrl: state.backendUrl, // Base API URL
        userData: state.userData, // Current signed-in user data
        token: state.token, // Auth token
        subscriptions: state.subscriptions, // User's subscriptions
        setSubscriptions: state.setSubscriptions, // Action to update subscriptions in Zustand
        loading: state.loading, // Global loading state
        setLoading: state.setLoading, // Action to update loading state globally
        error: state.error, // Global error state
        setError: state.setError, // Action to update error state
    }));

    // Fetch subscriptions of the signed-in user
    const fetchSubscriptions = async () => {
        if (!userData) {
            console.warn("No user signed in. Skipping subscription fetch.");
            setSubscriptions([]); // Clear subscriptions for unauthenticated users
            return;
        }

        try {
            setLoading(true); // Start loading state
            const response = await fetch(`${backendUrl}/api/subscriptions`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setSubscriptions(data.subscriptions || []); // Update subscriptions in Zustand
                setError(null); // Clear error state upon success
            } else {
                throw new Error(data.message || "Failed to fetch subscriptions.");
            }
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
            setError("Failed to load subscriptions. Try again later.");
            toast.error("Error fetching subscriptions. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch subscriptions when the component is mounted
    useEffect(() => {
        fetchSubscriptions();
    }, [userData]); // Re-fetch whenever the user changes

    return (
        <div className="subscriptions-page">
            {/* Banner Section */}
            <Banner />

            {/* Subscriptions Content */}
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-semibold">Your Subscriptions</h1>
                <p className="text-md text-gray-600 mb-6">
                    Manage all your active and past subscriptions below:
                </p>

                {/* Loading State */}
                {loading && <p className="text-gray-500">Loading...</p>}

                {/* Error State */}
                {error && <p className="text-red-500">{error}</p>}

                {/* No Subscriptions Available */}
                {!loading && !error && subscriptions.length === 0 && (
                    <p className="text-md text-gray-600">
                        You currently have no active subscriptions.
                    </p>
                )}

                {/* Render Subscriptions */}
                {!loading && !error && subscriptions.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subscriptions.map((subscription) => (
                            <div
                                key={subscription.id}
                                className="bg-white shadow rounded-lg p-6 border border-gray-200"
                            >
                                {/* Subscription Name */}
                                <h2 className="text-xl font-semibold mb-2">
                                    {subscription.name}
                                </h2>

                                {/* Next Billing Date */}
                                <p className="text-md text-gray-600">
                                    <strong>Next Billing:</strong>{" "}
                                    {new Date(subscription.nextBillingDate).toLocaleDateString()}
                                </p>

                                {/* Price */}
                                <p className="text-md text-gray-600 mb-4">
                                    <strong>Price:</strong> ₹{subscription.price.toFixed(2)}
                                </p>

                                {/* Action Button */}
                                <button className="px-4 py-2 bg-primary text-white rounded shadow hover:opacity-90">
                                    Manage Subscription
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscriptions;