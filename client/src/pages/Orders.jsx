import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import API_URL from '../config';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!user || !user._id) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await axios.get(`${API_URL}/api/orders/user/${user._id}`);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '5rem' }}>Loading your orders...</div>;
    }

    return (
        <div className="page-wrapper">
            <Navbar />
            <main className="main-content">
                <div className="hero-section">
                    <h1 className="hero-title">Your Orders</h1>
                    <p className="hero-subtitle">Track and manage your elite equipment orders.</p>
                </div>

                {orders.length === 0 ? (
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
                ) : (
                    <div className="admin-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '1000px', margin: '0 auto' }}>
                        {orders.map((order) => (
                            <div key={order._id} className="admin-card" style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>ORDER ID</p>
                                        <p style={{ color: 'white', fontWeight: 'bold' }}>#{String(order._id).toUpperCase()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>DATE</p>
                                        <p style={{ color: 'white' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.name}</td>
                                                    <td>{item.qty}</td>
                                                    <td>${item.price}</td>
                                                    <td>${(item.qty * item.price).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <span className={`badge ${order.isPaid ? 'success' : 'warning'}`}>
                                            {order.isPaid ? 'PAID' : 'PAYMENT PENDING'}
                                        </span>
                                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            {order.isPaid ? 'Processing' : 'Awaiting Payment'}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>TOTAL AMOUNT</p>
                                        <p style={{ color: 'var(--accent-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>${order.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="footer">
                <p className="footer-text">© 2026 <span className="footer-rights">SPORTSLINE ATELIER</span>. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Orders;
