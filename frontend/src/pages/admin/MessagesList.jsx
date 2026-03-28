import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MessagesList.css';
import config from "../../config"; // Centralized config for API base URL

const MessagesList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null); // Modal ke liye
    const [alertMsg, setAlertMsg] = useState('');

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/messages`);
            setMessages(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Open Modal and mark as read
    const handleViewMessage = async (msg) => {
        setSelectedMessage(msg);
        
        // Agar message Unread hai, toh API call marke usko Read kardo
        if (msg.status === 'Unread') {
            try {
                // Note: Make sure you have a PUT /api/messages/:id route in backend to update status
                await axios.put(`${config.API_BASE_URL}/messages/${msg._id}`, { status: 'Read' });
                // Locally state update kardo taaki refresh na karna pade
                setMessages(messages.map(m => m._id === msg._id ? { ...m, status: 'Read' } : m));
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Card click event ko rokne ke liye
        if (window.confirm('Permanently delete this inquiry?')) {
            try {
                // Note: Make sure you have a DELETE /api/messages/:id route in backend
                await axios.delete(`${config.API_BASE_URL}/messages/${id}`);
                setAlertMsg('Message deleted successfully.');
                fetchMessages();
                setTimeout(() => setAlertMsg(''), 3000);
            } catch (err) {
                alert('Delete failed!');
            }
        }
    };

    // Date formatter
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) return <div className="p-6 text-gray-500 font-semibold">Loading Inbox...</div>;

    const unreadCount = messages.filter(m => m.status === 'Unread').length;

    return (
        <div className="messages-wrapper">
            
            {alertMsg && (
                <div className="alert-success" style={{ marginBottom: '20px' }}>
                    {alertMsg}
                </div>
            )}

            <div className="messages-header-flex">
                <h2>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Client Inquiries
                </h2>
                <div className="msg-count-badge">
                    {messages.length} Total ({unreadCount} Unread)
                </div>
            </div>

            {/* ── INBOX LIST ── */}
            <div className="inbox-container">
                {messages.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        Your inbox is empty.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg._id} 
                            className={`message-item ${msg.status === 'Unread' ? 'unread' : 'read'}`}
                            onClick={() => handleViewMessage(msg)}
                        >
                            <div className="msg-status-dot"></div>
                            
                            <div>
                                <div className="msg-sender">{msg.name}</div>
                                <div className="msg-email">{msg.email}</div>
                            </div>
                            
                            <div className="msg-subject">{msg.subject}</div>
                            
                            <div className="msg-date">{formatDate(msg.createdAt)}</div>
                            
                            <button 
                                className="msg-delete-btn"
                                onClick={(e) => handleDelete(e, msg._id)}
                                title="Delete Message"
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* ── MESSAGE VIEW MODAL ── */}
            {selectedMessage && (
                <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="modal-header">
                            <h3>{selectedMessage.subject}</h3>
                            <button className="close-modal-btn" onClick={() => setSelectedMessage(null)}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-info-grid">
                                <div>
                                    <div className="info-label">Sender Name</div>
                                    <div className="info-value">{selectedMessage.name}</div>
                                </div>
                                <div>
                                    <div className="info-label">Date Received</div>
                                    <div className="info-value">{formatDate(selectedMessage.createdAt)}</div>
                                </div>
                                <div>
                                    <div className="info-label">Email Address</div>
                                    <div className="info-value">{selectedMessage.email}</div>
                                </div>
                                <div>
                                    <div className="info-label">Phone Number</div>
                                    <div className="info-value">{selectedMessage.phone || 'Not Provided'}</div>
                                </div>
                            </div>

                            <div className="info-label" style={{ marginBottom: '8px' }}>Message Content</div>
                            <div className="modal-message-box">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setSelectedMessage(null)} className="btn-outline" style={{ padding: '10px 20px' }}>
                                Close
                            </button>
                            <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="btn-reply">
                                Reply via Email
                            </a>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default MessagesList;