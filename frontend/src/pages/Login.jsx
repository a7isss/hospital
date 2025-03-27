import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext'; // Import CartContext to manage visitorID
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation(); // Initialize translation
  const { setToken, setUserData } = useContext(AppContext); // Access AppContext for setting token and user data
  const { visitorID, setVisitorID } = useContext(CartContext); // Access CartContext for visitorID
  const navigate = useNavigate(); // Navigation hook
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Registration logic
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
          name,
          email,
          password,
          phone,
          age,
          gender,
        });
        toast.success(t('registration_success'));
        // Optionally, log in the user after registration
        setIsRegistering(false);
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setAge('');
        setGender('');
      } else {
        // Login logic
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
          email,
          password,
        });
        const { token, user } = response.data;
        setToken(token);
        setUserData(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(t('login_success'));
        navigate('/');
      }
    } catch (error) {
      console.error("Login/Registration error:", error);
      toast.error(error.response?.data?.message || t('login_registration_error'));
    }
  };

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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                />
              </div>

              {/* Password Input */}
              <div className="w-full">
                <p>{t('password')}</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                />
              </div>
            </div>

            {/* Registration Fields */}
            <div className={`absolute top-0 left-0 w-full transition-all duration-300 ${isRegistering ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
              {/* Name Input */}
              <div className="w-full">
                <p>{t('name')}</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                />
              </div>

              {/* Email Input */}
              <div className="w-full">
                <p>{t('email')}</p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                />
              </div>

              {/* Password Input */}
              <div className="w-full">
                <p>{t('password')}</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                />
              </div>

              {/* Phone Input */}
              <div className="w-full">
                <p>{t('phone')}</p>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                />
              </div>

              {/* Age Input */}
              <div className="w-full">
                <p>{t('age')}</p>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                />
              </div>

              {/* Gender Input */}
              <div className="w-full">
                <p>{t('gender')}</p>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                >
                  <option value="">{t('select_gender')}</option>
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
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
