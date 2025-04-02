import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidelist = () => {
    const [isOpen, setIsOpen] = useState(false); // State to track if the menu is open

    const toggleSidelist = () => {
        setIsOpen(!isOpen); // Toggle the open/close state
    };

    return (
        <div className="relative">
            {/* Button to toggle the sidelist */}
            <button
                onClick={toggleSidelist}
                className="fixed bottom-5 right-5 bg-primary text-white p-3 rounded-full shadow-md focus:outline-none"
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
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
            </button>

            {/* Sidelist container */}
            {isOpen && (
                <div className="fixed bottom-0 right-0 bg-white w-64 shadow-lg rounded-t-lg pb-5">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-medium text-primary">Menu</h3>
                    </div>

                    <ul className="flex flex-col items-end p-4 space-y-4">
                        {/* Contact page */}
                        <li>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-md text-sm font-semibold ${
                                        isActive
                                            ? 'text-primary bg-gray-100'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                                    }`
                                }
                            >
                                Contact
                            </NavLink>
                        </li>

                        {/* Placeholder 1 */}
                        <li>
                            <NavLink
                                to="/placeholder1"
                                className="block px-4 py-2 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-primary"
                            >
                                Placeholder 1
                            </NavLink>
                        </li>

                        {/* Placeholder 2 */}
                        <li>
                            <NavLink
                                to="/placeholder2"
                                className="block px-4 py-2 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-primary"
                            >
                                Placeholder 2
                            </NavLink>
                        </li>

                        {/* Placeholder 3 */}
                        <li>
                            <NavLink
                                to="/placeholder3"
                                className="block px-4 py-2 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-primary"
                            >
                                Placeholder 3
                            </NavLink>
                        </li>

                        {/* Placeholder 4 */}
                        <li>
                            <NavLink
                                to="/placeholder4"
                                className="block px-4 py-2 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-primary"
                            >
                                Placeholder 4
                            </NavLink>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidelist;// side options
