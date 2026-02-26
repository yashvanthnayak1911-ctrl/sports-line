import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const [cartCount, setCartCount] = React.useState(0);

    React.useEffect(() => {
        const updateCount = () => {
            const items = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartCount(items.length);
        };

        // Initial check
        updateCount();

        // Listen for storage events (from other tabs or same tab updates)
        window.addEventListener('storage', updateCount);

        // Custom event for same-tab updates
        window.addEventListener('cart-updated', updateCount);

        return () => {
            window.removeEventListener('storage', updateCount);
            window.removeEventListener('cart-updated', updateCount);
        };
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">SportsLine</Link>

            <div className="nav-links">
                <NavLink to="/home" className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }>
                    Home
                </NavLink>

                <NavLink to="/features" className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }>
                    Features
                </NavLink>

                <NavLink to="/orders" className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M19,3H5C3.89,3,3,3.89,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.89,20.11,3,19,3z M19,19H5V5h14V19z M17,17H7v-2h10V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z" />
                        </svg>
                        Orders
                    </div>
                </NavLink>

                <NavLink to="/cart" className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                        Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </div>
                </NavLink>

                {/* Persistent Settings Dropdown */}
                <div className="nav-item dropdown">
                    <button className="nav-link settings-trigger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg className="settings-icon" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.13,5.91,7.62,6.29L5.23,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.72,8.87 c-0.11,0.21-0.06,0.47,0.12,0.61l2.03,1.58C4.84,11.36,4.81,11.68,4.81,12c0,0.32,0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.21,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.5c-1.93,0-3.5-1.57-3.5-3.5 s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.93,15.5,12,15.5z" />
                        </svg>
                        Settings
                    </button>
                    <div className="dropdown-menu">
                        {user && user.isAdmin && (
                            <Link to="/admin" className="dropdown-item admin-link">
                                <span className="dropdown-icon">🛠️</span>
                                Admin Panel
                            </Link>
                        )}
                        <div className="dropdown-divider"></div>
                        {user ? (
                            <>
                                <div className="dropdown-header">
                                    <span className="user-name">{user.username}</span>
                                    {user.isAdmin && <span className="admin-badge">Admin</span>}
                                </div>
                                <div className="dropdown-divider"></div>
                                {user.isAdmin && (
                                    <>
                                        <Link to="/admin#inventory" className="dropdown-item">
                                            <span className="dropdown-icon">📦</span>
                                            Inventory
                                        </Link>
                                        <Link to="/admin#transactions" className="dropdown-item">
                                            <span className="dropdown-icon">💰</span>
                                            Transactions
                                        </Link>
                                        <Link to="/admin#users" className="dropdown-item">
                                            <span className="dropdown-icon">👥</span>
                                            Users
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                    </>
                                )}
                                <Link to="/orders" className="dropdown-item">
                                    <span className="dropdown-icon">📦</span>
                                    My Orders
                                </Link>
                                <button onClick={logoutHandler} className="dropdown-item logout-item">
                                    <span className="dropdown-icon">🚪</span>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="dropdown-item">
                                    <span className="dropdown-icon">🔑</span>
                                    Sign In
                                </Link>
                                <Link to="/register" className="dropdown-item">
                                    <span className="dropdown-icon">📝</span>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
