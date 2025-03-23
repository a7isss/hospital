import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String }, // Optional (e.g., 1 hour)
    image: { type: String }, // Cloudinary image URL
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const ServiceModel = mongoose.model("Service", serviceSchema);
export default ServiceModel;