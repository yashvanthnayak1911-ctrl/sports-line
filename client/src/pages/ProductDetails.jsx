import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API_URL from '../config';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
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
    };

    if (loading) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content" style={{ textAlign: 'center', color: 'white', marginTop: '5rem' }}>
                <h2>Loading Product...</h2>
            </div>
        </div>
    );

    if (!product) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content" style={{ textAlign: 'center', color: 'white', marginTop: '5rem' }}>
                <h2>Product Not Found</h2>
                <button className="btn" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                    Back to Home
                </button>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content">
                <button className="back-btn" onClick={() => navigate('/')}>
                    ← Back to Products
                </button>

                <div className="product-details-container">
                    <div className="product-details-image">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>

                    <div className="product-details-info">
                        <h1 className="details-title">{product.name}</h1>
                        <p className="details-category">{product.category || 'Sports Gear'}</p>
                        <p className="details-price">${product.price}</p>

                        <div className="details-description-card">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <button className="btn add-to-cart-large" onClick={addToCart}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
