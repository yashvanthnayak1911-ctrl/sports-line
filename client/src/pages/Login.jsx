import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_URL from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post(
                `${API_URL}/api/auth/login`,
                { email, password },
                config
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (data.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
                <div className="checkout-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                        <p className="hero-subtitle" style={{ fontSize: '1rem', marginBottom: '0' }}>
                            Login to continue to SportsLine.
                        </p>
                    </div>

                    {errorMsg && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="checkout-form">
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Password
                                <Link to="#" style={{ color: 'var(--accent-color)', fontWeight: '500', textTransform: 'none' }}>Forgot password?</Link>
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn place-order-btn" style={{ marginBottom: '1.5rem' }}>
                            Login
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            New to SportsLine? <Link to="/register" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Create an account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
