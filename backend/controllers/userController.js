import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import { UserModel, VisitorModel, ServiceModel, CartModel, DoctorModel } from '../models/models.js';
// Gateway Initialize
import logger from "../middleware/logger.js"; // Assumes a logger utility is implemented


// Register a User (Upgraded)
const registerUser = async (req, res) => {
    const { name, phone, age, password } = req.body;

    // Validate input data
    if (!name || !phone || !age || !password) {
        logger.warn("Register Attempt: Missing details");
        return res.status(400).json({ success: false, message: "Missing details" });
    }

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ phone });
        if (existingUser) {
            logger.info(`User Registration Reject: Phone ${phone} already exists`);
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            name,
            phone,
            age,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate tokens
        const payload = { id: newUser._id, role: newUser.role }; // Include useful claims
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        logger.info(`User Registered Successfully: ${phone}`);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        logger.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Login User (Upgraded)
const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    // Validate presence of credentials
    if (!phone || !password) {
        logger.warn("Login Attempt: Missing credentials");
        return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    try {
        // Find the user in the database
        const user = await UserModel.findOne({ phone });
        if (!user) {
            logger.info(`Login Failed: Phone ${phone} not found`);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.info(`Login Failed: Incorrect password for Phone ${phone}`);
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate tokens
        const payload = { id: user._id, role: user.role }; // Include useful claims
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // 1 hour
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }); // 7 days

        logger.info(`User Logged In Successfully: ${phone}`);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        logger.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await UserModel.findById(userId).select('-password');
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, userData });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await UserModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await UserModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await DoctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await UserModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await DoctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await DoctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await DoctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}




export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
  //  getallServices,
//    bookAppointment,
//    listAppointment,
//    cancelAppointment

}