import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext'; // Import CartContext
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation
  const { cart } = useContext(CartContext); // Access cart data from CartContext
  const { token, setToken, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  // Calculate total items in the cart
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
      <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
        {/* Logo */}
        <img
            onClick={() => navigate('/')}
            className='w-44 cursor-pointer'
            src={assets.logo}
            alt="Logo"
        />

        {/* Desktop Nav Links */}
        <ul className='md:flex items-start gap-5 font-medium hidden'>
          <NavLink to='/'>
            <li className='py-1'>{t('home')}</li>
          </NavLink>
          <NavLink to='/doctors'>
            <li className='py-1'>{t('all_doctors')}</li>
          </NavLink>
          <NavLink to='/about'>
            <li className='py-1'>{t('about')}</li>
          </NavLink>
          <NavLink to='/contact'>
            <li className='py-1'>{t('contact')}</li>
          </NavLink>

          {/* Cart link */}
          <NavLink to='/cart'>
            <li className='relative py-1 flex items-center'>
              <span className="mr-2">{t('cart')}</span>
              <div className="relative flex items-center justify-center">
                <span
                    className={`absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                        cart.length === 0 ? 'hidden' : ''
                    }`}
                >
                  {totalCartItems}
                </span>
              </div>
            </li>
          </NavLink>
        </ul>

        {/* Right-Side User Section */}
        <div className='flex items-center gap-4'>
          {/* User Dropdown */}
          {token && userData ? (
              <div className='flex items-center gap-2 cursor-pointer group relative'>
                <img className='w-8 rounded-full' src={userData.image} alt="User Avatar" />
                <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                  <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                    <p
                        onClick={() => navigate('/my-profile')}
                        className='hover:text-black cursor-pointer'
                    >
                      {t('my_profile')}
                    </p>
                    <p
                        onClick={() => navigate('/my-appointments')}
                        className='hover:text-black cursor-pointer'
                    >
                      {t('my_appointments')}
                    </p>
                    <p
                        onClick={logout}
                        className='hover:text-black cursor-pointer'
                    >
                      {t('logout')}
                    </p>
                  </div>
                </div>
              </div>
          ) : (
              <button
                  onClick={() => navigate('/login')}
                  className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'
              >
                {t('create_account')}
              </button>
          )}

          {/* Hamburger Menu Icon for Mobile */}
          <img
              onClick={() => setShowMenu(true)}
              className='w-6 md:hidden'
              src={assets.menu_icon}
              alt="Menu Icon"
          />
        </div>

        {/* Mobile Menu */}
        <div
            className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="Mobile Menu Logo" />
            <img
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                className='w-7'
                alt="Close Icon"
            />
          </div>
          <ul className='px-6'>
            <NavLink to='/'>
              <li onClick={() => setShowMenu(false)} className='py-3'>{t('home')}</li>
            </NavLink>
            <NavLink to='/doctors'>
              <li onClick={() => setShowMenu(false)} className='py-3'>{t('all_doctors')}</li>
            </NavLink>
            <NavLink to='/about'>
              <li onClick={() => setShowMenu(false)} className='py-3'>{t('about')}</li>
            </NavLink>
            <NavLink to='/contact'>
              <li onClick={() => setShowMenu(false)} className='py-3'>{t('contact')}</li>
            </NavLink>
            <NavLink to='/cart'>
              <li onClick={() => setShowMenu(false)} className='py-3'>
                {t('cart')} ({totalCartItems})
              </li>
            </NavLink>
          </ul>
        </div>
      </div>
  );
};

export default Navbar;