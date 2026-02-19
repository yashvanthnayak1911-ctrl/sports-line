import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        countInStock: ''
    });

    const navigate = useNavigate();

    // Safe userInfo parsing
    let userInfo = null;
    try {
        const storedInfo = localStorage.getItem('userInfo');
        if (storedInfo && storedInfo !== "undefined") {
            userInfo = JSON.parse(storedInfo);
        }
    } catch (err) {
        console.error("Error parsing userInfo:", err);
        localStorage.removeItem('userInfo');
    }

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            if (!userInfo || !userInfo.token) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/products`, config);
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error("Products API returned non-array:", data);
                setProducts([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post(`${API_URL}/api/products`, formData, config);

            alert('Product Added Successfully!');

            setFormData({
                name: '',
                description: '',
                price: '',
                imageUrl: '',
                category: '',
                countInStock: ''
            });
            fetchProducts();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
                return;
            }
            alert('Failed to add product. Error: ' + (error.response?.data?.message || error.message));
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`${API_URL}/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Safety check before render
    if (!userInfo || !userInfo.isAdmin) {
        return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Redirecting to login...</div>;
    }

    return (
        <>
            <AdminNavbar />
            <div className="page-wrapper">
                <div className="main-content">
                    <div className="section-title">Admin Dashboard</div>

                    <div className="admin-grid">
                        {/* Add Product Card */}
                        <div className="admin-card">
                            <h2 className="card-title">Add New Product</h2>
                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Product Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="e.g. Nike Air Zoom" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Price ($)</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" placeholder="0.00" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" placeholder="e.g. Shoes" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stock Quantity</label>
                                        <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} className="form-control" placeholder="0" required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label className="form-label">Image URL</label>
                                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="form-control" placeholder="https://example.com/image.jpg" required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label className="form-label">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" placeholder="Product details..." required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Add Product</button>
                            </form>
                        </div>

                        {/* Product List Card */}
                        <div className="admin-card">
                            <h2 className="card-title">Inventory</h2>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(products) && products.length > 0 ? (
                                            products.map((product) => (
                                                <tr key={product._id || Math.random()}>
                                                    <td>{product._id ? String(product._id).substring(Math.max(0, String(product._id).length - 6)) : 'N/A'}...</td>
                                                    <td>{product.name}</td>
                                                    <td>${product.price}</td>
                                                    <td><span className="badge">{product.category}</span></td>
                                                    <td>
                                                        <button className="btn-icon delete" onClick={() => deleteHandler(product._id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                                                    No products found. Add one above!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', textAlign: 'left', background: '#333', padding: '1rem' }}>
                        {this.state.error && this.state.error.toString()}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

const AdminDashboardWithBoundary = () => (
    <ErrorBoundary>
        <AdminDashboard />
    </ErrorBoundary>
);

export default AdminDashboardWithBoundary;
