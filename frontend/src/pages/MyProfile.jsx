import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore'; // Zustand's authStore
import { assets } from '../assets/assets';

const MyProfile = () => {
  const { t } = useTranslation(); // Translation hook
  const { userData, setUserData, token, backendUrl } = useAuthStore((state) => ({
    userData: state.userData,
    setUserData: state.setUserData,
    token: state.token,
    backendUrl: state.backendUrl,
  }));

  const [isEdit, setIsEdit] = useState(false); // Toggle between editing and viewing
  const [image, setImage] = useState(null); // Profile image for upload

  // Validate user data to match userSchema
  const validateUserData = (user) => {
    if (!user) return false;
    const { name, phone, age, gender, sub } = user;
    if (
        typeof name !== 'string' ||
        typeof phone !== 'string' ||
        typeof age !== 'number' ||
        !['male', 'female'].includes(gender) ||
        typeof sub !== 'object'
    ) {
      return false;
    }
    return true;
  };

  // Function to dynamically update user profile data using API
  const updateUserProfileData = async () => {
    if (!validateUserData(userData)) {
      toast.error(t('invalid_user_data'));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('age', userData.age);
      formData.append('gender', userData.gender);
      if (userData.email) formData.append('email', userData.email);
      image && formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(t('profile_updated_successfully'));
        setUserData(data.updatedUser); // Update Zustand store
        setIsEdit(false); // Exit edit mode
        setImage(null); // Reset image
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(t('error_updating_profile'));
    }
  };

  // If user data is invalid, show an error message
  if (!validateUserData(userData)) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          <p className="text-lg text-gray-600">{t('invalid_user_data')}</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto p-6 max-w-3xl bg-white shadow-md rounded-lg">
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block">
            <label htmlFor="profile-pic">
              {isEdit ? (
                  <>
                    <img
                        className="w-36 h-36 rounded-full cursor-pointer opacity-75"
                        src={image ? URL.createObjectURL(image) : userData.image}
                        alt={t('profile_picture')}
                    />
                    <img
                        className="w-10 absolute bottom-0 right-0 cursor-pointer"
                        src={image ? '' : assets.upload_icon}
                        alt=""
                    />
                    <input
                        type="file"
                        id="profile-pic"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                  </>
              ) : (
                  <img className="w-36 h-36 rounded-full" src={userData.image} alt={t('profile_picture')} />
              )}
            </label>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{userData.name}</h1>
        </div>

        {/* Profile Details */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">{t('personal_details')}</h2>
          <div className="grid grid-cols-2 gap-6 mt-4 text-gray-600 text-sm">
            <div>
              <label className="block font-semibold">{t('name')}</label>
              {isEdit ? (
                  <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.name}
                      onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                  />
              ) : (
                  <p>{userData.name}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">{t('phone')}</label>
              {isEdit ? (
                  <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.phone}
                      onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
              ) : (
                  <p>{userData.phone}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">{t('email')}</label>
              {isEdit ? (
                  <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.email || ''}
                      onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                  />
              ) : (
                  <p>{userData.email || t('not_provided')}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">{t('age')}</label>
              {isEdit ? (
                  <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.age}
                      onChange={(e) => setUserData((prev) => ({ ...prev, age: Number(e.target.value) }))}
                  />
              ) : (
                  <p>{userData.age}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">{t('gender')}</label>
              {isEdit ? (
                  <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.gender}
                      onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="male">{t('male')}</option>
                    <option value="female">{t('female')}</option>
                  </select>
              ) : (
                  <p>{t(userData.gender)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          {isEdit ? (
              <>
                <button
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    onClick={() => setIsEdit(false)}
                >
                  {t('cancel')}
                </button>
                <button
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    onClick={updateUserProfileData}
                >
                  {t('save')}
                </button>
              </>
          ) : (
              <button
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  onClick={() => setIsEdit(true)}
              >
                {t('edit_profile')}
              </button>
          )}
        </div>
      </div>
  );
};

export default MyProfile;