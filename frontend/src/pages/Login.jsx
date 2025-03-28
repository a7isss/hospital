import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Login = () => {
  const { t } = useTranslation(); // Initialize translation
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'male', // Default gender
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (not assigned backend-wise yet)
    console.log(formData);
  };

  return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{isRegistering ? t('Register') : t('Login')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
              <>
                <input
                    type="text"
                    name="name"
                    placeholder={t('Full Name')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder={t('Phone Number')}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <input
                    type="number"
                    name="age"
                    placeholder={t('Age')}
                    value={formData.age}
                    onChange={handleInputChange}
                    min="10"
                    max="120"
                    required
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="male">{t('Male')}</option>
                  <option value="female">{t('Female')}</option>
                </select>
              </>
          )}
          <input
              type="password"
              name="password"
              placeholder={t('Password')}
              value={formData.password}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-md p-2 w-full"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">
            {isRegistering ? t('Register') : t('Login')}
          </button>
        </form>
        <p className="mt-4">
          {isRegistering ? t('Already have an account?') : t('Need an account?')}
          <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 ml-1"
          >
            {isRegistering ? t('Login') : t('Register')}
          </button>
        </p>
      </div>
  );
};

export default Login;
