import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_URL from '../config';

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP
    const navigate = useNavigate();

    const requestOtpHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            await axios.post(
                `${API_URL}/api/auth/request-otp`,
                { mobileNumber },
                config
            );
            alert(`OTP sent to ${mobileNumber} (Check server terminal)`);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert('Failed to send OTP');
        }
    };

    const verifyOtpHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post(
                `${API_URL}/api/auth/login`,
                { mobileNumber, otp },
                config
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (data.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert('Invalid OTP');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="form-container">
                    <h1>{step === 1 ? 'Sign In via Mobile' : 'Enter OTP'}</h1>

                    {step === 1 ? (
                        <form onSubmit={requestOtpHandler}>
                            <div className="form-group">
                                <label className="form-label">Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={mobileNumber}
                                    placeholder="Enter 10-digit number"
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn">Request OTP</button>
                        </form>
                    ) : (
                        <form onSubmit={verifyOtpHandler}>
                            <div className="form-group">
                                <label className="form-label">One-Time Password (OTP)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={otp}
                                    placeholder="Enter 6-digit OTP"
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn">Login</button>
                            <button
                                type="button"
                                className="btn"
                                style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--glass-border)' }}
                                onClick={() => setStep(1)}
                            >
                                Back
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default Login;
