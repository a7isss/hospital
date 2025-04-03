import axios from 'axios';
import React, { useEffect, useState } from 'react'; // Removed useContext
import { useSearchParams, Navigate } from 'react-router-dom'; // Added Navigate for redirect
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore'; // Import Zustand store

const Verify = () => {
  const { t } = useTranslation(); // Initialize translation
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const appointmentId = searchParams.get('appointmentId');

  const { token, backendUrl } = useAuthStore((state) => ({
    token: state.token,
    backendUrl: state.backendUrl,
  })); // Access global state using authStore

  const [redirect, setRedirect] = useState(false); // State for redirection

  const verifyStripe = async () => {
    try {
      const { data } = await axios.post(
          `${backendUrl}/api/user/verifyStripe`,
          { success, appointmentId },
          { headers: { token } }
      );

      if (data.success) {
        toast.success(t('payment_successful')); // Success notification
      } else {
        toast.error(t('payment_failed')); // Failure notification
      }

      setRedirect(true); // Trigger redirect
    } catch (error) {
      toast.error(error.message); // Error notification
      console.error(error);
    }
  };

  useEffect(() => {
    if (token && appointmentId && success) {
      verifyStripe(); // Call Stripe verification if prerequisites are met
    }
  }, [token, appointmentId, success]); // Dependencies for the effect

  if (redirect) {
    // Perform declarative navigation using Navigate
    return <Navigate to="/my-appointments" />;
  }

  return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div> {/* Loading spinner */}
          <p className="mt-4 text-gray-600">{t('verifying_payment')}</p> {/* Display loading message */}
        </div>
      </div>
  );
};

export default Verify;