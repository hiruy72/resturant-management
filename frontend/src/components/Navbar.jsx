import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🍔</span> RestaurantApp
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="nav-links">
                        {user?.role === 'admin' ? (
                            // Admin navigation - direct links instead of dropdown
                            <>
                                <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
                                <Link to="/admin" style={{ fontWeight: 500 }}>Dashboard</Link>
                                <Link to="/admin/menu" style={{ fontWeight: 500 }}>Manage Menu</Link>
                                <Link to="/menu" style={{ fontWeight: 500 }}>View Menu</Link>
                            </>
                        ) : (
                            // Regular user navigation
                            <>
                                <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
                                <Link to="/menu" style={{ fontWeight: 500 }}>Menu</Link>
                                <Link to="/contact" style={{ fontWeight: 500 }}>Contact</Link>
                                {user && (
                                    <>
                                        <Link to="/orders" style={{ fontWeight: 500 }}>My Orders</Link>
                                        <Link to="/my-reservations" style={{ fontWeight: 500 }}>Reservations</Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button onClick={toggleTheme} className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text)' }}>
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        
                        {/* Only show cart for non-admin users */}
                        {user?.role !== 'admin' && (
                            <Link to="/cart" className="btn btn-outline" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                                <ShoppingCart size={20} />
                                {totalItems > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold'
                                    }}>{totalItems}</span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600 }}>
                                    {user.role === 'admin' ? '👑 ' : ''}{user.name}
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to="/login" className="btn btn-outline">Login</Link>
                                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
