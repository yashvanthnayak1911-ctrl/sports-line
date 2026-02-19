import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
    }, []);

    const removeFromCart = (id) => {
        const newItems = cartItems.filter(item => item._id !== id);
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        window.dispatchEvent(new Event("storage")); // Notify Navbar
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2);
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content">
                <h1 className="section-title">Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'white', marginTop: '3rem' }}>
                        <h2>Your cart is empty</h2>
                        <button
                            className="btn"
                            style={{ marginTop: '1rem' }}
                            onClick={() => navigate('/')}
                        >
                            Go Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item" style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '1rem',
                                marginBottom: '1rem',
                                borderRadius: '8px'
                            }}>
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1, marginLeft: '1rem', color: 'white' }}>
                                    <h3>{item.name}</h3>
                                    <p>${item.price}</p>
                                </div>
                                <button
                                    className="btn"
                                    style={{ background: '#ef4444', padding: '0.5rem 1rem' }}
                                    onClick={() => removeFromCart(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="cart-summary" style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            background: 'rgba(255,255,255,0.15)',
                            borderRadius: '12px',
                            color: 'white',
                            textAlign: 'right'
                        }}>
                            <h2 style={{ marginBottom: '1rem' }}>Total: ${calculateTotal()}</h2>
                            <button
                                className="btn"
                                style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
