import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from "../../config";
import './ManageClients.css';

const ManageClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', logoUrl: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Fetch All Clients on Load
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/clients`);
            if (res.data.success) {
                setClients(res.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setMessage({ type: 'error', text: 'Failed to load clients.' });
            setLoading(false);
        }
    };

    // 2. Add New Client (Admin Only - Requires Token)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('accessToken'); // Token uthao
            const res = await axios.post(
                `${config.API_BASE_URL}/clients`, 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Token bhejo
                    }
                }
            );
            
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Client added successfully!' });
                setFormData({ name: '', logoUrl: '' }); // Form reset
                fetchClients(); // List ko refresh karo
            }
        } catch (error) {
            console.error("Error adding client:", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add client.' });
        } finally {
            setSubmitLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    // 3. Delete Client (Admin Only - Requires Token)
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            const token = localStorage.getItem('accessToken'); // Token uthao
            const res = await axios.delete(
                `${config.API_BASE_URL}/clients/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Token bhejo
                    }
                }
            );

            if (res.data.success) {
                setMessage({ type: 'success', text: `${name} deleted successfully!` });
                setClients(clients.filter(client => client._id !== id));
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            setMessage({ type: 'error', text: 'Failed to delete client.' });
        } finally {
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <div className="manage-section">
            <div className="manage-header">
                <h2>Manage Clients & Partners</h2>
                <p>Add or remove client logos from the homepage slider.</p>
            </div>

            {/* Notification Banner */}
            {message.text && (
                <div className={`alert-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="manage-grid">
                {/* LEFT SIDE: ADD FORM */}
                <div className="form-panel">
                    <h3>Add New Client</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Client / Company Name *</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Nike, Google" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Logo Image URL *</label>
                            <input 
                                type="url" 
                                placeholder="https://res.cloudinary.com/..." 
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                                required 
                            />
                            <small className="form-hint">Paste the Cloudinary URL or direct image link here.</small>
                        </div>

                        {/* Image Preview */}
                        {formData.logoUrl && (
                            <div className="image-preview">
                                <p>Preview:</p>
                                <img src={formData.logoUrl} alt="Preview" onError={(e) => e.target.style.display='none'} />
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={submitLoading}>
                            {submitLoading ? 'Adding...' : '+ Add Client'}
                        </button>
                    </form>
                </div>

                {/* RIGHT SIDE: CLIENT LIST */}
                <div className="list-panel">
                    <h3>Existing Clients ({clients.length})</h3>
                    
                    {loading ? (
                        <p className="loading-text">Loading clients...</p>
                    ) : clients.length === 0 ? (
                        <div className="empty-state">
                            <p>No clients added yet. Add your first client from the left panel.</p>
                        </div>
                    ) : (
                        <div className="clients-grid">
                            {clients.map(client => (
                                <div className="client-card" key={client._id}>
                                    <div className="client-logo-wrapper">
                                        <img src={client.logoUrl} alt={client.name} />
                                    </div>
                                    <div className="client-info">
                                        <h4>{client.name}</h4>
                                        <button 
                                            onClick={() => handleDelete(client._id, client.name)}
                                            className="btn-delete"
                                            title="Delete Client"
                                        >
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageClients;