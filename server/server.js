const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

const path = require('path');
// Only load .env if not in production (Render sets process.env.NODE_ENV = 'production')
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '.env') });
}

const app = express();

app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        let connected = false;

        try {
            // Attempt Connect to MongoDB Atlas
            await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
            console.log('Connected to MongoDB Atlas (Persistent)');
            connected = true;
        } catch (atlasError) {
            console.error('Atlas connection failed, trying Local MongoDB...', atlasError.message);

            try {
                // Attempt Connect to Local MongoDB
                await mongoose.connect(process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/sportsline');
                console.log('Connected to Local MongoDB (Persistent)');
                connected = true;
            } catch (localError) {
                console.error('Local connection failed too:', localError.message);
            }
        }

        if (!connected) {
            console.error('CRITICAL: No persistent database connection could be established. Please check your MongoDB Atlas connection string and ensure your Local MongoDB server is running.');
            process.exit(1);
        }

        // Seed Admin User (Always needed)
        const adminExists = await User.findOne({ email: 'admin@sportsline.com' });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                email: 'admin@sportsline.com',
                password: 'adminpassword123',
                isAdmin: true
            });
            console.log('Admin user created: admin@sportsline.com / adminpassword123');
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('CRITICAL: Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
