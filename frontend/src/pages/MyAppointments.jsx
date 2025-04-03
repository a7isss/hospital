import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore'; // Zustand's authStore

const MyAppointments = () => {
  const { t } = useTranslation(); // Translation hook
  const userData = useAuthStore((state) => state.userData); // Authenticated user data
  const token = useAuthStore((state) => state.token); // JWT token
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Authentication status
  const backendUrl = useAuthStore((state) => state.backendUrl); // Backend URL
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');

  const months = [
    t('jan'),
    t('feb'),
    t('mar'),
    t('apr'),
    t('may'),
    t('jun'),
    t('jul'),
    t('aug'),
    t('sep'),
    t('oct'),
    t('nov'),
    t('dec'),
  ];

  // Validate user data based on userSchema
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

  // Format the appointment date for display (e.g., 20_01_2000 -> 20 Jan 2000)
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2];
  };

  // Fetch user appointments from the API
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      setAppointments(data.appointments.reverse()); // Reverse to show recent appointments first
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(t('error_fetching_appointments'));
    }
  };

  // Cancel an appointment using the API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
          `${backendUrl}/api/user/cancel-appointment`,
          { appointmentId },
          { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); // Refresh appointments
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(t('error_cancelling_appointment'));
    }
  };

  // Fetch appointments on component mount if token is present
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Ensure user data matches schema
  if (!validateUserData(userData)) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
          <p className="text-lg text-gray-600">{t('invalid_user_data')}</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        {/* Header */}
        <div className="bg-primary text-white py-4 text-center shadow-md">
          <h1 className="text-3xl font-bold">{t('my_appointments')}</h1>
        </div>

        {/* Personalized greeting for authenticated users */}
        {isAuthenticated && userData && (
            <div className="bg-gray-100 py-4 px-6 text-gray-800 text-lg text-center">
              {t('hello')}, <span className="font-medium">{userData.name}</span>! {t('here_are_your_appointments')}.
            </div>
        )}

        <div className="container mx-auto mt-8">
          {/* Empty Appointments Message */}
          {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 text-gray-600 min-h-[60vh]">
                <p className="text-2xl font-medium">{t('no_appointments')}</p>
                <p className="text-sm">{t('book_appointment_now')}</p>
                <button
                    onClick={() => navigate('/services')}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200"
                >
                  {t('browse_services')}
                </button>
              </div>
          ) : (
              /* Appointments List */
              <div className="space-y-6">
                {appointments.map((item) => (
                    <div
                        key={item._id}
                        className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                      {/* Doctor Image */}
                      <div className="w-full sm:w-36">
                        <img
                            className="w-36 bg-[#EAEFFF] rounded-md"
                            src={item.docData.image || 'https://via.placeholder.com/150'}
                            alt={item.docData.name}
                        />
                      </div>

                      {/* Appointment Details */}
                      <div className="flex-1 text-sm text-[#5E5E5E]">
                        <p className="text-[#262626] text-base font-semibold">
                          {item.docData.name}
                        </p>
                        <p>{item.docData.speciality}</p>
                        <p className="text-[#464646] font-medium mt-1">{t('address')}</p>
                        <p>{item.docData.address.line1}</p>
                        <p>{item.docData.address.line2}</p>
                        <p className="mt-1">
                    <span className="text-sm text-[#3C3C3C] font-medium">
                      {t('date_and_time')}:
                    </span>{' '}
                          {slotDateFormat(item.slotDate)} | {item.slotTime}
                        </p>
                      </div>

                      {/* Appointment Actions */}
                      <div className="flex flex-col gap-2 justify-end text-sm text-center">
                        {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                            <button
                                onClick={() => setPayment(item._id)}
                                className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              {t('pay_online')}
                            </button>
                        )}
                        {!item.cancelled && item.payment && !item.isCompleted && (
                            <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]">
                              {t('paid')}
                            </button>
                        )}
                        {item.isCompleted && (
                            <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                              {t('completed')}
                            </button>
                        )}
                        {!item.cancelled && !item.isCompleted && (
                            <button
                                onClick={() => cancelAppointment(item._id)}
                                className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                              {t('cancel')}
                            </button>
                        )}
                        {item.cancelled && (
                            <button className="sm:min-w-48 py-2 text-[#696969] border bg-[#FFEFEF] rounded">
                              {t('cancelled')}
                            </button>
                        )}
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default MyAppointments;