import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'; // Added useState
import { useSearchParams } from 'react-router-dom'; // Removed useNavigate
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Verify = () => {
  const { t } = useTranslation(); // Initialize translation
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const appointmentId = searchParams.get('appointmentId');

  const { backendUrl, token } = useContext(AppContext);

  const [redirect, setRedirect] = useState(false); // Added state for navigation

  const verifyStripe = async () => {
    try {
      const { data } = await axios.post(
          backendUrl + '/api/user/verifyStripe',
          { success, appointmentId },
          { headers: { token } }
      );

      if (data.success) {
        toast.success(t('payment_successful')); // Use translation for success message
      } else {
        toast.error(t('payment_failed')); // Use translation for failure message
      }

      setRedirect(true); // Set redirect after action
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    if (token && appointmentId && success) {
      verifyStripe();
    }
  }, [token]);

  if (redirect) {
    // Redirection with declarative <Navigate />
    return <Navigate to="/my-appointments" />;
  }

  return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">{t('verifying_payment')}</p> {/* Use translation for loading message */}
        </div>
      </div>
  );
};

export default Verify;