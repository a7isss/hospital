import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidelist = () => {
    const [isOpen, setIsOpen] = useState(false); // State to track if the sidelist is open

    // Function to toggle sidelist open/close state
    const toggleSidelist = () => {
        setIsOpen((prev) => !prev); // Toggle the state between open and closed
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            {/* This button will center itself with the nav items equally spaced around it */}
            <div className="absolute inset-x-0 flex justify-center -top-6">
                {!isOpen && (
                    <button
                        onClick={toggleSidelist}
                        className="bg-black w-20 h-8 flex items-center justify-center shadow-md"
                        style={{
                            border: "1px solid white",
                            backgroundColor: "black",
                            color: "white",
                        }}
                    >
                        {/* Three horizontal lines inside the button */}
                        <div className="space-y-1">
                            <div className="w-10 h-[2px] bg-white"></div>
                            <div className="w-10 h-[2px] bg-white"></div>
                            <div className="w-10 h-[2px] bg-white"></div>
                        </div>
                    </button>
                )}
            </div>

            {/* Sliding Sidelist */}
            {/* When `isOpen` is true, the list content will appear below the nav */}
            {isOpen && (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-4 transition-all duration-300">
                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={toggleSidelist}
                            className="text-gray-600 hover:text-black"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Sidelist Items */}
                    <ul className="flex flex-col items-start mt-4 space-y-4">
                        <li>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-md text-sm font-semibold ${
                                        isActive
                                            ? "text-primary bg-gray-100"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                                    }`
                                }
                            >
                                Contact
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-md text-sm font-semibold ${
                                        isActive
                                            ? "text-primary bg-gray-100"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                                    }`
                                }
                            >
                                About
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/help"
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-md text-sm font-semibold ${
                                        isActive
                                            ? "text-primary bg-gray-100"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                                    }`
                                }
                            >
                                Help
                            </NavLink>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
export default Sidelist;