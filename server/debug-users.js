const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        const users = await User.find({});
        console.log("ATLAS USERS:", users.length);
        if (users.length > 0) {
            console.log(users.map(u => ({ email: u.email, username: u.username })));
            console.log('Force deleting Atlas users...');
            await User.deleteMany({});
            console.log('Deleted Atlas users.');
        }
        await mongoose.disconnect();

        await mongoose.connect(process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/sportsline');
        const localUsers = await User.find({});
        console.log("LOCAL USERS:", localUsers.length);
        if (localUsers.length > 0) {
            console.log(localUsers.map(u => ({ email: u.email, username: u.username })));
            console.log('Force deleting Local users...');
            await User.deleteMany({});
            console.log('Deleted Local users.');
        }
        await mongoose.disconnect();

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
