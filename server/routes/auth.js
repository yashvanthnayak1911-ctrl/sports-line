const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// In-memory OTP store (for demo purposes)
const otpStore = {};

// Request OTP
router.post('/request-otp', async (req, res) => {
    const { mobileNumber } = req.body;

    // Generate 6-digit OTP
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (mobileNumber === '9999999999') {
        otp = '123456';
    }
    otpStore[mobileNumber] = otp;

    console.log(`[MOCK SMS] OTP for ${mobileNumber} is: ${otp}`);

    // Check if user exists, if not create a temporary one or just wait for verification?
    // For admin flow, we might want to check if the number is allowed? 
    // For now, allow any number to request OTP.

    res.json({ message: 'OTP sent successfully' });
});

// Verify OTP / Login
router.post('/login', async (req, res) => {
    const { mobileNumber, otp } = req.body;

    if (otpStore[mobileNumber] === otp) {
        delete otpStore[mobileNumber]; // Clear OTP after use

        // Find or Create User
        let user = await User.findOne({ mobileNumber });

        if (!user) {
            // Check if this is the seeded admin number
            if (mobileNumber === '9999999999') {
                user = await User.create({
                    username: 'Admin',
                    mobileNumber,
                    isAdmin: true
                });
            } else {
                // Regular user
                user = await User.create({
                    username: `User${mobileNumber.slice(-4)}`,
                    mobileNumber,
                    isAdmin: false // Default to false
                });
            }
        }

        res.json({
            _id: user._id,
            username: user.username,
            mobileNumber: user.mobileNumber,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid OTP' });
    }
});

module.exports = router;
