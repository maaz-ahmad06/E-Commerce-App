import express from 'express'
import {
    placeOrder,
    placeOrderStripe,
    placeOrderPakistani,
    allOrders,
    userOrders,
    updateStatus,
    updatePayment,
    getDashboardStats,
    verifyStripe
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/payment-status', adminAuth, updatePayment)
orderRouter.get('/dashboard-stats', adminAuth, getDashboardStats)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/pakistani-pay', authUser, placeOrderPakistani)

// User Feature
orderRouter.post('/userorders', authUser, userOrders)

// verify payment 
orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter