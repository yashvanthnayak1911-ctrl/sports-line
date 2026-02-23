import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <div className="page-wrapper">
            {/* Background is now handled purely via CSS in spinning-background class */}
            <div className="spinning-background"></div>

            <main className="main-content" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                textAlign: 'center'
            }}>
                <div className="landing-card" style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '24px',
                    padding: '5rem 3rem',
                    maxWidth: '600px',
                    width: '100%',
                    zIndex: 10,
                    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5)',
                    marginBottom: '4rem'
                }}>
                    <h1 className="section-title" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                        SPORTS<span>LINE</span>
                    </h1>

                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '4rem',
                        fontSize: '1.25rem',
                        fontWeight: '300',
                        letterSpacing: '0.02em'
                    }}>
                        The pinnacle of performance. <br />
                        Explore our curated selection of elite sporting equipment.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                        {user ? (
                            <>
                                <p style={{ color: 'var(--accent-color)', fontWeight: '600', marginBottom: '1rem' }}>
                                    Welcome back, {user.username}
                                </p>
                                <Link to="/home" className="btn">
                                    Enter Atelier
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn">
                                    Sign In
                                </Link>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                        Join Us
                                    </span>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                                </div>

                                <Link to="/register" className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="landing-extra-content" style={{ zIndex: 10, maxWidth: '1000px', width: '100%', padding: '0 2rem' }}>
                    <div className="landing-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                        <div className="info-card">
                            <h3>Unrivaled Quality</h3>
                            <p>We source only the highest-grade materials and partner with world-renowned manufacturers to ensuring peak performance equipment.</p>
                        </div>
                        <div className="info-card">
                            <h3>Expert Curation</h3>
                            <p>Our team of sports scientists and former athletes hand-picks every item in our collection for its technical superiority.</p>
                        </div>
                        <div className="info-card">
                            <h3>Global Reach</h3>
                            <p>Serving elite athletes in over 50 countries with fast, reliable, and secure logistics networks.</p>
                        </div>
                    </div>

                    <div className="trust-section" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="landing-subtitle">Trusted by the Best</h2>
                        <div className="stat-grid" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '2rem' }}>
                            <div className="stat-item">
                                <p className="stat-number">10K+</p>
                                <p className="stat-label">Active Athletes</p>
                            </div>
                            <div className="stat-item">
                                <p className="stat-number">200+</p>
                                <p className="stat-label">Elite Products</p>
                            </div>
                            <div className="stat-item">
                                <p className="stat-number">50+</p>
                                <p className="stat-label">Pro Teams</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer" style={{ border: 'none', background: 'transparent' }}>
                <p className="footer-text">
                    &copy; 2026 SportsLine | <span className="footer-rights">Est. MMXXVI</span>
                </p>
            </footer>
        </div>
    );
};

export default Landing;
