import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Nav = () => {
    const { t } = useTranslation();

    const navItems = [
        { id: 1, name: t("Cart"), path: "/cart", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
        { id: 2, name: t("Partners"), path: "/partners", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" },
    ];

    const sidelistItems = [
        { id: 1, name: t("Contact"), path: "/contact" },
        { id: 2, name: t("About"), path: "/about" },
        { id: 3, name: t("Support"), path: "/support" },
    ];

    const [isSidelistOpen, setIsSidelistOpen] = useState(false);

    const toggleSidelist = () => {
        setIsSidelistOpen((prev) => !prev);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 relative">
                    {/* Left Navigation Items */}
                    <div className="flex items-center space-x-4 flex-1 justify-end">
                        {navItems.map((item) => (
                            <NavLink
                                to={item.path}
                                key={item.id}
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-4 py-2 text-sm font-medium transition-colors ${
                                        isActive ? "text-primary" : "text-gray-600 hover:text-primary"
                                    }`
                                }
                            >
                                <svg
                                    className="w-6 h-6 mb-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={item.icon}
                                    />
                                </svg>
                                <span className="text-xs">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Toggle Button (Sticky Footer) */}
                    <div className="flex items-center justify-center flex-none relative">
                        <button
                            onClick={toggleSidelist}
                            className={`w-10 h-10 flex items-center justify-center shadow-md rounded-lg  
                            ${
                                isSidelistOpen ? "bg-gray-300" : "bg-white"
                            } transition-all duration-300 ease-in-out`}
                        >
                            {/* Button Icon */}
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={
                                        !isSidelistOpen
                                            ? "M6 18L18 6M6 6l12 12" // "X" Icon for Close
                                            : "M4 6h16M4 12h16m-7 6h7" // Icon for Menu
                                    }
                                />
                            </svg>
                        </button>
                        {isSidelistOpen && (
                            <ul className="absolute bottom-16 left-0 right-0 bg-white shadow-lg rounded-lg z-20 p-4 space-y-2">
                                {sidelistItems.map((item) => (
                                    <li key={item.id}>
                                        <NavLink
                                            to={item.path}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                        >
                                            {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;