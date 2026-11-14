import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import Stripe from 'stripe'

// global variables
const currency = 'usd'
const deliveryCharge = 10

// gateway initialize
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Placing orders using COD method
const placeOrder = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        let calculatedAmount = 0;
        const verifiedItems = [];
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (product) {
                calculatedAmount += product.price * item.quantity;
                verifiedItems.push({
                    ...item,
                    price: product.price,
                    name: product.name
                });
            } else {
                verifiedItems.push(item);
                calculatedAmount += (item.price || 0) * (item.quantity || 1);
            }
        }
        calculatedAmount += deliveryCharge;

        const orderData = {
            userId,
            items: verifiedItems,
            address,
            amount: calculatedAmount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId,{cartData: {}})
        res.json({success: true, message: "Order Placed"});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers;

        let calculatedAmount = 0;
        const verifiedItems = [];
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (product) {
                calculatedAmount += product.price * item.quantity;
                verifiedItems.push({
                    ...item,
                    price: product.price,
                    name: product.name
                });
            } else {
                verifiedItems.push(item);
                calculatedAmount += (item.price || 0) * (item.quantity || 1);
            }
        }
        calculatedAmount += deliveryCharge;

        const orderData = {
            userId,
            items: verifiedItems,
            address,
            amount: calculatedAmount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();
         
        const line_items = verifiedItems.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
             price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        if (!stripe) {
            return res.json({success: false, message: "Stripe is not configured in backend .env"});
        }

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
            line_items,
            mode: 'payment'
        })

        res.json({success:true, sessionUrl: session.url})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Verify Stripe
const verifyStripe = async (req, res) => {
    const {orderId, success, userId, sessionId} = req.body;
    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({success: false, message: "Order not found"});
        }
        if (order.userId !== userId) {
            return res.json({success: false, message: "Unauthorized"});
        }

        let isPaid = false;
        if (stripe && sessionId) {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session.payment_status === 'paid') {
                isPaid = true;
            }
        } else if (success === "true") {
            isPaid = true;
        }

        if(isPaid){
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success:true, message:"Payment verified"})
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Payment failed"})
        }
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

// Placing orders using Pakistani Payment Methods (JazzCash / EasyPaisa / Bank Transfer)
const placeOrderPakistani = async (req, res) => {
    try {
        const {userId, items, address, paymentMethod, transactionId} = req.body;

        let calculatedAmount = 0;
        const verifiedItems = [];
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (product) {
                calculatedAmount += product.price * item.quantity;
                verifiedItems.push({
                    ...item,
                    price: product.price,
                    name: product.name
                });
            } else {
                verifiedItems.push(item);
                calculatedAmount += (item.price || 0) * (item.quantity || 1);
            }
        }
        calculatedAmount += deliveryCharge;

        const orderData = {
            userId,
            items: verifiedItems,
            address,
            amount: calculatedAmount,
            paymentMethod: paymentMethod || "JazzCash",
            payment: false,
            transactionId: transactionId || '',
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}});
        res.json({success: true, message: "Order placed successfully! We will verify your transaction shortly."});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// All order data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, orders});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// user order data for Frontend
const userOrders = async (req, res) => {
    try {
        const {userId} = req.body;
        const orders = await orderModel.find({userId});
        res.json({success: true, orders});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, message:"Status Updated"})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

// update payment status from Admin Panel
const updatePayment = async (req, res) => {
    try {
        const {orderId, payment} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {payment});
        res.json({success: true, message: "Payment status updated successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        const totalOrders = orders.length;
        const totalSales = orders.reduce((acc, order) => acc + (order.payment ? order.amount : 0), 0);
        const pendingOrders = orders.filter(o => o.status !== "Delivered").length;
        const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
        const recentOrders = orders.slice(-6).reverse();

        res.json({
            success: true,
            stats: {
                totalOrders,
                totalSales,
                pendingOrders,
                deliveredOrders,
                recentOrders
            }
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export {
    verifyStripe,
    placeOrder,
    placeOrderStripe,
    placeOrderPakistani,
    allOrders,
    userOrders,
    updateStatus,
    updatePayment,
    getDashboardStats
}