import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: ''
    });

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [navigate]);

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Simulate order placement
        alert('Order Placed Successfully! Thank you for shopping with SportsLine.');
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new Event("cart-updated"));
        navigate('/');
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content">
                <h1 className="section-title">Checkout</h1>

                <div className="checkout-container">
                    {/* Left Column: Billing Details */}
                    <div className="checkout-form-section">
                        <h2 className="checkout-subtitle">Billing Details</h2>
                        <form onSubmit={handlePlaceOrder} className="checkout-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" required onChange={handleInputChange} placeholder="John" />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" required onChange={handleInputChange} placeholder="Doe" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" required onChange={handleInputChange} placeholder="john@example.com" />
                            </div>

                            <div className="form-group">
                                <label>Street Address</label>
                                <input type="text" name="address" required onChange={handleInputChange} placeholder="123 Sports Avenue" />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" required onChange={handleInputChange} placeholder="New York" />
                                </div>
                                <div className="form-group">
                                    <label>Zip Code</label>
                                    <input type="text" name="zip" required onChange={handleInputChange} placeholder="10001" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <input type="text" name="country" required onChange={handleInputChange} placeholder="United States" />
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="order-summary-section">
                        <div className="order-card">
                            <h2 className="checkout-subtitle">Order Summary</h2>
                            <div className="summary-items">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="summary-item">
                                        <span>{item.name}</span>
                                        <span>${item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>${calculateTotal()}</span>
                            </div>

                            <h3 className="payment-title">Payment Method</h3>
                            <div className="payment-options">
                                <label className="payment-option">
                                    <input type="radio" name="payment" defaultChecked />
                                    <span className="payment-label">Credit / Debit Card</span>
                                </label>
                                <label className="payment-option">
                                    <input type="radio" name="payment" />
                                    <span className="payment-label">PayPal</span>
                                </label>
                                <label className="payment-option">
                                    <input type="radio" name="payment" />
                                    <span className="payment-label">Cash on Delivery</span>
                                </label>
                            </div>

                            <button className="btn place-order-btn" onClick={handlePlaceOrder}>
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
