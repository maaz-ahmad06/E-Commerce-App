import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import productModel from '../models/productModel.js'
import userModel from '../models/userModel.js'

// function for add product
const addProduct = async (req, res) => {
    try {
        const {name, description, price, category, subCategory, sizes, bestseller} = req.body;

        const files = req.files || {};
        const image1 = files.image1 && files.image1[0];
        const image2 = files.image2 && files.image2[0];
        const image3 = files.image3 && files.image3[0];
        const image4 = files.image4 && files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) =>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type:"image"});
                fs.unlink(item.path, () => {});
                return result.secure_url;
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: Array.isArray(sizes) ? sizes : (sizes ? JSON.parse(sizes) : []),
            bestseller: bestseller === "true" ? true : false,
            image: imagesUrl,
            date: Date.now()
        }
        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products });

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// function for adding a review
const addReview = async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;

        if (!rating || !comment) {
            return res.json({ success: false, message: "Rating and comment are required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const newReview = {
            userId,
            userName: user.name || "Customer",
            rating: Number(rating),
            comment,
            date: Date.now()
        };

        product.reviews = product.reviews || [];
        product.reviews.push(newReview);

        const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
        product.averageRating = Number((totalRating / product.reviews.length).toFixed(1));

        await product.save();
        res.json({ success: true, message: "Review submitted successfully!", product });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProducts, removeProduct, singleProduct, addReview }