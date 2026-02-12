import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, ShoppingBag, Check, X, Clock, User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('reservations');
    const [reservations, setReservations] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
        fetchData();
    }, [user, navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'reservations') {
                const res = await api.get('/reservations/all');
                setReservations(res.data);
            } else {
                const res = await api.get('/orders/all');
                setOrders(res.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load dashboard data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReservationStatus = async (id, status) => {
        try {
            await api.put(`/reservations/${id}`, { status });
            setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            showNotification(`Reservation ${status} successfully!`);
        } catch (error) {
            console.error('Error updating reservation:', error);
            showNotification('Update failed. Please try again.', 'error');
        }
    };

    const handleOrderStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}`, { status });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            showNotification(`Order ${status} successfully!`);
        } catch (error) {
            console.error('Error updating order:', error);
            showNotification('Update failed. Please try again.', 'error');
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/admin/menu')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--accent)',
                            color: 'var(--text)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        🍽️ Manage Menu
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'reservations' ? 'var(--primary)' : 'var(--background-alt)',
                            color: activeTab === 'reservations' ? 'white' : 'var(--text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Calendar size={18} /> Reservations
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'orders' ? 'var(--primary)' : 'var(--background-alt)',
                            color: activeTab === 'orders' ? 'white' : 'var(--text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ShoppingBag size={18} /> Orders
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
            ) : (
                <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--background-alt)' }}>
                                <tr>
                                    {activeTab === 'reservations' ? (
                                        <>
                                            <th style={thStyle}>Customer</th>
                                            <th style={thStyle}>Date & Time</th>
                                            <th style={thStyle}>Guests</th>
                                            <th style={thStyle}>Notes</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th style={thStyle}>Customer</th>
                                            <th style={thStyle}>Items</th>
                                            <th style={thStyle}>Total</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'reservations' ? (
                                    reservations.map(res => (
                                        <tr key={res.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '500' }}>{res.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{res.email}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{res.phone}</div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Calendar size={14} /> {new Date(res.date).toLocaleDateString()}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                                    <Clock size={14} /> {res.time}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>{res.guests} {res.guests === 1 ? 'person' : 'people'}</td>
                                            <td style={{ ...tdStyle, maxWidth: '200px' }}>
                                                {res.special_requests ? (
                                                    <span style={{ fontSize: '0.9rem' }}>{res.special_requests}</span>
                                                ) : <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>-</span>}
                                            </td>
                                            <td style={tdStyle}>
                                                <StatusBadge status={res.status} />
                                            </td>
                                            <td style={tdStyle}>
                                                {res.status === 'pending' && (
                                                    <ActionButtons
                                                        onConfirm={() => handleReservationStatus(res.id, 'confirmed')}
                                                        onCancel={() => handleReservationStatus(res.id, 'cancelled')}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '500' }}>{order.user_name || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{order.user_email}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{order.phone}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                                                    <strong>Address:</strong> {order.delivery_address}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {order.items && order.items.map((item, idx) => (
                                                        <li key={idx} style={{ fontSize: '0.9rem' }}>
                                                            {item.quantity}x {item.item_name || 'Item'} - ${item.price}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                                                    <DollarSign size={14} /> {order.total_amount}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td style={tdStyle}>
                                                {order.status === 'pending' && (
                                                    <ActionButtons
                                                        onConfirm={() => handleOrderStatus(order.id, 'delivered')}
                                                        confirmText="Complete"
                                                        onCancel={() => handleOrderStatus(order.id, 'cancelled')}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {((activeTab === 'reservations' && reservations.length === 0) ||
                            (activeTab === 'orders' && orders.length === 0)) && (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    No {activeTab} found.
                                </div>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}

const thStyle = { padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' };
const tdStyle = { padding: '1.25rem 1rem' };

const StatusBadge = ({ status }) => {
    const getStyle = (s) => {
        const lower = s.toLowerCase();
        if (['confirmed', 'completed'].includes(lower)) return { bg: '#D1FAE5', col: '#065F46' };
        if (['cancelled'].includes(lower)) return { bg: '#FEE2E2', col: '#991B1B' };
        return { bg: '#FEF3C7', col: '#92400E' };
    };
    const { bg, col } = getStyle(status);
    return (
        <span style={{ background: bg, color: col, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', textTransform: 'capitalize' }}>
            {status}
        </span>
    );
};

const ActionButtons = ({ onConfirm, onCancel, confirmText = "Confirm" }) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={onConfirm} style={{ background: '#10B981', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }} title={confirmText}>
            <Check size={16} />
        </button>
        <button onClick={onCancel} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Cancel">
            <X size={16} />
        </button>
    </div>
);
