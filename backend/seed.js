import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

const sampleProducts = [
  {
    name: "Women Round Neck Pure Cotton Top",
    description: "A lightweight, breathable pure cotton top with a modern round neckline and short sleeves. Perfect for casual day-outs and warm weather styling.",
    price: 120,
    image: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: true,
    date: Date.now() - 1000000
  },
  {
    name: "Men Slim Fit Classic Oxford Shirt",
    description: "Premium tailored Oxford button-down shirt crafted from 100% organic cotton. Features crisp collar stitching and adjustable barrel cuffs.",
    price: 180,
    image: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL", "XXL"],
    bestseller: true,
    date: Date.now() - 2000000
  },
  {
    name: "Men Rugged Vintage Denim Jacket",
    description: "Classic American style trucker denim jacket featuring button flap chest pockets and adjustable waist tabs for that timeless heritage look.",
    price: 260,
    image: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: true,
    date: Date.now() - 3000000
  },
  {
    name: "Women Oversized Wool Knit Sweater",
    description: "Ultra-cozy cable knit sweater woven from soft merino wool blend. Features dropped shoulders and ribbed cuffs for cozy warmth.",
    price: 210,
    image: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    bestseller: false,
    date: Date.now() - 4000000
  },
  {
    name: "Men Stretch Twill Chino Trousers",
    description: "Versatile flat-front slim chino pants with engineered stretch for day-to-night flexibility. Features reinforced back welt pockets.",
    price: 150,
    image: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    bestseller: true,
    date: Date.now() - 5000000
  },
  {
    name: "Women High-Rise Tailored Trousers",
    description: "Sophisticated wide-leg trousers cut from lightweight twill fabric. Features front pleats, hidden zipper fly, and deep side slant pockets.",
    price: 175,
    image: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L"],
    bestseller: false,
    date: Date.now() - 6000000
  },
  {
    name: "Girls Pastel Floral Summer Dress",
    description: "Breezy A-line cotton sundress adorned with cheerful wildflower botanical print and ruffled shoulder straps. Breathable and play-proof.",
    price: 135,
    image: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    date: Date.now() - 7000000
  },
  {
    name: "Kids Classic Denim Bib Overalls",
    description: "Durable cotton denim overalls with brass hardware buckles, multi-compartment bib pocket, and reinforced knee patches built for adventures.",
    price: 140,
    image: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M"],
    bestseller: false,
    date: Date.now() - 8000000
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    await mongoose.connect(`${mongoUri}/e-commerce`);
    console.log("Connected to MongoDB for seeding...");

    const count = await productModel.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seed.`);
    } else {
      await productModel.insertMany(sampleProducts);
      console.log(`Successfully seeded ${sampleProducts.length} sample products!`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDB();

