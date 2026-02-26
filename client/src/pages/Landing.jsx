import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    return (
        <div className="page-wrapper landing-gateway">
            <div className="spinning-background">
                <div className="spin-ring">
                    <span className="floating-icon" style={{ top: '0', left: '50%' }}>⚽</span>
                    <span className="floating-icon" style={{ bottom: '0', left: '50%' }}>🏀</span>
                </div>
            </div>

            <main className="main-content gateway-content">
                <div className="gateway-card">
                    <div className="brand-logo-container">
                        <h1 className="gateway-brand">SPORTS<span>LINE</span></h1>
                        <div className="brand-divider"></div>
                    </div>

                    <h2 className="gateway-tagline">The Atelier of Elite Performance</h2>
                    <p className="gateway-description">
                        Enter the exclusive ecosystem of champions. Our curated collection represents the intersection of technical innovation and artistic mastery.
                    </p>

                    <div className="gateway-actions">
                        <Link to="/login" className="btn gateway-btn primary">
                            Sign In to Account
                        </Link>

                        <div className="gateway-separator">
                            <span>or</span>
                        </div>

                        <Link to="/register" className="btn gateway-btn secondary">
                            Join the Collective
                        </Link>
                    </div>

                    <div className="gateway-footer">
                        <p>Experience the Pinnacle of Sporting Excellence</p>
                    </div>
                </div>

                <div className="gateway-features">
                    <div className="g-feature">
                        <span className="g-icon">⚙️</span>
                        <h4>Technical Mastery</h4>
                    </div>
                    <div className="g-feature">
                        <span className="g-icon">💎</span>
                        <h4>Vetted Quality</h4>
                    </div>
                    <div className="g-feature">
                        <span className="g-icon">⚡</span>
                        <h4>Elite Performance</h4>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
