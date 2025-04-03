import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assets } from '../assets/assets';
import cartIcon from "../assets/cart.svg"; // Cart icon asset
import useAuthStore from "../store/authStore"; // Auth store

const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cart = useAuthStore((state) => state.cart);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const userData = useAuthStore((state) => state.userData);
    const visitorId = useAuthStore((state) => state.visitorId);
    const logOutUser = useAuthStore((state) => state.logOutUser);
    const initializeVisitor = useAuthStore((state) => state.initializeVisitor);
    const loading = useAuthStore((state) => state.loading);

    const [showMenu, setShowMenu] = useState(false);

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (!isAuthenticated && !visitorId) {
            initializeVisitor();
        }
    }, [isAuthenticated, visitorId, initializeVisitor]);

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

                {/* Auth Section */}
                {isAuthenticated && userData ? (
                    <div>
                        <span className="text-sm font-medium">{userData.name}</span>
                        <button onClick={() => logOutUser()} className="ml-4 text-sm text-red-500 hover:underline">
                            {t("logout")}
                        </button>
                    </div>
                ) : (
                    <button onClick={() => navigate("/login")} className="text-sm text-primary hover:underline">
                        {t("login")}
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;