const mongoose = require('mongoose');

// Use encoded password and remove deprecated options
const MONGO_URI = 'mongodb+srv://Yashh-projects:yashthanu%40191104@cluster0.u27e8qb.mongodb.net/sports-line?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing with encoded password and NO options...');
// console.log('URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch((err) => {
        console.error('ERROR NAME:', err.name);
        console.error('ERROR MESSAGE:', err.message);
        process.exit(0);
    });
