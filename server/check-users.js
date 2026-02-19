const mongoose = require('mongoose');

// Attempting Standard Connection String Pattern (bypassing SRV lookup)
// Note: This is a guess at the shard names based on common Atlas patterns.
// If this fails, we will need to ask the user to provide the "Standard" connection string from Atlas.
// But first, let's try one more time with `directConnection=true` on the SRV if that helps, or just standard options.

// Actually, let's try to enforce IPv4 if Node is preferring IPv6
const MONGO_URI = 'mongodb+srv://Yashh-projects:yashthanu%40191104@cluster0.u27e8qb.mongodb.net/sports-line?retryWrites=true&w=majority&appName=Cluster0';

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    isAdmin: Boolean,
});

const User = mongoose.model('User', UserSchema);

console.log('Connecting to inspect users (with IPv4 family option)...');

mongoose.connect(MONGO_URI, {
    family: 4 // Force IPv4
})
    .then(async () => {
        console.log('Connected.');
        const users = await User.find({});
        console.log('Users in DB:');
        users.forEach(u => {
            console.log(`- ${u.username} (${u.email}): isAdmin=${u.isAdmin}`);
        });
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error:', err.message);
        process.exit(0);
    });
