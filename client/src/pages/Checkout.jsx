import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

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
        try {
            const items = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(items);
            if (items.length === 0) {
                navigate('/cart');
            }
        } catch (error) {
            console.error("Error parsing cart items:", error);
            localStorage.removeItem('cartItems');
            navigate('/cart');
        }
    }, [navigate]);

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.qty || 1)), 0).toFixed(2);
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) {
            const newItems = cartItems.filter(item => item._id !== id);
            setCartItems(newItems);
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            if (newItems.length === 0) {
                navigate('/cart');
            }
        } else {
            const newItems = cartItems.map(item =>
                item._id === id ? { ...item, qty: newQty } : item
            );
            setCartItems(newItems);
            localStorage.setItem('cartItems', JSON.stringify(newItems));
        }
        window.dispatchEvent(new Event("cart-updated"));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty || 1,
                    image: item.imageUrl || item.image,
                    price: item.price,
                    product: item._id
                })),
                shippingAddress: formData,
                paymentMethod: 'Credit Card',
                totalPrice: calculateTotal(),
                user: userInfo ? userInfo._id : null
            };

            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert('Order Placed Successfully! Thank you for shopping with SportsLine.');
                localStorage.removeItem('cartItems');
                window.dispatchEvent(new Event("cart-updated"));
                navigate('/');
            } else {
                const errorData = await response.json();
                alert('Failed to place order: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing your order. Please try again.');
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content">
                <h1 className="section-title">Checkout <span style={{ color: '#facc15', fontSize: '1rem', background: 'rgba(250, 204, 21, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid #facc15' }}>UPDATE APPLIED</span></h1>

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
                            <h2 className="checkout-subtitle">Order Summary (Live)</h2>
                            <div className="summary-items">
                                {cartItems.map((item, index) => (
                                    <div key={item._id || index} className="summary-item">
                                        <div className="summary-item-info">
                                            <span className="summary-item-name">{item.name}</span>
                                            <div className="summary-qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.2)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #38bdf8', marginTop: '8px' }}>
                                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Qty:</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, (item.qty || 1) - 1)}
                                                    style={{ background: '#38bdf8', color: '#0f172a', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}
                                                >-</button>
                                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>{item.qty || 1}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, (item.qty || 1) + 1)}
                                                    style={{ background: '#38bdf8', color: '#0f172a', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}
                                                >+</button>
                                            </div>
                                        </div>
                                        <span className="summary-item-price" style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '18px' }}>${(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
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
