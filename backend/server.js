import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js"; // MongoDB connection
import connectCloudinary from "./config/cloudinary.js"; // Cloudinary connection
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRouter.js";
//import visitorRouter from "./routes/visitorRoute.js"; // Import visitor route
import ServiceModel from "./models/serviceModel.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect database with logging
connectDB()
    .then(() => console.log("✅ Database connection successful"))
    .catch((error) => console.error("❌ Error connecting to the database:", error.message));

// Connect Cloudinary
connectCloudinary();

// CORS configuration
const allowedOrigins = [
    "https://ph-hpgz.vercel.app",
    "https://www.lahm.sa",
    "https://admin.lahm.sa",
];

// Middlewares
app.use(express.json());

// Debugging middleware for logging incoming requests
app.use((req, res, next) => {
    console.log("Incoming Request => Origin:", req.headers.origin);
    console.log("Path:", req.path);
    next();
});

// CORS middleware with dynamic origin checking
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                console.log("CORS Allowed => Origin:", origin);
                callback(null, true); // Allow the request
            } else {
                console.warn("CORS Denied => Origin:", origin); // Warn about denied origins
                callback(new Error("Not allowed by CORS")); // Deny the request
            }
        },
        credentials: true, // Allow cookies or authorization headers
    })
);

// Services endpoint
app.get("/api/services", async (req, res) => {
    try {
        const services = await ServiceModel.find(); // Fetch all services from the database
        res.status(200).json({ services });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).send("Error fetching services.");
    }
});

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/cart", cartRouter); // Add the cartRouter here
//app.use("/api/visitor", visitorRouter);

// Health check
app.get("/", (req, res) => {
    res.send("API Working");
});

// Start server
app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));