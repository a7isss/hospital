import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartContext } from "../context/CartContext";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets"; // Additional assets like logo
import cartIcon from "../assets/cart.svg"; // Import cart.svg icon

const Navbar = () => {
    const { t } = useTranslation(); // Localization with i18n
    const navigate = useNavigate(); // Navigation hook

    const { cart } = useContext(CartContext); // CartContext: Handle cart states
    const { token, logout, userData, logInUser } = useContext(AppContext); // AppContext: Handle user data and auth

    const [showMenu, setShowMenu] = useState(false); // State: Toggling dropdown visibility

    // Calculate the total number of items in the cart
    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Handle cart navigation when cart icon is clicked
    const handleCartClick = () => {
        navigate("/cart"); // Navigate to the cart page
    };

    // Handle Login Redirection
    const handleLogin = () => {
        navigate("/login"); // Redirect to login page
    };

    return (
        <nav className="flex items-center justify-between py-4 px-6">
            {/* Logo */}
            <img
                src={assets.logo}
                alt="App Logo"
                className="cursor-pointer w-44"
                onClick={() => navigate("/")}
            />

            {/* Desktop Navigation */}
            <ul className="hidden md:flex gap-6 items-center text-sm font-medium">
                <NavLink to="/" className="hover:text-primary">
                    {t("home")}
                </NavLink>
                <NavLink to="/Partners" className="hover:text-primary">
                    {t("Partners")}
                </NavLink>
                <NavLink to="/services" className="hover:text-primary">
                    {t("services")}
                </NavLink>
                <NavLink to="/about" className="hover:text-primary">
                    {t("about")}
                </NavLink>
                <NavLink to="/contact" className="hover:text-primary">
                    {t("contact")}
                </NavLink>
                {/* New Subscriptions Page Link */}
                <NavLink to="/subscriptions" className="hover:text-primary">
                    {t("subscriptions")} {/* Localization using i18n */}
                </NavLink>
            </ul>

            {/* Cart Button */}
            <button
                onClick={handleCartClick}
                className="relative flex items-center hover:text-primary"
            >
                {/* Cart Icon */}
                <img
                    src={cartIcon}
                    alt="Cart Icon"
                    className="w-6 h-6 object-contain"
                />
                {/* Cart Item Count Badge */}
                {totalCartItems > 0 && (
                    <span className="absolute top-0 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalCartItems}
                    </span>
                )}
            </button>

            {/* User Profile or Login */}
            {
                token && userData ? (
                    // If user is logged in
                    <div className="flex flex-col items-end text-sm">
                        <span className="text-gray-800 font-medium">Welcome</span>
                        <span className="font-bold text-primary">{userData.name}</span>
                    </div>
                ) : (
                    // If user is not logged in
                    <button
                        onClick={handleLogin}
                        className="bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                    >
                        {t("login")}
                    </button>
                )
            }
        </nav>
    );
};

export default Navbar;