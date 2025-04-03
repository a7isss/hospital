import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Zustand's authStore
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Translation hook

const Appointment = () => {
  const { t } = useTranslation(); // Initialize translation
  const { docId } = useParams();
  const navigate = useNavigate();

  const {
    doctors,
    token,
    userData,
    fetchDoctors,
    isAuthenticated,
  } = useAuthStore((state) => ({
    doctors: state.doctors, // Global list of doctors
    token: state.token, // Token for authenticated requests
    userData: state.userData, // Logged-in user's data
    fetchDoctors: state.fetchDoctors, // Fetch doctors from backend
    isAuthenticated: state.isAuthenticated, // Authentication status
  }));

  const [docInfo, setDocInfo] = useState(null); // Doctor information
  const [docSlots, setDocSlots] = useState([]); // Available slots
  const [slotIndex, setSlotIndex] = useState(0); // Selected slot index
  const [slotTime, setSlotTime] = useState(''); // Selected slot time

  const daysOfWeek = [
    t('sun'),
    t('mon'),
    t('tue'),
    t('wed'),
    t('thu'),
    t('fri'),
    t('sat'),
  ]; // Days of the week for UI

  // Fetching doctor data when the component mounts
  useEffect(() => {
    if (doctors.length === 0) {
      fetchDoctors(); // Fetch doctors if not already present
    } else {
      const doc = doctors.find((doctor) => doctor._id === docId);
      if (doc) setDocInfo(doc);
    }
  }, [doctors, docId, fetchDoctors]);

  // Generating available slots based on doctor's schedule and slots booked
  useEffect(() => {
    if (!docInfo) return;

    const availableSlots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);

      const startOfDay = new Date(dayDate).setHours(10, 0, 0, 0); // Opening hours: 10 AM
      const endOfDay = new Date(dayDate).setHours(21, 0, 0, 0); // Closing hours: 9 PM
      const daySlots = [];

      let currentTime = new Date(startOfDay);
      while (currentTime < endOfDay) {
        const slotTime = currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const slotDate = `${dayDate.getDate()}_${dayDate.getMonth() + 1}_${dayDate.getFullYear()}`;
        const isSlotAvailable =
            !(docInfo.slots_booked?.[slotDate]?.includes(slotTime));

        if (isSlotAvailable) {
          daySlots.push({
            datetime: new Date(currentTime),
            time: slotTime,
          });
        }

        currentTime.setMinutes(currentTime.getMinutes() + 30); // Slot intervals: 30 minutes
      }

      availableSlots.push(daySlots);
    }

    setDocSlots(availableSlots);
  }, [docInfo]);

  // Handle booking an appointment
  const bookAppointment = async () => {
    if (!isAuthenticated) {
      toast.warning(t('login_to_book_appointment')); // Translation for warning
      return navigate('/login'); // Redirect to login if unauthenticated
    }

    if (!slotIndex || docSlots[slotIndex]?.length === 0) {
      toast.error(t('select_a_slot')); // Translation for slot validation
      return;
    }

    const selectedSlot = docSlots[slotIndex][0].datetime;
    const slotDate = `${selectedSlot.getDate()}_${selectedSlot.getMonth() + 1}_${selectedSlot.getFullYear()}`;
    const selectedTime = docSlots[slotIndex][0].time;

    try {
      // Use the authService to book the appointment
      const response = await authService.bookAppointment({
        docId,
        slotDate,
        slotTime: selectedTime,
      });

      if (response.success) {
        toast.success(t('appointment_booked_successfully')); // Success toast
        navigate('/my-appointments'); // Redirect user to their appointments
      } else {
        throw new Error(response.message || t('booking_failed')); // Error message
      }
    } catch (error) {
      toast.error(error.message || t('unexpected_error_occurred')); // Toast error message
    }
  };

  return docInfo ? (
      <div className="container mx-auto py-8">
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div>
            <img
                className="bg-primary w-full sm:max-w-72 rounded-lg"
                src={docInfo.image}
                alt={docInfo.name}
            />
          </div>
          <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-white">
            <h1 className="text-2xl font-bold mb-4">{docInfo.name}</h1>
            <p className="text-gray-600 mb-2">
              {t('speciality')}: {docInfo.speciality}
            </p>
            <p className="text-gray-600 mb-2">
              {t('experience')}: {docInfo.experience} {t('years')}
            </p>
            <p className="text-gray-600 mb-2">
              {t('fees')}: {userData?.currencySymbol || '₹'} {docInfo.fees}
            </p>
            <p className="text-gray-600">{docInfo.about}</p>
          </div>
        </div>

        {/* Slot Booking Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">{t('available_slots')}</h2>
          <div className="overflow-x-auto flex gap-4">
            {docSlots.map((daySlots, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer border ${
                        index === slotIndex ? 'border-primary text-primary bg-gray-50' : 'border-gray-300'
                    }`}
                    onClick={() => {
                      setSlotIndex(index);
                      setSlotTime(daySlots[0]?.time || '');
                    }}
                >
                  <p className="font-bold">
                    {daysOfWeek[new Date().getDay() + index % 7]}
                  </p>
                  <p className="text-gray-600">{t('slots')}: {daySlots.length}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Confirm Booking Button */}
        <div className="text-center">
          <button
              className="bg-primary text-white px-6 py-3 rounded-lg disabled:bg-gray-500"
              onClick={bookAppointment}
              disabled={!isAuthenticated || docSlots.length === 0}
          >
            {t('book_appointment')}
          </button>
        </div>

        {/* Related Doctors Section */}
      </div>
  ) : (
      <p className="text-center mt-10">{t('loading')}</p>
  );
};

export default Appointment;