const testOtp = async () => {
    try {
        console.log('Testing OTP Request...');
        const response = await fetch('http://localhost:5000/api/auth/request-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mobileNumber: '9999999999'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
};

testOtp();
