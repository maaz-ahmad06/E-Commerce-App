# 🛒 Full-Stack MERN E-Commerce Web Application

A full-stack, production-ready E-Commerce platform built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS v4, Stripe integration, Cloudinary media management, and a dedicated Admin Dashboard.

---

## 🌟 Key Features

### 🛍️ Customer Storefront (`/frontend`)
- **Modern Responsive Design**: Fast, fluid UI styled with Tailwind CSS v4 and Outfit/Prata typography.
- **Product Catalog**: Dynamic product listings, collection filtering by category & subcategory, and instant price sorting (Low to High / High to Low).
- **Interactive Cart**: Real-time quantity adjustments, multi-size selections, and cart summary calculations.
- **Checkout & Payments**: Integrated Stripe Checkout and Cash on Delivery (COD) payment workflows.
- **Authentication**: JWT-based user registration and login with input validation.
- **Order Management**: Order history view with live delivery status tracking.

### 🛡️ Admin Dashboard (`/admin`)
- **Product Management**: Upload new products with multi-image support powered by Cloudinary.
- **Inventory Listing**: View, browse, and delete catalog products with a single click.
- **Order Processing**: Manage customer orders, update fulfillment statuses (`Order Placed`, `Packing`, `Shipped`, `Out for Delivery`, `Delivered`), and inspect payment details.
- **Secure Access**: Role-verified administrator authentication.

### ⚙️ Backend API (`/backend`)
- **RESTful Endpoints**: Modular Express architecture with route-controller design for Users, Products, Cart, and Orders.
- **Database Architecture**: Mongoose schemas with indexed models for optimal querying.
- **Media Uploads**: Multer disk storage seamlessly uploading to Cloudinary with automatic local temp file cleanup.

---

## 🧰 Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Axios, React Toastify, Vite
- **Admin**: React 19, React Router v7, Tailwind CSS v4, Axios, React Toastify, Vite
- **Backend**: Node.js, Express 5, Mongoose 9, JWT, Bcrypt, Multer, Cloudinary, Stripe SDK
- **Database**: MongoDB Atlas / Local MongoDB

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Atlas cluster or local service running on `27017`)
- Cloudinary account (for image hosting)
- Stripe account (for payment testing)

---

### 2. Environment Setup

#### Backend (`backend/.env`):
Create `backend/.env` based on `backend/.env.example`:
```env
PORT = 4000
MONGODB_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net"
JWT_SECRET = "your_strong_jwt_secret"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "your_admin_password"
CLOUDINARY_NAME = "your_cloudinary_cloud_name"
CLOUDINARY_API_KEY = "your_cloudinary_api_key"
CLOUDINARY_SECRET_KEY = "your_cloudinary_secret_key"
STRIPE_SECRET_KEY = "your_stripe_secret_key"
```

#### Frontend (`frontend/.env`):
```env
VITE_BACKEND_URL=http://localhost:4000
```

#### Admin (`admin/.env`):
```env
VITE_BACKEND_URL=http://localhost:4000
```

---

### 3. Installation & Running

#### ⚙️ Run Backend
```bash
cd backend
npm install
npm run server
```
Runs at `http://localhost:4000`.

#### 🛍️ Run Customer Storefront
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

#### 🛡️ Run Admin Panel
```bash
cd admin
npm install
npm run dev
```
Runs at `http://localhost:5174`.

---

## 🔒 Security Best Practices
- `.env` files are strictly excluded via `.gitignore`.
- Passwords hashed using `bcrypt` with salt rounds.
- Tokens signed with expiration and verified via JWT middleware.
- Image uploads cleaned from disk after Cloudinary processing.

---

## 📄 License
This project is licensed under the ISC License.

