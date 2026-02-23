const mongoose = require('mongoose');
const Product = require('./models/Product');

async function deleteProducts() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/sportsline');
        const count = await Product.countDocuments();
        await Product.deleteMany({});
        console.log(`Successfully deleted ${count} products.`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to delete products:', error.message);
        process.exit(1);
    }
}

deleteProducts();
