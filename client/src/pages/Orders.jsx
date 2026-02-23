import React from 'react';
import Navbar from '../components/Navbar';

const Orders = () => {
    return (
        <div className="page-wrapper">
            <Navbar />
            <main className="main-content">
                <div className="hero-section">
                    <h1 className="hero-title">Your Orders</h1>
                    <p className="hero-subtitle">Track and manage your elite equipment orders.</p>
                </div>

                <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '5rem' }}>
                    <div className="feature-icon">📦</div>
                    <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>No orders yet</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        You haven't placed any orders with the Atelier yet.
                        Explore our collection to find your next peak performance gear.
                    </p>
                    <button className="btn" style={{ width: 'auto', padding: '1rem 3rem' }} onClick={() => window.location.href = '/home'}>
                        Browse Collection
                    </button>
                </div>
            </main>

            <footer className="footer">
                <p className="footer-text">© 2026 <span className="footer-rights">SPORTSLINE ATELIER</span>. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Orders;
