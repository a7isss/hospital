import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartContext } from "../context/CartContext"; // Keeping CartContext as-is for cart handling
import { assets } from "../assets/assets"; // Assets like logo
import cartIcon from "../assets/cart.svg"; // Cart icon asset
import useAuthStore from "../store/authStore"; // Import Zustand authStore

const Navbar = () => {
    const { t } = useTranslation(); // For i18n translations
    const navigate = useNavigate(); // Navigation hook

    const { cart } = CartContext(); // Fetch cart state from CartContext

    // Access Zustand authStore
    const {
        token,
        userData,
        visitorId,
        isAuthenticated,
        logOutUser,
        initializeVisitor,
        loading,
    } = useAuthStore();

    const [showMenu, setShowMenu] = useState(false); // State to toggle dropdown visibility

    // Calculate the total number of items in the cart
    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Handle cart icon click
    const handleCartClick = () => {
        navigate("/cart");
    };

    // Handle login navigation
    const handleLogin = () => {
        navigate("/login");
    };

    // Handle logout
    const handleLogout = () => {
        logOutUser(); // Clear user data and switch to visitor mode
        navigate("/");
    };

    // Initialize visitor mode if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !visitorId) {
            initializeVisitor();
        }
    }, [isAuthenticated, visitorId, initializeVisitor]);

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
                <NavLink to="/subscriptions" className="hover:text-primary">
                    {t("subscriptions")}
                </NavLink>
            </ul>

            {/* Cart Button */}
            <button
                onClick={handleCartClick}
                className="relative flex items-center hover:text-primary"
            >
                {/* Cart icon */}
                <img
                    src={cartIcon}
                    alt="Cart Icon"
                    className="w-6 h-6 object-contain"
                />
                {/* Cart item count badge */}
                {totalCartItems > 0 && (
                    <span className="absolute top-0 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalCartItems}
                    </span>
                )}
            </button>

            {/* Auth Section */}
            {isAuthenticated && userData ? (
                // If user is logged in
                <div className="flex flex-col items-end text-sm">
                    <span className="text-gray-800 font-medium">{t("welcome")}</span>
                    <span className="font-bold text-primary">{userData?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 text-xs mt-1 hover:text-red-700"
                    >
                        {t("logout")}
                    </button>
                </div>
            ) : (
                // If visitor or unauthenticated user
                <div className="flex items-center gap-4">
                    {loading ? (
                        <span className="text-gray-500 text-sm">{t("loading")}</span>
                    ) : (
                        <>
                            <button
                                onClick={handleLogin}
                                className="bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                            >
                                {t("login")}
                            </button>
                            <span className="text-gray-500 text-sm">
                                Visitor ID: {visitorId || t("loading")}
                            </span>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;