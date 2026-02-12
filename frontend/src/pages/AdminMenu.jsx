import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function AdminMenu() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        available: true
    });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
        fetchMenuItems();
    }, [user, navigate]);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const res = await api.get('/menu');
            setMenuItems(res.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            showNotification('Failed to load menu items.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            available: true
        });
        setShowAddForm(false);
        setEditingItem(null);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.category) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const itemData = {
                ...formData,
                price: parseFloat(formData.price),
                isAvailable: formData.available
            };

            await api.post('/menu', itemData);
            showNotification('Menu item added successfully!');
            resetForm();
            fetchMenuItems();
        } catch (error) {
            console.error('Error adding menu item:', error);
            const errorMsg = error.response?.data?.message || 'Failed to add menu item.';
            showNotification(errorMsg, 'error');
        }
    };

    const handleEditItem = (item) => {
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price.toString(),
            category: item.category,
            image: item.image || '',
            available: item.available
        });
        setEditingItem(item.id);
        setShowAddForm(true);
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.category) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const itemData = {
                ...formData,
                price: parseFloat(formData.price),
                isAvailable: formData.available
            };

            await api.put(`/menu/${editingItem}`, itemData);
            showNotification('Menu item updated successfully!');
            resetForm();
            fetchMenuItems();
        } catch (error) {
            console.error('Error updating menu item:', error);
            const errorMsg = error.response?.data?.message || 'Failed to update menu item.';
            showNotification(errorMsg, 'error');
        }
    };

    const handleDeleteItem = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await api.delete(`/menu/${id}`);
            showNotification('Menu item deleted successfully!');
            fetchMenuItems();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            const errorMsg = error.response?.data?.message || 'Failed to delete menu item.';
            showNotification(errorMsg, 'error');
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            const item = menuItems.find(item => item.id === id);
            await api.put(`/menu/${id}`, {
                ...item,
                isAvailable: !currentStatus
            });
            showNotification(`Item ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
            fetchMenuItems();
        } catch (error) {
            console.error('Error updating availability:', error);
            showNotification('Failed to update availability.', 'error');
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Menu Management</h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} /> Add New Item
                </button>
            </div>

            {/* Add/Edit Form Modal */}
            {showAddForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="appetizers">Appetizers</option>
                                        <option value="main-courses">Main Courses</option>
                                        <option value="desserts">Desserts</option>
                                        <option value="beverages">Beverages</option>
                                        <option value="salads">Salads</option>
                                        <option value="soups">Soups</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="available"
                                        checked={formData.available}
                                        onChange={handleInputChange}
                                    />
                                    <span>Available for order</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <Save size={18} />
                                    {editingItem ? 'Update Item' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Menu Items List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading menu items...</div>
            ) : (
                <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--background-alt)' }}>
                                <tr>
                                    <th style={thStyle}>Image</th>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Description</th>
                                    <th style={thStyle}>Price</th>
                                    <th style={thStyle}>Category</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={tdStyle}>
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: '500' }}>{item.name}</div>
                                        </td>
                                        <td style={{ ...tdStyle, maxWidth: '200px' }}>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                                {item.description || '-'}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                                                ${item.price}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                background: 'var(--background)',
                                                border: '1px solid var(--border)',
                                                textTransform: 'capitalize'
                                            }}>
                                                {item.category.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => toggleAvailability(item.id, item.available)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    background: item.available ? '#D1FAE5' : '#FEE2E2',
                                                    color: item.available ? '#065F46' : '#991B1B'
                                                }}
                                            >
                                                {item.available ? 'Available' : 'Unavailable'}
                                            </button>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEditItem(item)}
                                                    style={{
                                                        background: '#3B82F6',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id, item.name)}
                                                    style={{
                                                        background: '#EF4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {menuItems.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                No menu items found. Add your first item!
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