import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [ordering, setOrdering] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [phone, setPhone] = useState('');

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!deliveryAddress.trim() || !phone.trim()) {
            showNotification('Please provide delivery address and phone number.', 'error');
            return;
        }

        setOrdering(true);
        try {
            const orderItems = cart.map(item => ({
                menu_item_id: item.id || item._id, // Handle both id formats
                quantity: item.quantity,
                price: item.price
            }));

            await api.post('/orders', {
                items: orderItems,
                totalPrice,
                delivery_address: deliveryAddress,
                phone: phone
            });

            clearCart();
            showNotification('Order placed successfully! We hope you enjoy your meal.');
            navigate('/orders');
        } catch (err) {
            console.error('Order placement error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to place order. Please check your connection and try again.';
            showNotification(errorMessage, 'error');
        } finally {
            setOrdering(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/menu')} className="btn btn-primary">Browse Menu</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>

            <div className="card">
                {cart.map((item) => (
                    <div key={item.id || item._id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                        {/* Thumbnail if available */}
                        <div style={{ width: '80px', height: '80px', background: '#eee', borderRadius: '8px', backgroundImage: `url(${item.image || ''})`, backgroundSize: 'cover' }}></div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id || item._id)} style={{ background: 'none', border: 'none', color: '#EF4444' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.price}</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0.25rem 0.5rem' }}
                                    onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                                >-</button>
                                <span>{item.quantity}</span>
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0.25rem 0.5rem' }}
                                    onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                                >+</button>
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px dashed var(--border)' }}>
                    {/* Delivery Information Form */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Delivery Information</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Delivery Address *
                            </label>
                            <textarea
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Enter your full delivery address"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    resize: 'vertical',
                                    minHeight: '80px'
                                }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={ordering}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    >
                        {ordering ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
