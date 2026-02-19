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
                <h1 className="section-title">Premium Sports Gear</h1>

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
                                            const updatedCart = [...currentCart, product];
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
