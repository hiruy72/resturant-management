import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [authLoading, user, navigate]);

    useEffect(() => {
        if (!user) return;
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                console.log('Fetched orders:', data);
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading || authLoading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

    if (orders.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>No orders yet</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Go to the menu and order something delicious!</p>
                <button onClick={() => navigate('/menu')} className="btn btn-primary">Browse Menu</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order) => (
                    <div key={order.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>Order #{order.id}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    Status: <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
                                        color: order.status === 'delivered' ? '#065F46' : order.status === 'cancelled' ? '#991B1B' : '#92400E'
                                    }}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>${order.total_amount}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {order.items && order.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span>
                                        <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.item_name || "Unknown Item"}
                                    </span>
                                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {order.delivery_address && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <strong>Delivery Address:</strong> {order.delivery_address}
                                <br />
                                <strong>Phone:</strong> {order.phone}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
