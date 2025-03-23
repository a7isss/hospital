import express from 'express';
import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  deleteDoctor,
  getAllServices, // Import from adminController.js
  addService,     // Import from adminController.js
  deleteService   // Import from adminController.js
                  // Correctly imported from adminController.js
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js'; // Only import changeAvailablity from doctorController.js
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

// Debugging: Log route registration
console.log("Admin routes initialized");

// Login route
adminRouter.post("/login", (req, res, next) => {
  console.log("POST /login route hit"); // Debugging
  next(); // Pass the request to the loginAdmin controller
}, loginAdmin);

// Add doctor route
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), (req, res, next) => {
  console.log("POST /add-doctor route hit"); // Debugging
  next();
}, addDoctor);

// Get all appointments route
adminRouter.get("/appointments", authAdmin, (req, res, next) => {
  console.log("GET /appointments route hit"); // Debugging
  next();
}, appointmentsAdmin);

// Cancel appointment route
adminRouter.post("/cancel-appointment", authAdmin, (req, res, next) => {
  console.log("POST /cancel-appointment route hit"); // Debugging
  next();
}, appointmentCancel);

// Get all doctors route
adminRouter.get("/all-doctors", authAdmin, (req, res, next) => {
  console.log("GET /all-doctors route hit"); // Debugging
  next();
}, allDoctors);

// Change availability route
adminRouter.post("/change-availability", authAdmin, (req, res, next) => {
  console.log("POST /change-availability route hit"); // Debugging
  next();
}, changeAvailablity);

// Admin dashboard route
adminRouter.get("/dashboard", authAdmin, (req, res, next) => {
  console.log("GET /dashboard route hit"); // Debugging
  next();
}, adminDashboard);

// Delete doctor route
adminRouter.delete("/delete-doctor/:id", authAdmin, (req, res, next) => {
  console.log("DELETE /delete-doctor/:id route hit"); // Debugging
  next();
}, deleteDoctor);
/* ------------------------------------------
   New Service Management Routes:
------------------------------------------ */

// Fetch all services
adminRouter.get("/services", authAdmin, (req, res, next) => {
  console.log("GET /services route hit");
  next();
}, getAllServices);

// Add a new service (with image upload)
adminRouter.post(
    "/add-service",
    authAdmin,
    upload.single("image"), // Multer middleware for handling file upload
    (req, res, next) => {
      console.log("POST /add-service route hit");
      next();
    },
    addService
);


// Delete a service
adminRouter.delete("/delete-service/:id", authAdmin, (req, res, next) => {
  console.log("DELETE /delete-service/:id route hit");
  next();
}, deleteService);

export default adminRouter;