import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function Contact() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        special_requests: ''
    });
    const [loading, setLoading] = useState(false);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const value = e.target.name === 'guests' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        // Validate required fields
        if (!formData.email || !formData.phone || !formData.date || !formData.time) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        setLoading(true);

        try {
            console.log('Sending reservation data:', formData);
            await api.post('/reservations', formData);
            showNotification('Reservation confirmed! We look forward to seeing you.');
            setFormData(prev => ({ 
                ...prev, 
                phone: '',
                date: '', 
                time: '', 
                guests: 2, 
                special_requests: '' 
            }));
        } catch (error) {
            console.error('Reservation error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to make reservation. Please try again.';
            showNotification(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <section className="hero" style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                minHeight: '40vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '0 0 var(--radius) var(--radius)',
                marginBottom: '4rem'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Contact Us & Reservations
                </h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '600px', opacity: 0.9 }}>
                    We'd love to hear from you. Book a table or drop us a line.
                </p>
            </section>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                    {/* Contact Info */}
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem', color: 'var(--primary)' }}>Get in Touch</h2>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Address</p>
                            <p style={{ color: 'var(--text-light)' }}>123 Culinary Avenue, Foodie City, FC 90210</p>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Phone</p>
                            <p style={{ color: 'var(--text-light)' }}>(555) 123-4567</p>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Email</p>
                            <p style={{ color: 'var(--text-light)' }}>reservations@restaurantapp.com</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Opening Hours</p>
                            <p style={{ color: 'var(--text-light)' }}>Mon - Fri: 11:00 AM - 10:00 PM</p>
                            <p style={{ color: 'var(--text-light)' }}>Sat - Sun: 10:00 AM - 11:00 PM</p>
                        </div>
                    </div>

                    {/* Reservation Form */}
                    <div className="card">
                        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary)' }}>Make a Reservation</h2>
                        {!user ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>You must be logged in to make a reservation.</p>
                                <button onClick={() => navigate('/login')} className="btn btn-primary">Login Now</button>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Date *</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Time *</label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                required
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Number of Guests *</label>
                                        <select
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                                        >
                                            <option value={1}>1 Person</option>
                                            <option value={2}>2 People</option>
                                            <option value={3}>3 People</option>
                                            <option value={4}>4 People</option>
                                            <option value={5}>5 People</option>
                                            <option value={6}>6 People</option>
                                            <option value={7}>7 People</option>
                                            <option value={8}>8+ People</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Special Requests</label>
                                        <textarea
                                            name="special_requests"
                                            value={formData.special_requests}
                                            onChange={handleChange}
                                            placeholder="Any special requests or dietary requirements..."
                                            rows="3"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', resize: 'vertical' }}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                                        {loading ? 'Processing...' : 'Confirm Reservation'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
