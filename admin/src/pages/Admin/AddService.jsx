import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

const AddService = () => {
    const { addService } = useContext(AdminContext); // Import addService context function
    const [serviceName, setServiceName] = useState(''); // Service name
    const [description, setDescription] = useState(''); // Service description
    const [category, setCategory] = useState('General'); // Service category
    const [price, setPrice] = useState(''); // Service price
    const [duration, setDuration] = useState(''); // Service duration

    // Handler for submitting the service form
    const onSubmitHandler = (event) => {
        event.preventDefault();

        // Validation
        if (!serviceName || !description || !category || !price || !duration) {
            return toast.error('All fields are required!');
        }

        if (isNaN(price) || price <= 0) {
            return toast.error('Price must be a positive number!');
        }

        // Call the context function to add the service
        addService({
            name: serviceName,
            description,
            category,
            price: Number(price),
            duration,
        });

        // Reset input fields after successful submission
        setServiceName('');
        setDescription('');
        setCategory('General');
        setPrice('');
        setDuration('');
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Service</p>

            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-gray-600">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <label>Service Name</label>
                        <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            placeholder="Enter Service Name"
                            className="border p-2 rounded w-full"
                        />

                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="General">General</option>
                            <option value="Consultation">Consultation</option>
                            <option value="Testing">Testing</option>
                            <option value="Procedures">Procedures</option>
                            {/* Add more categories as needed */}
                        </select>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <label>Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter Price in Numbers"
                            className="border p-2 rounded w-full"
                        />

                        <label>Duration</label>
                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g., 30 Minutes"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>

                {/* Description Section */}
                <label className="mt-6 block">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a description of the service"
                    className="border p-2 rounded w-full h-20 mt-2"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-5 py-2 rounded mt-6 w-full"
                >
                    Add Service
                </button>
            </div>
        </form>
    );
};

export default AddService;