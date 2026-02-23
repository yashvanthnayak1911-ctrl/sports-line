const mongoose = require('mongoose');

async function testLocal() {
    try {
        console.log('Attempting to connect to: mongodb://127.0.0.1:27017/sportsline');
        await mongoose.connect('mongodb://127.0.0.1:27017/sportsline');
        console.log('Successfully connected to local MongoDB!');
        process.exit(0);
    } catch (error) {
        console.error('Local connection failed:', error.message);
        process.exit(1);
    }
}

testLocal();
