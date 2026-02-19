const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGO_URI;

console.log('--- Debugging MongoDB Atlas Connection ---');
console.log('Attempting to connect to:', uri ? uri.split('@')[1] : 'UNDEFINED'); // Hide credentials for safety

if (!uri) {
    console.error('ERROR: MONGO_URI is undefined in .env');
    process.exit(1);
}

mongoose.connect(uri, { family: 4 })
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('--- RAW ERROR START ---');
        console.error(err.message);
        console.error('--- RAW ERROR END ---');
        process.exit(1);
    });
