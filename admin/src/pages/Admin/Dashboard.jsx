import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  // Trigger fetch on token change
  useEffect(() => {
    getDashData();
  }, [aToken]);

  // Loading or error fallback
  if (!dashData) {
    return (
        <div className="text-center mt-5">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
    );
  }

  return (
      <div className="m-5">
        {/* Dashboard Metrics */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="Doctors" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.doctors || 0}</p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="Appointments" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.appointments || 0}</p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="Patients" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.patients || 0}</p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white mt-10">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
            <img src={assets.list_icon} alt="List Icon" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashData?.latestAppointments?.length ? (
                dashData.latestAppointments.slice(0, 5).map((item) => (
                    <div
                        className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                        key={item._id || item.slotDate}
                    >
                      <img
                          className="rounded-full w-10"
                          src={item.docData?.image || assets.default_doc_icon}
                          alt="Doctor"
                      />
                      <div className="flex-1 text-sm">
                        <p className="text-gray-800 font-medium">{item.docData?.name || 'Unknown'}</p>
                        <p className="text-gray-600">
                          Booking on {slotDateFormat(item.slotDate) || 'N/A'}
                        </p>
                      </div>
                      {item.cancelled ? (
                          <p className="text-red-400 text-xs font-medium">Cancelled</p>
                      ) : item.isCompleted ? (
                          <p className="text-green-500 text-xs font-medium">Completed</p>
                      ) : (
                          <img
                              onClick={() => cancelAppointment(item._id)}
                              className="w-10 cursor-pointer"
                              src={assets.cancel_icon}
                              alt="Cancel"
                          />
                      )}
                    </div>
                ))
            ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500">No recent bookings available.</p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;