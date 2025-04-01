import React, { useContext } from "react";
import Banner from "../components/Banner"; // Import Banner component
import { AppContext } from "../context/AppContext"; // Context to fetch subscription-related data

const Subscriptions = () => {
  const { subscriptions } = useContext(AppContext); // Assume subscriptions data comes from AppContext

  // If subscription data exists, render it below Banner
  return (
      <div className="subscriptions-page">
        {/* Banner Section */}
        <Banner /> {/* Renders banner content as per the component design */}

        {/* Subscriptions Content */}
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-semibold">Your Subscriptions</h1>
          <p className="text-md text-gray-600 mb-6">
            Manage all your active and past subscriptions below:
          </p>

          {subscriptions && subscriptions.length > 0 ? (
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
                        {new Date(
                            subscription.nextBillingDate
                        ).toLocaleDateString()}
                      </p>

                      {/* Price */}
                      <p className="text-md text-gray-600 mb-4">
                        <strong>Price:</strong> $
                        {subscription.price.toFixed(2)}
                      </p>

                      {/* Action Button */}
                      <button
                          className="px-4 py-2 bg-primary text-white rounded shadow hover:opacity-90"
                      >
                        Manage Subscription
                      </button>
                    </div>
                ))}
              </div>
          ) : (
              <p className="text-md text-gray-600">
                You currently have no active subscriptions.
              </p>
          )}
        </div>
      </div>
  );
};

export default Subscriptions;