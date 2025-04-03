import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assets } from '../assets/assets';
import cartIcon from "../assets/cart.svg"; // Cart icon asset
import useAuthStore from "../store/authStore"; // Auth store

const Header = () => {
    const { t } = useTranslation(); // Initialize translation
    const navigate = useNavigate();

    // Access cart and auth states/methods
    const cart = useAuthStore((state) => state.cart);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const userData = useAuthStore((state) => state.userData);
    const visitorId = useAuthStore((state) => state.visitorId);
    const logOutUser = useAuthStore((state) => state.logOutUser);
    const initializeVisitor = useAuthStore((state) => state.initializeVisitor);
    const loading = useAuthStore((state) => state.loading);

    const [showMenu, setShowMenu] = useState(false); // State to toggle dropdown visibility

    // Compute total cart items
    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Initialize visitor if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !visitorId) {
            initializeVisitor();
        }
    }, [isAuthenticated, visitorId, initializeVisitor]);

    // Event handlers
    const handleCartClick = () => navigate("/cart");
    const handleLogin = () => navigate("/login");
    const handleLogout = () => {
        logOutUser();
        navigate("/");
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header Section */}
            <header className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
                {/* --------- Header Left --------- */}
                <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight'>
                        {t('book_appointment')} <br /> {t('with_trusted_doctors')}
                    </p>
                    <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                        <img className='w-20' src={assets.group_profiles} alt="" />
                        <p>
                            {t('browse_doctors')} <br className='hidden sm:block' /> {t('schedule_hassle_free')}
                        </p>
                    </div>
                    <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                        {t('book_appointment')} <img className='w-3' src={assets.arrow_icon} alt="" />
                    </a>
                </div>

                {/* --------- Header Right --------- */}
                <div className='md:w-1/2 relative'>
                    <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
                </div>
            </header>

            {/* Navbar (Integrated from Navbar.jsx) */}
            <nav className="flex items-center justify-between py-4 px-6 bg-gray-100">
                {/* Logo */}
                <img
                    src={assets.logo}
                    alt="App Logo"
                    className="cursor-pointer w-44"
                    onClick={() => navigate("/")}
                />

                {/* Desktop navigation links */}
                <ul className="hidden md:flex gap-6 items-center text-sm font-medium">
                    <NavLink to="/" className="hover:text-primary">{t("home")}</NavLink>
                    <NavLink to="/partners" className="hover:text-primary">{t("partners")}</NavLink>
                    <NavLink to="/services" className="hover:text-primary">{t("services")}</NavLink>
                    <NavLink to="/about" className="hover:text-primary">{t("about")}</NavLink>
                    <NavLink to="/contact" className="hover:text-primary">{t("contact")}</NavLink>
                    <NavLink to="/subscriptions" className="hover:text-primary">{t("subscriptions")}</NavLink>
                </ul>

                {/* Cart button */}
                <button
                    onClick={handleCartClick}
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

                {/* Auth section */}
                {isAuthenticated && userData ? (
                    <div>
                        <span className="text-sm font-medium">{userData.name}</span>
                        <button onClick={handleLogout} className="ml-4 text-sm text-red-500 hover:underline">
                            {t("logout")}
                        </button>
                    </div>
                ) : (
                    <button onClick={handleLogin} className="text-sm text-primary hover:underline">
                        {t("login")}
                    </button>
                )}
            </nav>

            {/* Footer */}
            <footer className="bg-gray-100 py-6 mt-auto">
                <div className="container mx-auto text-center">
                    <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
                        <ul>
                            <li>920025092</li>
                            <li>info@lahm.sa</li>
                        </ul>
                    </div>
                    <hr />
                    <p className="py-5 text-sm">
                        {t("copyright", { year: 2025 })}
                    </p>
                    <p className="text-xsm text-center">www.lahm.sa</p>
                </div>
            </footer>
        </div>
    );
};

export default Header;