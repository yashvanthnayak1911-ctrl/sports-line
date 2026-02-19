const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        let isFallback = false;
        try {
            // Attempt Connect to MongoDB Atlas
            await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
            console.log('Connected to MongoDB Atlas (Persistent)');
        } catch (atlasError) {
            console.error('Atlas connection failed, falling back to In-Memory (Non-Persistent):', atlasError.message);
            isFallback = true;

            // Fallback to In-Memory
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('Connected to In-Memory MongoDB (Fallback)');
        }

        // Seed Admin User (Always needed)
        const adminExists = await User.findOne({ mobileNumber: '9999999999' });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                mobileNumber: '9999999999',
                isAdmin: true
            });
            console.log('Admin user created: 9999999999');
        }

        // Seed Products ONLY if in Fallback Mode (to prevent empty site on error)
        if (isFallback) {
            const productCount = await Product.countDocuments();
            if (productCount === 0) {
                const products = [
                    {
                        name: "Pro Court Tennis Racket",
                        description: "Professional grade carbon fiber tennis racket for superior control and power. Engineered for competitive players seeking precision.",
                        price: 199.99,
                        imageUrl: "https://images.unsplash.com/photo-1617083934555-563d3cb0046e?q=80&w=1000&auto=format&fit=crop",
                        category: "Rackets",
                        countInStock: 10
                    },
                    {
                        name: "Elite Basketball",
                        description: "Official size and weight, superior grip composite leather basketball. Perfect for indoor and outdoor court performance.",
                        price: 49.99,
                        imageUrl: "https://images.unsplash.com/photo-1519861531473-920026393112?q=80&w=1000&auto=format&fit=crop",
                        category: "Balls",
                        countInStock: 20
                    },
                    {
                        name: "Performance Running Shoes",
                        description: "Ultra-lightweight running shoes with responsive cushioning technology. Designed for marathon runners and casual joggers alike.",
                        price: 129.99,
                        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
                        category: "Footwear",
                        countInStock: 15
                    }
                ];
                await Product.insertMany(products);
                console.log('Fallback: Database seeded with emergency products');
            }
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('CRITICAL: Failed to start server:', err);
    }
};

startServer();
