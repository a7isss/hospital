import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

// Axios interceptor to manage token-based requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('aToken'); // Retrieve the token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Use 'Authorization' header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const AddDoctor = () => {
    // State management for doctor details
    const [docImg, setDocImg] = useState(false); // Doctor image
    const [name, setName] = useState(''); // Doctor name
    const [email, setEmail] = useState(''); // Doctor email
    const [password, setPassword] = useState(''); // Doctor password
    const [experience, setExperience] = useState('1 Year'); // Doctor experience
    const [fees, setFees] = useState(''); // Doctor fees
    const [about, setAbout] = useState(''); // About doctor
    const [speciality, setSpeciality] = useState('General Physician'); // Doctor speciality
    const [degree, setDegree] = useState(''); // Doctor degree
    const [address1, setAddress1] = useState(''); // Address line 1
    const [address2, setAddress2] = useState(''); // Address line 2

    const { backendUrl } = useContext(AppContext);

    // Form submission handler
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            // Validate the image field
            if (!docImg) {
                return toast.error('Please upload an image for the doctor!');
            }

            // Create FormData object for the request
            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append(
                'address',
                JSON.stringify({ line1: address1, line2: address2 })
            );

            // Debugging the form data before sending
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            // Send POST request to backend
            const { data } = await axios.post(
                `${backendUrl}/api/admin/add-doctor`,
                formData
            );

            // Handle server response
            if (data?.success) {
                toast.success('Doctor added successfully!');

                // Clear all input fields
                setDocImg(false);
                setName('');
                setEmail('');
                setPassword('');
                setExperience('1 Year');
                setFees('');
                setAbout('');
                setSpeciality('General Physician');
                setDegree('');
                setAddress1('');
                setAddress2('');
            } else {
                toast.error(data.message || 'Failed to add doctor');
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error('Error adding doctor:', error);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Doctor</p>

            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                {/* Doctor Image Upload Field */}
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="doc-img">
                        <img
                            className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover"
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt="Doctor"
                        />
                    </label>
                    <input
                        type="file"
                        id="doc-img"
                        hidden
                        onChange={(e) => setDocImg(e.target.files[0])}
                    />
                    <p>Click to upload doctor picture.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-gray-600">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <label>Doctor Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Doctor's Full Name"
                            className="border p-2 rounded w-full"
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Doctor's Email"
                            className="border p-2 rounded w-full"
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a Password"
                            className="border p-2 rounded w-full"
                        />

                        <label>About</label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Write About the Doctor"
                            className="border p-2 rounded w-full h-20"
                        />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <label>Speciality</label>
                        <input
                            type="text"
                            value={speciality}
                            onChange={(e) => setSpeciality(e.target.value)}
                            placeholder="e.g., Cardiologist, Surgeon"
                            className="border p-2 rounded w-full"
                        />

                        <label>Experience</label>
                        <input
                            type="text"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="e.g., 5 Years"
                            className="border p-2 rounded w-full"
                        />

                        <label>Degree</label>
                        <input
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="Enter Qualification/Degree"
                            className="border p-2 rounded w-full"
                        />

                        <label>Fees</label>
                        <input
                            type="number"
                            value={fees}
                            onChange={(e) => setFees(e.target.value)}
                            placeholder="Consultation Fees in Numbers"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>

                {/* Address Section */}
                <label className="mt-6 block">Address</label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    <input
                        type="text"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        placeholder="Address Line 1"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="Address Line 2"
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-5 py-2 rounded mt-6 w-full"
                >
                    Add Doctor
                </button>
            </div>
        </form>
    );
};

export default AddDoctor;