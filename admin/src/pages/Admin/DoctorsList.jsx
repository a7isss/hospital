import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch doctors whenever aToken changes
  useEffect(() => {
    setLoading(true);
    getAllDoctors().finally(() => setLoading(false));
  }, [aToken]);

  // Function to delete a doctor
  const deleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        const response = await fetch(`/api/admin/delete-doctor/${doctorId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        });

        if (response.ok) {
          alert('Doctor deleted successfully!');
          getAllDoctors(); // Refresh the list
        } else {
          const { message } = await response.json(); // Parse API error response
          alert(`Failed to delete the doctor: ${message}`);
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
      <div className="m-5 max-h-[90vh] overflow-y-scroll">
        <h1 className="text-lg font-medium">All Doctors</h1>

        {loading ? (
            <p className="text-gray-500 mt-4">Loading doctors...</p>
        ) : doctors?.length > 0 ? (
            <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
              {doctors.map((item) => (
                  <div
                      className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
                      key={item._id}
                  >
                    <img
                        className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
                        src={item.image || '/default-doctor.png'}
                        alt={item.name || 'Doctor'}
                    />
                    <div className="p-4">
                      <p className="text-[#262626] text-lg font-medium">{item.name || 'Unknown'}</p>
                      <p className="text-[#5C5C5C] text-sm">{item.speciality || 'N/A'}</p>
                      <label className="mt-2 flex items-center gap-1 text-sm">
                        <input
                            onChange={() => changeAvailability(item._id)}
                            type="checkbox"
                            checked={item.available || false}
                        />
                        <span>Available</span>
                      </label>
                      <button
                          onClick={() => deleteDoctor(item._id)}
                          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <p className="text-gray-500 mt-4">No doctors available right now.</p>
        )}
      </div>
  );
};

export default DoctorsList;