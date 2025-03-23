import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

const AddService = () => {
    const { addService } = useContext(AdminContext); // Import addService context function
    const [serviceName, setServiceName] = useState(""); // Service name
    const [description, setDescription] = useState(""); // Service description
    const [category, setCategory] = useState("General"); // Service category
    const [price, setPrice] = useState(""); // Service price
    const [duration, setDuration] = useState(""); // Service duration
    const [image, setImage] = useState(null); // Service image file

    // Handler for submitting the service form
    const onSubmitHandler = (event) => {
        event.preventDefault();

        // Validation
        if (!serviceName || !description || !category || !price || !duration || !image) {
            return toast.error("All fields, including the image, are required!");
        }

        if (isNaN(price) || price <= 0) {
            return toast.error("Price must be a positive number!");
        }

        // Prepare the data for upload
        const formData = new FormData();
        formData.append("name", serviceName);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("price", Number(price));
        formData.append("duration", duration);
        formData.append("image", image); // Append the image file

        // Call the context function to add the service
        addService(formData);

        // Reset input fields after successful submission
        setServiceName("");
        setDescription("");
        setCategory("General");
        setPrice("");
        setDuration("");
        setImage(null); // Clear file input
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full" encType="multipart/form-data">
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
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a short description of this service"
                    className="border p-2 rounded w-full"
                />

                {/* File Input Section */}
                <label className="mt-6 block">Service Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border p-2 rounded w-full"
                />

                <button className="bg-primary text-white w-full py-2 rounded-md text-base mt-6">
                    Add Service
                </button>
            </div>
        </form>
    );
};

export default AddService;