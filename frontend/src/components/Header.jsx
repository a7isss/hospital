import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import cartIcon from "../assets/cart.svg"; // Cart icon asset
import useVisitorStore from "../store/visitorStore"; // Import visitorStore for cart and visitor logic

const Header = () => {
    const { t } = useTranslation(); // For translations
    const navigate = useNavigate();

    // Access visitorStore state and actions
    const { cart, generateVisitorId, visitorId } = useVisitorStore();

    // Ensure the visitorId is initialized
    useEffect(() => {
        if (!visitorId) {
            generateVisitorId();
        }
    }, [visitorId, generateVisitorId]);

    // Calculate total cart item count
    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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
                >
                    <img src={cartIcon} alt="Cart Icon" className="w-6 h-6 object-contain" />
                    {totalCartItems > 0 && (
                        <span className="absolute top-0 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalCartItems}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;