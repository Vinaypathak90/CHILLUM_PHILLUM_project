import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MessagesList.css';
import config from "../../config";

const MessagesList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
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

    const handleViewMessage = async (msg) => {
        setSelectedMessage(msg);
        if (msg.status === 'Unread') {
            try {
                await axios.put(`${config.API_BASE_URL}/messages/${msg._id}`, { status: 'Read' });
                setMessages(prevMessages => 
                    prevMessages.map(m => m._id === msg._id ? { ...m, status: 'Read' } : m)
                );
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        if (window.confirm('Permanently delete this inquiry?')) {
            try {
                await axios.delete(`${config.API_BASE_URL}/messages/${id}`);
                setAlertMsg('Message deleted successfully.');
                if (selectedMessage && selectedMessage._id === id) {
                    setSelectedMessage(null);
                }
                fetchMessages();
                setTimeout(() => setAlertMsg(''), 3000);
            } catch (err) {
                alert('Delete failed!');
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) return <div className="p-6 text-gray-500 font-semibold">Loading Inbox...</div>;

    const unreadCount = messages.filter(m => m.status === 'Unread').length;

    return (
        <>
            <div className="messages-wrapper">
                
                {alertMsg && (
                    <div className="alert-success bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 font-bold mb-5 flex items-center gap-2">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {alertMsg}
                    </div>
                )}

                {/* ── HIGH-END PREMIUM FULL MESSAGE VIEW ── */}
                {selectedMessage ? (
                    <div className="full-message-view animate-[fadeIn_0.3s_ease]">
                        
                        <button className="flex items-center gap-2 text-gray-500 hover:text-[#292e91] font-bold mb-6 transition-all" onClick={() => setSelectedMessage(null)}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Inbox
                        </button>

                        <div className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            
                            {/* Header (Subject & Actions) */}
                            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-start gap-4 bg-gray-50/50">
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight m-0">{selectedMessage.subject}</h2>
                                <button 
                                    className="text-red-400 hover:text-white hover:bg-red-500 p-2.5 rounded-xl transition-all shadow-sm bg-white border border-red-100 shrink-0" 
                                    onClick={(e) => handleDelete(e, selectedMessage._id)}
                                    title="Delete Message"
                                >
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Meta Info (Sender details) */}
                            <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-100">
                                <div className="flex items-center gap-5">
                                    {/* User Avatar */}
                                    <div className="w-14 h-14 rounded-full bg-[#eff2fe] text-[#292e91] flex items-center justify-center text-2xl font-black shrink-0 shadow-sm border border-[#e0e7ff]">
                                        {selectedMessage.name ? selectedMessage.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-gray-900">{selectedMessage.name}</div>
                                        <div className="text-sm text-gray-500 font-medium mt-0.5 flex flex-wrap gap-2 items-center">
                                            <a href={`mailto:${selectedMessage.email}`} className="text-[#292e91] hover:underline flex items-center gap-1">
                                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                {selectedMessage.email}
                                            </a> 
                                            {selectedMessage.phone && (
                                                <>
                                                    <span className="text-gray-300 hidden sm:inline">•</span>
                                                    <span className="text-gray-600 flex items-center gap-1">
                                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        {selectedMessage.phone}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 shadow-inner w-full sm:w-auto">
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</div>
                                    <div className="text-[15px] font-semibold text-gray-800">{formatDate(selectedMessage.createdAt)}</div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="p-6 sm:p-10 text-gray-700 text-[16px] leading-loose whitespace-pre-wrap min-h-[300px] bg-white">
                                {selectedMessage.message}
                            </div>

                            {/* Footer / Reply Button */}
                            <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="bg-[#292e91] hover:bg-[#1e226a] text-white px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_4px_15px_-3px_rgba(41,46,145,0.4)] hover:shadow-[0_8px_20px_-3px_rgba(41,46,145,0.5)] hover:-translate-y-0.5 active:scale-95">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    Reply to {selectedMessage.name ? selectedMessage.name.split(' ')[0] : 'Client'}
                                </a>
                            </div>

                        </div>
                    </div>
                ) : (
                    /* ── INBOX LIST VIEW (Unchanged) ── */
                    <>
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

                        <div className="inbox-container">
                            {messages.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280', fontSize: '16px' }}>
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
                                            className="msg-delete-btn list-delete"
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
                    </>
                )}
            </div> 
        </>
    );
};

export default MessagesList;