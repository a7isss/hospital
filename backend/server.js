import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// CORS configuration
const allowedOrigins = [
  "https://ph-hpgz.vercel.app",
  "https://www.lahm.sa",
  "https://admin.lahm.sa"
  // CORS configuration
];

// middlewares
app.use(express.json())
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  console.log('Path:', req.path);
  next();
});
app.options("*", cors());
app.use((req, res, next) => {
  console.log('Incoming Request Origin:', req.headers.origin);
  console.log('Request Path:', req.path);
  next();
});

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))