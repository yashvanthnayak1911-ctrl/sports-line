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
                <NavLink to="/" className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }>
                    Home
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }>
                    Cart {cartCount > 0 && <span className="cart-badge" style={{
                        background: 'var(--accent-color)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        marginLeft: '5px'
                    }}>{cartCount}</span>}
                </NavLink>

                {/* Settings Dropdown */}
                {user ? (
                    <div className="nav-item dropdown">
                        <button className="nav-link">
                            Settings
                        </button>
                        <div className="dropdown-menu">
                            {user.isAdmin && (
                                <Link to="/admin" className="dropdown-item">Manage Store</Link>
                            )}
                            <button onClick={logoutHandler} className="dropdown-item logout-item">
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="nav-link">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
