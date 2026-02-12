import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Home() {
    const [featuredItems, setFeaturedItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/menu');
                // Taking first 3 items as featured for now
                setFeaturedItems(data.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch featured items", err);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="home">
            <section className="hero" style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                color: 'white',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                marginTop: '-80px', // Offset for navbar height
                paddingTop: '80px'   // Add padding to account for navbar
            }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Taste the Extraordinary
                </h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', opacity: 0.9 }}>
                    Experience culinary mastery with our premium selection of dishes. Fresh ingredients, unforgettable flavors.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/menu" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.1rem' }}>
                        View Menu
                    </Link>
                    {!user && (
                        <Link to="/register" className="btn" style={{
                            background: 'white',
                            color: 'black',
                            padding: '0.9rem 2rem',
                            fontSize: '1.1rem'
                        }}>
                            Join Us
                        </Link>
                    )}
                </div>
            </section>

            {/* Featured Food Section */}
            <section className="container" style={{ padding: '4rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>Featured Dishes</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {featuredItems.map(item => (
                        <div key={item._id} className="card" style={{ overflow: 'hidden' }}>
                            <div style={{
                                height: '200px',
                                background: '#eee',
                                marginBottom: '1rem'
                            }}>
                                <img
                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'; }}
                                />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{item.description.substring(0, 60)}...</p>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>${item.price}</span>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/menu" className="btn btn-outline">View Full Menu</Link>
                </div>
            </section>

            {/* Head Chef Section */}
            <section style={{ background: 'var(--surface)', padding: '4rem 1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <img
                            src="https://plus.unsplash.com/premium_photo-1661778091956-15dbe6e47442?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D"
                            alt="Head Chef"
                            style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)' }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Meet Our Head Chef</h2>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Alessandro Romano</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                            With over 20 years of experience in Michelin-starred kitchens across Italy and France, Chef Alessandro brings a fusion of traditional techniques and modern innovation to your plate. His philosophy is simple: let the ingredients speak for themselves.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)' }}>
                            "Cooking is an art, but eating is a passion. My goal is to create memories with every bite."
                        </p>
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '4rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>Why Choose Us?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <Link to="/feature/fresh-ingredients" className="card feature-card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Fresh Ingredients</h3>
                        <p style={{ color: 'var(--text-light)' }}>We source our ingredients from local farmers to ensure the best quality and taste.</p>
                    </Link>
                    <Link to="/feature/expert-chefs" className="card feature-card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Expert Chefs</h3>
                        <p style={{ color: 'var(--text-light)' }}>Our chefs are masters of their craft, dedicated to creating perfect dishes.</p>
                    </Link>
                    <Link to="/feature/fast-delivery" className="card feature-card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Fast Delivery</h3>
                        <p style={{ color: 'var(--text-light)' }}>Hot and fresh food delivered right to your doorstep in record time.</p>
                    </Link>
                    <Link to="/feature/best-prices" className="card feature-card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Best Prices</h3>
                        <p style={{ color: 'var(--text-light)' }}>Luxury dining without the luxury price tag. We offer the best value in town.</p>
                    </Link>
                    <Link to="/feature/event-catering" className="card feature-card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Event Catering</h3>
                        <p style={{ color: 'var(--text-light)' }}>Hosting a party? Let us handle the food. We cater for weddings, birthdays, and more.</p>
                    </Link>
                    <Link to="/feature/24-7-support" className="card feature-card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <h3 style={{ marginBottom: '1rem' }}>24/7 Support</h3>
                        <p style={{ color: 'var(--text-light)' }}>Have a question or issue? Our support team is always available to assist you.</p>
                    </Link>
                </div>
            </div>


        </div>
    );
}
