import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, getallServices } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)

export default userRouter;