import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const items = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(items);
        } catch (error) {
            console.error("Error parsing cart items:", error);
            localStorage.removeItem('cartItems');
            setCartItems([]);
        }
    }, []);

    const removeFromCart = (id) => {
        const newItems = cartItems.filter(item => item._id !== id);
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        window.dispatchEvent(new Event("cart-updated")); // Notify Navbar
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.qty || 1)), 0).toFixed(2);
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) {
            removeFromCart(id);
            return;
        }
        const newItems = cartItems.map(item =>
            item._id === id ? { ...item, qty: newQty } : item
        );
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        window.dispatchEvent(new Event("cart-updated"));
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content">
                <h1 className="section-title">Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="empty-cart-container">
                        <div className="empty-cart-icon">🛒</div>
                        <h2 className="empty-cart-title">Your cart is empty</h2>
                        <p className="empty-cart-subtitle">Looks like you haven't added anything to your cart yet.</p>
                        <button className="btn empty-cart-btn" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-page-container">
                        <div className="cart-items-section">
                            {cartItems.map((item, index) => (
                                <div key={item._id || index} className="cart-item-card">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-title">{item.name}</h3>
                                        <p className="cart-item-price">${item.price}</p>
                                        <div className="cart-item-actions">
                                            <div className="cart-qty-wrapper">
                                                <button className="qty-btn" onClick={() => updateQuantity(item._id, (item.qty || 1) - 1)}>-</button>
                                                <span className="qty-text">{item.qty || 1}</span>
                                                <button className="qty-btn" onClick={() => updateQuantity(item._id, (item.qty || 1) + 1)}>+</button>
                                            </div>
                                            <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary-card">
                            <h2 className="cart-summary-title">Order Summary</h2>
                            <div className="cart-summary-row">
                                <span>Subtotal</span>
                                <span>${calculateTotal()}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="cart-summary-total">
                                <span>Total</span>
                                <span>${calculateTotal()}</span>
                            </div>
                            <button
                                className="btn cart-checkout-btn"
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
