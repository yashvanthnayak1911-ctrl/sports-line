import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
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
            fetchOrders();
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/auth/users`);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/orders`);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const payOrder = async (id) => {
        if (window.confirm('Mark this order as paid?')) {
            try {
                await axios.put(`${API_URL}/api/orders/${id}/pay`);
                fetchOrders();
            } catch (error) {
                console.error('Error updating payment status:', error);
                alert('Failed to update payment status');
            }
        }
    };

    const deleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`${API_URL}/api/orders/${id}`);
                fetchOrders();
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Failed to delete order');
            }
        }
    };

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

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            category: '',
            countInStock: ''
        });
        setIsEditing(false);
        setEditId(null);
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

            if (isEditing) {
                await axios.put(`${API_URL}/api/products/${editId}`, formData, config);
                alert('Product Updated Successfully!');
            } else {
                await axios.post(`${API_URL}/api/products`, formData, config);
                alert('Product Added Successfully!');
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
                return;
            }
            alert('Operation failed. Error: ' + (error.response?.data?.message || error.message));
        }
    };

    const editHandler = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            countInStock: product.countInStock
        });
        setIsEditing(true);
        setEditId(product._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    <div className="section-title">Admin Dashboard Overview</div>

                    {/* Stats Grid */}
                    <div className="admin-grid" style={{ marginBottom: '3rem' }}>
                        <div className="admin-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--accent-color)' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '12px' }}>💰</div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Total Revenue</p>
                                <h3 style={{ color: 'white', margin: '0.2rem 0', fontSize: '1.5rem' }}>
                                    ${orders.reduce((acc, item) => acc + (item.isPaid ? item.totalPrice : 0), 0).toFixed(2)}
                                </h3>
                            </div>
                        </div>
                        <div className="admin-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #34d399' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(52, 211, 153, 0.1)', padding: '1rem', borderRadius: '12px' }}>📦</div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Total Orders</p>
                                <h3 style={{ color: 'white', margin: '0.2rem 0', fontSize: '1.5rem' }}>{orders.length}</h3>
                            </div>
                        </div>
                        <div className="admin-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #f87171' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(248, 113, 113, 0.1)', padding: '1rem', borderRadius: '12px' }}>👥</div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Total Users</p>
                                <h3 style={{ color: 'white', margin: '0.2rem 0', fontSize: '1.5rem' }}>{users.length}</h3>
                            </div>
                        </div>
                        <div className="admin-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #fbbf24' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(251, 191, 36, 0.1)', padding: '1rem', borderRadius: '12px' }}>🏗️</div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Total Products</p>
                                <h3 style={{ color: 'white', margin: '0.2rem 0', fontSize: '1.5rem' }}>{products.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="admin-grid">
                        {/* Add/Edit Product Card */}
                        <div className="admin-card">
                            <h2 className="card-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
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
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        {isEditing ? 'Update Product' : 'Add Product'}
                                    </button>
                                    {isEditing && (
                                        <button type="button" className="btn btn-outline" onClick={resetForm} style={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Product List Card */}
                        <div className="admin-card" id="inventory">
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
                                                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="btn-icon" onClick={() => editHandler(product)} style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                                            Edit
                                                        </button>
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

                    {/* Transaction List Section */}
                    <div className="section-title" id="transactions" style={{ marginTop: '3rem' }}>Transaction Details</div>
                    <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="admin-card">
                            <h2 className="card-title">All Orders</h2>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Paid</th>
                                            <th>Items</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(orders) && orders.length > 0 ? (
                                            orders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{String(order._id).substring(Math.max(0, String(order._id).length - 8))}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span>
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{order.shippingAddress.email}</span>
                                                        </div>
                                                    </td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>${order.totalPrice}</td>
                                                    <td>
                                                        <span className={`badge ${order.isPaid ? 'success' : 'warning'}`}>
                                                            {order.isPaid ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontSize: '0.8rem' }}>
                                                            {order.orderItems.map((item, idx) => (
                                                                <div key={idx}>{item.name} (x{item.qty})</div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {!order.isPaid && (
                                                            <button className="btn-icon" onClick={() => payOrder(order._id)} style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                                                Pay
                                                            </button>
                                                        )}
                                                        <button className="btn-icon delete" onClick={() => deleteOrder(order._id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                                                    No transactions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* User Management Section */}
                    <div className="section-title" id="users" style={{ marginTop: '3rem' }}>User Management</div>
                    <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="admin-card">
                            <h2 className="card-title">Registered Users</h2>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Mobile Number</th>
                                            <th>Role</th>
                                            <th>Joined At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user._id}>
                                                    <td>{String(user._id).substring(Math.max(0, String(user._id).length - 6))}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.mobileNumber}</td>
                                                    <td>
                                                        <span className={`badge ${user.isAdmin ? 'accent' : ''}`}>
                                                            {user.isAdmin ? 'Admin' : 'User'}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                                                    No users found.
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
