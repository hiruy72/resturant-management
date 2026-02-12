import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Users } from 'lucide-react';

export default function MyReservations() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchReservations = async () => {
            try {
                const res = await api.get('/reservations');
                setReservations(res.data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user]);

    if (!user) return <div className="container" style={{ padding: '2rem' }}>Please log in to view reservations.</div>;
    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading reservations...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0', minHeight: '60vh' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Reservations</h1>

            {reservations.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '3rem' }}>
                    <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No reservations found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {reservations.map((res) => (
                        <div key={res.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>{res.name}</h3>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    background: res.status === 'confirmed' ? '#D1FAE5' : res.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
                                    color: res.status === 'confirmed' ? '#065F46' : res.status === 'cancelled' ? '#991B1B' : '#92400E'
                                }}>
                                    {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} />
                                    <span>{new Date(res.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={16} />
                                    <span>{res.time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={16} />
                                    <span>{res.guests} {res.guests === 1 ? 'person' : 'people'}</span>
                                </div>
                            </div>
                            {res.special_requests && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)', fontSize: '0.9rem' }}>
                                    <strong>Special Requests:</strong> {res.special_requests}
                                </div>
                            )}
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                <strong>Contact:</strong> {res.email} • {res.phone}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
