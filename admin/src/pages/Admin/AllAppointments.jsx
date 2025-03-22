import React, { useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {
  const { appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    getAllAppointments(); // Fetch all appointments whenever the component mounts or aToken changes
  }, [getAllAppointments]);

  return (
      <div className="w-full max-w-6xl m-5">
        <p className="mb-3 text-lg font-medium">All Appointments</p>

        <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p>Fees</p>
            <p>Action</p>
          </div>

          {/* Appointments List */}
          {appointments.length ? (
              appointments.map((item, index) => (
                  <div
                      className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
                      key={item?._id || index} // Use _id if available, fallback to index
                  >
                    <p className="max-sm:hidden">{index + 1}</p>
                    <div className="flex items-center gap-2">
                      <img src={item.userData?.image || assets.default_user} className="w-8 rounded-full" alt="User" />
                      <p>{item.userData?.name || 'Unknown'}</p>
                    </div>
                    <p className="max-sm:hidden">{calculateAge(item.userData?.dob) || 'N/A'}</p>
                    <p>
                      {slotDateFormat(item.slotDate)}, {item.slotTime}
                    </p>
                    <div className="flex items-center gap-2">
                      <img src={item.docData?.image || assets.default_doc} className="w-8 rounded-full bg-gray-200" alt="Doctor" />
                      <p>{item.docData?.name || 'Unknown'}</p>
                    </div>
                    <p>
                      {currency}
                      {item.amount}
                    </p>
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
              <p className="text-center text-gray-500 py-5">No appointments available.</p>
          )}
        </div>
      </div>
  );
};

export default AllAppointments;