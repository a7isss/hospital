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
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('General physician');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const { backendUrl } = useContext(AppContext);

    // Submit form
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            // Validate the image
            if (!docImg) {
                return toast.error('Image Not Selected');
            }

            // Create FormData for the request
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
                backendUrl + '/api/admin/add-doctor',
                formData
            );

            // Handle response
            if (data.success) {
                toast.success('Doctor added successfully');
                // Clear form states
                setDocImg(false);
                setName('');
                setPassword('');
                setEmail('');
                setAddress1('');
                setAddress2('');
                setDegree('');
                setAbout('');
                setFees('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.log('Error adding doctor:', error);
        }
    };

    // Render the form
    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Doctor</p>

            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="doc-img">
                        <img
                            className="w-16 bg-gray-100 rounded-full cursor-pointer"
                            src={
                                docImg
                                    ? URL.createObjectURL(docImg)
                                    : assets.upload_area
                            }
                            alt="Doctor Upload"
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="doc-img" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <label>Doctor Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Doctor's Name" />

                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Doctor's Email" />

                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />

                        <label>About</label>
                        <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Write About the Doctor" />
                    </div>
                    <div className="w-full lg:flex-[0.7] flex flex-col gap-4">
                        <label>Speciality</label>
                        <input type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} placeholder="Enter Speciality" />

                        <label>Experience</label>
                        <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Enter Experience" />

                        <label>Degree</label>
                        <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Enter Degree" />

                        <label>Fees</label>
                        <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} placeholder="Enter Consultation Fees" />
                    </div>
                </div>

                <label>Address</label>
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Address Line 1" />
                    <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address Line 2" />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded mt-6">Add Doctor</button>
            </div>
        </form>
    );
};

export default AddDoctor;