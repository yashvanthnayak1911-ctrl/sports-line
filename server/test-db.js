const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to MongoDB Atlas!');
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
