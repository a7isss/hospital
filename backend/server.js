import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import axios from 'axios'

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
];

// middlewares
app.use(express.json())
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  console.log('Path:', req.path);
  next();
});
app.use(
  cors({
    origin: '*', // Allow all origins
    credentials: true, // Allow cookies or authorization headers
  })
);

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

axios.get('/api/protected-route', {
  headers: {
    aToken: localStorage.getItem('aToken') // Send the token from localStorage
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))