import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidelist = () => {
    const [isOpen, setIsOpen] = useState(false); // State to track if the sidelist is open

    // Function to toggle sidelist open/close state
    const toggleSidelist = () => {
        setIsOpen((prev) => !prev); // Toggle the state
    };

    return (
        <div
            className={`fixed inset-x-0 bottom-0 ${
                isOpen ? "z-20" : "z-10"
            } transition-transform duration-300`}
            style={{
                transform: isOpen ? "translateY(0)" : "translateY(100%)", // Shows or hides the list
            }}
        >
            {/* Sidelist Content */}
            <div className="bg-white border-t border-gray-200 shadow-md">
                {/* Close Button */}
                {isOpen && (
                    <div className="flex items-center justify-center h-16 bg-black">
                        <button
                            onClick={toggleSidelist}
                            className="bg-black w-20 h-8 flex items-center justify-center shadow-md"
                            style={{
                                border: "1px solid white",
                                color: "white",
                            }}
                        >
                            {/* Vertical Lines */}
                            <div className="space-x-1 flex">
                                <div className="w-[2px] h-6 bg-white"></div>
                                <div className="w-[2px] h-6 bg-white"></div>
                                <div className="w-[2px] h-6 bg-white"></div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Sidelist Items */}
                {isOpen && (
                    <ul className="flex flex-row justify-around items-center h-16">
                        <li>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-4 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-primary"
                                            : "text-gray-600 hover:text-primary"
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
                                    `flex flex-col items-center px-4 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-primary"
                                            : "text-gray-600 hover:text-primary"
                                    }`
                                }
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/support"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-4 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-primary"
                                            : "text-gray-600 hover:text-primary"
                                    }`
                                }
                            >
                                Support
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/help"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-4 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-primary"
                                            : "text-gray-600 hover:text-primary"
                                    }`
                                }
                            >
                                Help
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>

            {/* Toggle Button */}
            {!isOpen && (
                <div className="absolute inset-x-0 flex justify-center bottom-0">
                    <button
                        onClick={toggleSidelist}
                        className="bg-black w-20 h-16 flex items-center justify-center shadow-md"
                        style={{
                            border: "1px solid white",
                            color: "white",
                        }}
                    >
                        {/* Horizontal Lines */}
                        <div className="space-y-1">
                            <div className="w-10 h-[2px] bg-white"></div>
                            <div className="w-10 h-[2px] bg-white"></div>
                            <div className="w-10 h-[2px] bg-white"></div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidelist;