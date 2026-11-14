import express from 'express'
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, resetPassword } from '../controllers/userController.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile', authUser, getUserProfile)
userRouter.post('/update-profile', authUser, updateUserProfile)
userRouter.post('/reset-password', resetPassword)

export default userRouter;