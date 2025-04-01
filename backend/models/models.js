import mongoose from "mongoose";
import bcrypt from "bcrypt";
// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: {
        plan: { type: String, required: true, default: 'free' }, // Plan name (e.g., free, premium)
        trial: { type: Boolean, default: false }, // Whether the user is on a trial
        startedAt: { type: Date, default: Date.now }, // Subscription start date
        expiresAt: { type: Date, default: null }, // For trials or time-limited subscriptions
        accessibleDoctors: {
            type: [mongoose.Schema.Types.ObjectId], // Array of Doctor IDs this user can access
            ref: "Doctor",
            default: [], // Empty by default, populated on subscription or signup
        },
    },
    usage: {
        clients: { type: Number, default: 0 },
        groups: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
        doctors: { type: Number, default: 0 },
    },
});
const planSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }, // Plan name (e.g., free, premium)
    limits: {
        clients: { type: Number, default: null }, // Maximum number of allowed clients (null = unlimited)
        groups: { type: Number, default: null }, // Maximum groups
        other: { type: Number, default: null }, // Miscellaneous usage
        doctors: { type: Number, default: null }, // Maximum number of allowed doctors
    },
    price: { type: Number, default: 0 }, // Price for the plan (if applicable)
    duration: { type: Number, default: null }, // Duration in days (null means no expiration)
    description: { type: String }, // Optional description of the plan
});

const PlanModel = mongoose.model('Plan', planSchema);
// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
    // Only hash the password if it was modified or is new
    if (!this.isModified("password")) return next();

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10); // Salt rounds can remain 10 (default)
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Pass the error to Mongoose for proper error handling
    }
});

// Create User Model
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// Visitor Schema
const visitorSchema = new mongoose.Schema({
    visitorId: { type: String, required: true, unique: true },
    sessionData: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now },
});
const VisitorModel = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);

// Service Schema
const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String }, // Optional
    image: { type: String }, // Cloudinary URL
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});
const ServiceModel = mongoose.model("Service", serviceSchema);

// Cart Schema
const cartItemSchema = new mongoose.Schema({
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    quantity: { type: Number, default: 1, required: true },
    price: { type: Number, required: true },
});
const cartSchema = new mongoose.Schema({
    userId: { type: String, default: null },
    visitorId: { type: String, default: null },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
});
cartSchema.pre("save", function (next) {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    next();
});
const CartModel = mongoose.model("Cart", cartSchema);

// Doctor Schema
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of User IDs
}, { minimize: false });
const DoctorModel = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

// Export all models
export {
    userSchema,
    UserModel,
    planSchema,
    VisitorModel,
    ServiceModel,
    CartModel,
    DoctorModel,
};