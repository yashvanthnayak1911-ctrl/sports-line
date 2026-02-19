const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGO_URI;
console.log('Testing MongoDB Connection...');
console.log('URI length:', uri ? uri.length : 'undefined');

if (!uri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('SUCCESS: Connected to MongoDB Atlas');
        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (err) {
        console.error('FAILURE: Could not connect to MongoDB');
        console.error(err); // This will print the full error object
        if (err.cause) console.error('Cause:', err.cause);
    }
};

connectDB();
