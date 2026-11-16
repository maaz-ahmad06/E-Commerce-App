import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        let uri = process.env.MONGODB_URI || "";
        if (!uri.includes('/e-commerce') && !uri.match(/mongodb\.net\/[^?]+/)) {
            if (uri.includes('?')) {
                uri = uri.replace('?', '/e-commerce?');
            } else {
                uri = uri.endsWith('/') ? `${uri}e-commerce` : `${uri}/e-commerce`;
            }
        }
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
    }
}

export default connectDB;