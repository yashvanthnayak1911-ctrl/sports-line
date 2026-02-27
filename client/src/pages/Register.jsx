import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_URL from '../config';

const Register = () => {
    // We collect firstName and lastName purely for the frontend professional feel.
    // The backend only needs username, email, and password.
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    // Developer Options
    const [showDevOptions, setShowDevOptions] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!agreeTerms) {
            setErrorMsg('You must agree to the Terms and Conditions to register.');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // We combine first and last name if username is empty, otherwise we just use the provided username
            // In a real scenario, you might send firstName and lastName to the API if the schema supported it.
            const finalUsername = username.trim() || `${firstName} ${lastName}`.trim();

            const { data } = await axios.post(
                `${API_URL}/api/auth/register`,
                { username: finalUsername, email, password, isAdmin },
                config
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Error registering user. Please try again.');
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
                <div className="checkout-card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Join the Collective</h1>
                        <p className="hero-subtitle" style={{ fontSize: '1rem', marginBottom: '0' }}>
                            Create an account to access elite sporting equipment.
                        </p>
                    </div>

                    {errorMsg && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="checkout-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={firstName}
                                    placeholder="e.g. Michael"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lastName}
                                    placeholder="e.g. Jordan"
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                placeholder="Choose a unique username"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                placeholder="Enter a secure email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                placeholder="Create a strong password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                style={{ width: 'auto', marginTop: '0.2rem', cursor: 'pointer' }}
                            />
                            <label htmlFor="terms" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer', lineHeight: '1.4' }}>
                                I agree to the SportsLine <Link to="#" style={{ color: 'var(--accent-color)' }}>Terms of Service</Link> and <Link to="#" style={{ color: 'var(--accent-color)' }}>Privacy Policy</Link>.
                            </label>
                        </div>

                        <button type="submit" className="btn place-order-btn" style={{ marginBottom: '1.5rem' }}>
                            Create Account
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Login here</Link>
                        </div>

                        {/* Developer Options for Admin testing */}
                        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                            <button
                                type="button"
                                onClick={() => setShowDevOptions(!showDevOptions)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                            >
                                <span>{showDevOptions ? '▼' : '▶'}</span> Developer Options
                            </button>

                            {showDevOptions && (
                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                        <input
                                            type="checkbox"
                                            checked={isAdmin}
                                            onChange={(e) => setIsAdmin(e.target.checked)}
                                            style={{ width: 'auto' }}
                                        />
                                        Register as Admin (Testing environment only)
                                    </label>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
