import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

import API_URL from '../config';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get(`${API_URL}/api/products`);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productSectionRef = React.useRef(null);

    const handleSearchCheck = (e) => {
        if (e.key === 'Enter') {
            productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Spinning Background */}
            <div className="spinning-background">
                <div className="spin-ring">
                    <span className="floating-icon" style={{ top: '0', left: '50%' }}>⚽</span>
                    <span className="floating-icon" style={{ bottom: '0', left: '50%' }}>🏀</span>
                    <span className="floating-icon" style={{ top: '50%', left: '0' }}>🏈</span>
                    <span className="floating-icon" style={{ top: '50%', right: '0' }}>🎾</span>
                </div>
                <div className="spin-ring">
                    <span className="floating-icon" style={{ top: '15%', left: '85%' }}>🏐</span>
                    <span className="floating-icon" style={{ bottom: '15%', right: '85%' }}>🎱</span>
                </div>
                <div className="spin-ring"></div>
            </div>

            <main className="main-content">
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Elevate Your Game</h1>
                        <p className="hero-subtitle">Discover the pinnacle of sports performance with our curated collection of elite sporting equipment, engineered for champions.</p>
                        <button className="btn hero-btn" onClick={() => productSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                            Explore Collection
                        </button>
                    </div>
                </section>

                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search our exclusive collection of premium gear..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchCheck}
                    />
                </div>

                <section className="features-grid" id="features">
                    <div className="feature-item">
                        <span className="feature-icon">🚚</span>
                        <h3>Global Shipping</h3>
                        <p>Free express shipping on all orders over $99</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🛡️</span>
                        <h3>Secure Payment</h3>
                        <p>100% secure payment processing with top-tier encryption</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎧</span>
                        <h3>Expert Support</h3>
                        <p>24/7 dedicated support from sports equipment specialists</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🏆</span>
                        <h3>Elite Quality</h3>
                        <p>Every product is hand-selected and rigorously tested</p>
                    </div>
                </section>

                <div className="section-divider" ref={productSectionRef}>
                    <span className="divider-line"></span>
                    <h2 className="featured-title">Featured Products</h2>
                    <span className="divider-line"></span>
                </div>

                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                        <p>Loading curated collection...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                        <p>No products found matching "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="product-card">
                                <Link to={`/product/${product._id}`}>
                                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                                </Link>
                                <div className="product-info">
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="product-title">{product.name}</h3>
                                    </Link>
                                    <p className="product-description">{product.description}</p>
                                    <p className="product-price">${product.price}</p>
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
                                            const existingItem = currentCart.find(item => item._id === product._id);
                                            let updatedCart;
                                            if (existingItem) {
                                                updatedCart = currentCart.map(item =>
                                                    item._id === product._id ? { ...item, qty: (item.qty || 1) + 1 } : item
                                                );
                                            } else {
                                                updatedCart = [...currentCart, { ...product, qty: 1 }];
                                            }
                                            localStorage.setItem('cartItems', JSON.stringify(updatedCart));
                                            window.dispatchEvent(new Event('cart-updated'));
                                            alert(`${product.name} added to cart!`);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="footer">
                <p className="footer-text">
                    &copy; 2026 SportsLine. <span className="footer-rights">All Rights Reserved.</span>
                </p>
            </footer>
        </div>
    );
};

export default Home;
