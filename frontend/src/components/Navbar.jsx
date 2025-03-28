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
    const { token, logout, userData } = useContext(AppContext); // AppContext: Handle user data and auth

    const [showMenu, setShowMenu] = useState(false); // State: Toggling dropdown visibility

    // Calculate the total number of items in the cart
    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Handle cart navigation when cart icon is clicked
    const handleCartClick = () => {
        navigate("/cart"); // No need to fetchCart - it's handled by CartContext
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
                <NavLink to="/doctors" className="hover:text-primary">
                    {t("all_doctors")}
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
            {token && userData ? (
                <div className="flex items-center gap-3 relative">
                    {/* User Profile Avatar */}
                    <img
                        src={userData.image || "https://via.placeholder.com/150"} // Fallback placeholder avatar
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => setShowMenu(!showMenu)}
                    />
                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md rounded z-50">
                            <p
                                onClick={() => navigate("/my-profile")}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            >
                                {t("my_profile")}
                            </p>
                            <p
                                onClick={logout}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            >
                                {t("logout")}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <NavLink to="/login" className="text-primary hover:text-secondary">
                    {t("login")}
                </NavLink>
            )}
        </nav>
    );
};

export default Navbar;
