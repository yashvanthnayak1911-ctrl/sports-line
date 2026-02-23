const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

async function checkDb() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/sportsline');
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        console.log(`Users in DB: ${userCount}`);
        console.log(`Products in DB: ${productCount}`);
        process.exit(0);
    } catch (error) {
        console.error('Failed:', error.message);
        process.exit(1);
    }
}

checkDb();
