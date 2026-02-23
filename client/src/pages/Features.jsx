import React from 'react';
import Navbar from '../components/Navbar';

const Features = () => {
    const features = [
        {
            title: "Premium Catalog",
            description: "A curated selection of high-performance sports gear from the world's leading brands.",
            icon: "🏆",
            detail: "Our collection is hand-picked for professionals and enthusiasts alike."
        },
        {
            title: "Secure OTP Login",
            description: "Seamless and secure access using mobile-based authentication. No passwords needed.",
            icon: "🔐",
            detail: "Fast2SMS integration ensures instant delivery of your access codes."
        },
        {
            title: "Real-time Shopping",
            description: "A dynamic shopping experience with instant cart updates and smooth transitions.",
            icon: "🛒",
            detail: "Our optimized frontend provides zero-latency interactions."
        },
        {
            title: "Admin Dashboard",
            description: "Powerful tools for managing products, tracking orders, and overseeing store performance.",
            icon: "🛠️",
            detail: "A centralized command center for all your business needs."
        },
        {
            title: "Responsive Design",
            description: "A beautiful experience across all devices, from ultra-wide monitors to smartphones.",
            icon: "📱",
            detail: "Mobile-first approach ensures accessibility for every user."
        },
        {
            title: "Secure Checkout",
            description: "Streamlined and reliable payment and order processing with persistent status tracking.",
            icon: "💳",
            detail: "Built on a robust MERN stack foundation for total reliability."
        }
    ];

    return (
        <div className="page-wrapper">
            <Navbar />

            <div className="spinning-background">
                <div className="spin-ring"></div>
                <div className="spin-ring"></div>
                <div className="spin-ring"></div>
            </div>

            <main className="main-content">
                <section className="hero-section">
                    <h1 className="hero-title">Platform Features</h1>
                    <p className="hero-subtitle">
                        Discover the powerful technologies and curated experiences that make SportsLine the pinnacle of athletic commerce.
                    </p>
                </section>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-item">
                            <span className="feature-icon">{feature.icon}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                            <div style={{
                                marginTop: '1.5rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--glass-border)',
                                fontSize: '0.8rem',
                                color: 'var(--accent-color)',
                                fontWeight: '500'
                            }}>
                                {feature.detail}
                            </div>
                        </div>
                    ))}
                </div>

                <section style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <div className="info-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h3>Engineered for Precision</h3>
                        <p>
                            SportsLine is built using a modern MERN stack architecture, ensuring high performance, scalability, and a seamless user experience. Every interaction is optimized to help you find the gear you need to elevate your game.
                        </p>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p className="footer-text">
                    &copy; 2026 <span className="footer-rights">SportsLine</span>. Built for Champions.
                </p>
            </footer>
        </div>
    );
};

export default Features;
