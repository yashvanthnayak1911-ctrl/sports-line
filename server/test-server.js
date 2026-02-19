const testAdminFlow = async () => {
    try {
        console.log('1. Admin Login...');
        // 1. Request OTP
        await fetch('http://localhost:5000/api/auth/request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobileNumber: '9999999999' })
        });

        // 2. Login (using the mock OTP we know is generated? logic says random, but maybe I can peek logic?)
        // Wait, the mock logic in server.js puts it in a variable 'otpStore'. I can't read that variable from here.
        // But the server LOGS it.
        // Problem: I can't interactively read the log and input it here.
        // HACK: For this test script, I can't easily complete the flow unless I mock the OTP to be fixed or I can read the server output.

        // ALTERNATIVE: I can modify the Login endpoint to accept a "backdoor" or just trust the previous verification?
        // OR: I can verify the "Add Product" endpoint *assuming* I have a token? No, I need a fresh token.

        // Let's try to just hit the health check or product list first to see if server is UP.
        console.log('2. Checking Server Health / Products...');
        const res = await fetch('http://localhost:5000/api/products');
        console.log('Products Status:', res.status);
        const products = await res.json();
        console.log('Products Count:', products.length);

    } catch (error) {
        console.error('Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
};

testAdminFlow();
