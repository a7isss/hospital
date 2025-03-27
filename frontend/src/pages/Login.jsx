import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
      <div className="min-h-[80vh] flex items-center">
        <form
            onSubmit={onSubmitHandler}
            className={`flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg transition-all duration-300 ${
                isRegistering ? 'scale-105' : 'scale-100'
            }`}
        >
          {/* Toggle Button */}
          <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-gray-500 hover:text-black transition-colors self-end"
          >
            {isRegistering ? t('have_account') : t('need_account')}
          </button>

          {/* Animated Form Container */}
          <div className="relative w-full overflow-hidden">
            <div className={`transition-all duration-300 ${isRegistering ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
              {/* Email Input */}
              <div className="w-full">
                <p>{t('email')}</p>
                <input
                    // ... existing email input props
                />
              </div>

              {/* Password Input */}
              <div className="w-full">
                <p>{t('password')}</p>
                <input
                    // ... existing password input props
                />
              </div>
            </div>

            {/* Registration Fields */}
            <div className={`absolute top-0 left-0 w-full transition-all duration-300 ${isRegistering ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
              {/* Name Input */}
              {isRegistering && (
                  <div className="w-full">
                    <p>{t('name')}</p>
                    <input
                        // ... add name input props
                    />
                  </div>
              )}

              {/* Phone Input */}
              {isRegistering && (
                  <div className="w-full">
                    <p>{t('phone')}</p>
                    <input
                        // ... add phone input props
                    />
                  </div>
              )}

              {/* Age Input */}
              {isRegistering && (
                  <div className="w-full">
                    <p>{t('age')}</p>
                    <input
                        // ... add age input props
                    />
                  </div>
              )}

              {/* Gender Input */}
              {isRegistering && (
                  <div className="w-full">
                    <p>{t('gender')}</p>
                    <select
                        // ... add gender select props
                    >
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                      <option value="other">{t('other')}</option>
                    </select>
                  </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
              type="submit"
              className="bg-black text-white w-full py-2 rounded-md text-base hover:bg-gray-800 transition-colors"
          >
            {isRegistering ? t('register') : t('login')}
          </button>
        </form>
      </div>
  );
};

export default Login;
