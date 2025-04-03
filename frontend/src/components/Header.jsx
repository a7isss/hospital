import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assets } from '../assets/assets';
import cartIcon from "../assets/cart.svg"; // Cart icon asset
import useAuthStore from "../store/authStore"; // Auth store

const Header = () => {
    const { t } = useTranslation(); // For translations
    const navigate = useNavigate();

    // Extract relevant state and actions from authStore
    const {
        cart,                      // Cart items
        isAuthenticated,           // User authentication status
        userData,                  // User data if authenticated
        visitorId,                 // Visitor ID if not authenticated
        logoutUser,                // Logout action
        initializeVisitorCart,     // Ensure visitor session and cart initialization
        loading,                   // Global loading state
    } = useAuthStore((state) => ({
        cart: state.cart,
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
        visitorId: state.visitorId,
        logoutUser: state.logoutUser,
        initializeVisitorCart: state.initializeVisitorCart,
        loading: state.loading,
    }));

    // Total number of items in the cart
    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Automatically initialize visitor cart if no visitorId exists and the user isn't authenticated
    useEffect(() => {
        if (!isAuthenticated && !visitorId) {
            initializeVisitorCart(); // Ensure visitor cart is ready
        }
    }, [isAuthenticated, visitorId, initializeVisitorCart]);

    return (
        <header className="bg-gray-100 shadow-md sticky top-0 z-50">
            <div className="flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <img
                    src={assets.logo}
                    alt="App Logo"
                    className="cursor-pointer w-44"
                    onClick={() => navigate("/")}
                />

                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-6 items-center text-sm font-medium">
                    <NavLink to="/" className="hover:text-primary">{t("home")}</NavLink>
                    <NavLink to="/partners" className="hover:text-primary">{t("partners")}</NavLink>
                    <NavLink to="/services" className="hover:text-primary">{t("services")}</NavLink>
                    <NavLink to="/about" className="hover:text-primary">{t("about")}</NavLink>
                    <NavLink to="/contact" className="hover:text-primary">{t("contact")}</NavLink>
                    <NavLink to="/subscriptions" className="hover:text-primary">{t("subscriptions")}</NavLink>
                </ul>

                {/* Cart Button */}
                <button
                    onClick={() => navigate("/cart")}
                    className="relative flex items-center hover:text-primary"
                    disabled={loading}
                >
                    <img src={cartIcon} alt="Cart Icon" className="w-6 h-6 object-contain" />
                    {!loading && totalCartItems > 0 && (
                        <span className="absolute top-0 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalCartItems}
                        </span>
                    )}
                </button>

                {/* Authentication Section */}
                {isAuthenticated && userData ? (
                    // Show user name and logout button if authenticated
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{userData.name}</span>
                        <button
                            onClick={() => logoutUser()} // Trigger logout
                            className="text-sm text-red-500 hover:underline"
                        >
                            {t("logout")}
                        </button>
                    </div>
                ) : (
                    // Show login button if not authenticated
                    <button
                        onClick={() => navigate("/login")}
                        className="text-sm text-primary hover:underline"
                    >
                        {t("login")}
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;