import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="navbar admin-navbar">
            <div className="nav-brand admin-brand">Admin Workspace</div>
            <div className="nav-links">
                <Link to="/" className="nav-link view-store-btn">
                    View Live Store ↗
                </Link>
                <button onClick={logoutHandler} className="nav-link logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
