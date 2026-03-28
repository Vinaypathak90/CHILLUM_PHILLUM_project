import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageContent.css'; // Importing shared standard admin CSS
import config from "../../config"; // Any specific campaign CSS

const ManageCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form and Status states
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingInfo, setUploadingInfo] = useState('');

    // 🔥 Initial Form State matching updated Campaign.js Model
    const initialFormState = {
        title: '',
        dateString: '',
        excerpt: '', // Card ke upar dikhne wala short text
        detailedContent: '', // 🔥 NAYA FIELD: Popup me dikhne wali badi news
        imageUrl: '',
        readMoreLink: '#',
        isPublished: true,
        order: 0
    };
    const [formData, setFormData] = useState(initialFormState);

    // Fetch all campaigns on mount
    const fetchCampaigns = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/campaigns`);
            setCampaigns(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Handle Form Input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    // Custom Toggle Handler for isPublished
    const handleTogglePublish = () => {
        setFormData({ ...formData, isPublished: !formData.isPublished });
    };

    // 🚀 NEW: Handle Image Upload (Cloudinary)
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingInfo('Uploading Image... Please wait ⏳');
        const fd = new FormData();
        fd.append('image', file);

        try {
            const uploadRes = await axios.post(`${config.API_BASE_URL}/upload`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, imageUrl: uploadRes.data.imageUrl }));
            setUploadingInfo('Image uploaded successfully! ✅');
            setTimeout(() => setUploadingInfo(''), 3000);
            e.target.value = null; // Clear input
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadingInfo('❌ Upload failed! Check your backend /api/upload route.');
            setTimeout(() => setUploadingInfo(''), 5000);
        }
    };

    // Submit Handler (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            if (isEditing) {
                // Update existing campaign
                await axios.put(`${config.API_BASE_URL}/campaigns/${currentId}`, formData);
                setMessage({ text: 'Campaign updated successfully! 📢', type: 'success' });
            } else {
                // Create new campaign
                await axios.post(`${config.API_BASE_URL}/campaigns`, formData);
                setMessage({ text: 'New campaign published! 🎉', type: 'success' });
            }
            
            // Reset form and refresh list
            setFormData(initialFormState);
            setIsEditing(false);
            setCurrentId(null);
            fetchCampaigns();
            
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Operation failed!', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // Load data into form for editing
    const handleEditClick = (campaign) => {
        setFormData({
            title: campaign.title,
            dateString: campaign.dateString,
            excerpt: campaign.excerpt,
            detailedContent: campaign.detailedContent || '', // Safely load old data too
            imageUrl: campaign.imageUrl,
            readMoreLink: campaign.readMoreLink || '#',
            isPublished: campaign.isPublished !== false, 
            order: campaign.order
        });
        setCurrentId(campaign._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setCurrentId(null);
    };

    // Delete a campaign
    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this campaign?')) {
            try {
                await axios.delete(`${config.API_BASE_URL}/campaigns/${id}`);
                setMessage({ text: 'Campaign deleted.', type: 'success' });
                fetchCampaigns();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (err) {
                alert('Failed to delete campaign.');
            }
        }
    };

    if (loading) return <div className="loading-text" style={{padding: '20px', fontWeight: 'bold', color: '#6b7280'}}>Loading Campaigns Data...</div>;

    return (
        <div className="manage-content-wrapper">
            
            {/* Status Alert */}
            {message.text && (
                <div className="alert-success" style={{ marginBottom: '20px', backgroundColor: message.type === 'error' ? '#fee2e2' : '#d1fae5', color: message.type === 'error' ? '#991b1b' : '#065f46' }}>
                    {message.text}
                </div>
            )}

            {uploadingInfo && (
                <div className="alert-success" style={{ marginBottom: '20px', backgroundColor: '#eff2fe', color: '#292e91', border: '1px solid #c7d2fe' }}>
                    {uploadingInfo}
                </div>
            )}

            {/* ── CAMPAIGN FORM ── */}
            <div className="form-section">
                <div className="section-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {isEditing 
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                }
                            </svg>
                        </div>
                        <h3>{isEditing ? 'Edit Campaign News' : 'Add New Campaign News'}</h3>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="content-form">
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Campaign Title</label>
                            <input 
                                type="text" name="title" required className="form-input"
                                value={formData.title} onChange={handleChange}
                                placeholder="e.g. New Short Film in Production"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Display Date</label>
                            <input 
                                type="text" name="dateString" required className="form-input"
                                value={formData.dateString} onChange={handleChange}
                                placeholder="e.g. March 2026"
                            />
                        </div>
                    </div>

                    {/* 🔥 IMAGE UPLOAD UI */}
                    <div className="form-group">
                        <label className="form-label">Cover Image (URL or Upload)</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                            )}
                            <input 
                                type="url" name="imageUrl" required className="form-input" style={{ flex: 1, margin: 0 }}
                                value={formData.imageUrl} onChange={handleChange}
                                placeholder="https://images.unsplash.com/photo-..."
                            />
                           
                            {formData.imageUrl && (
                                <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="btn-remove" style={{padding: '10px 15px'}}>Clear</button>
                            )}
                        </div>
                    </div>

                    <div className="form-group" style={{marginBottom: '20px'}}>
                        <label className="form-label">Short Excerpt (Max 300 chars - Shows on the card)</label>
                        <textarea 
                            name="excerpt" required maxLength="300"
                            className="form-input form-textarea" style={{minHeight: '80px'}}
                            value={formData.excerpt} onChange={handleChange}
                            placeholder="Briefly describe the campaign news..."
                        ></textarea>
                    </div>

                    {/* 🔥 NEW: DETAILED CONTENT FOR POPUP */}
                    <div className="form-group" style={{marginBottom: '20px'}}>
                        <label className="form-label">Detailed Content (Shows inside the full Popup)</label>
                        <textarea 
                            name="detailedContent" required
                            className="form-input form-textarea" style={{minHeight: '150px'}}
                            value={formData.detailedContent} onChange={handleChange}
                            placeholder="Write the full news/campaign details here..."
                        ></textarea>
                    </div>

                    <div className="form-grid-2" style={{alignItems: 'end', marginBottom: '20px'}}>
                        <div className="input-group">
                            <label className="input-label">Read More Link (Optional External Link)</label>
                            <input 
                                type="text" name="readMoreLink"
                                className="form-input"
                                value={formData.readMoreLink} onChange={handleChange}
                                placeholder="e.g. https://your-link.com or #"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Display Order</label>
                            <input 
                                type="number" name="order" min="0" required
                                className="form-input"
                                value={formData.order} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                        {/* Custom Published Toggle */}
                        <div className="input-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <label className="input-label" style={{margin: 0}}>Visibility Status:</label>
                            <div style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}} onClick={handleTogglePublish}>
                                <div style={{width: '40px', height: '22px', background: formData.isPublished ? '#10b981' : '#d1d5db', borderRadius: '15px', position: 'relative', transition: '0.3s'}}>
                                    <div style={{width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: formData.isPublished ? '20px' : '2px', transition: '0.3s'}}></div>
                                </div>
                                <span style={{fontSize: '14px', fontWeight: 'bold', color: formData.isPublished ? '#10b981' : '#6b7280'}}>
                                    {formData.isPublished ? 'Public (Visible)' : 'Draft (Hidden)'}
                                </span>
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                            {isEditing && (
                                <button type="button" onClick={handleCancelEdit} className="btn-remove" style={{padding: '16px 30px'}}>
                                    CANCEL
                                </button>
                            )}
                            <button type="submit" disabled={submitting} className="save-btn">
                                {submitting ? 'PROCESSING...' : (isEditing ? 'UPDATE CAMPAIGN' : 'PUBLISH CAMPAIGN')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── CAMPAIGNS GRID DISPLAY ── */}
            <div className="form-section" style={{marginTop: '40px'}}>
                <div className="section-header">
                    <h3>News & Campaigns Library <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400', marginLeft: '10px' }}>({campaigns.length} Total Articles)</span></h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {campaigns.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No campaigns found. Start writing your first news update.</p>
                    ) : (
                        campaigns.map((camp) => (
                            <div key={camp._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={camp.imageUrl} alt={camp.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    
                                    {/* Badges */}
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: camp.isPublished ? '#10b981' : '#6b7280', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                                        {camp.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#b5862a', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                        {camp.dateString}
                                    </div>
                                </div>
                                
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                                        {camp.title}
                                    </h4>
                                    <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '13px', lineHeight: '1.6' }}>
                                        {camp.excerpt}
                                    </p>
                                    
                                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                        <button onClick={() => handleEditClick(camp)} className="btn-add" style={{flex: 1, padding: '10px', marginTop: 0}}>Edit</button>
                                        <button onClick={() => handleDeleteClick(camp._id)} className="btn-remove" style={{flex: 1, padding: '10px', marginTop: 0}}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default ManageCampaigns;