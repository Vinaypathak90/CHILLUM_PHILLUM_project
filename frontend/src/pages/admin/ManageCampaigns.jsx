import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageContent.css'; // Consistent admin styles
import './ManageProjects.css'; 
import config from "../../config"; // Centralized config for API base URL

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
        detailedContent: '', // Popup me dikhne wali badi news
        imageUrl: '',
        readMoreLink: '#',
        isPublished: true,
        order: 0
    };
    const [formData, setFormData] = useState(initialFormState);

    // 🔥 NEW: Page Content State (Specialties, Trending, Counters)
    const [pageData, setPageData] = useState({
        specLabel: 'Campaign Specialties', specTitleMain: 'We Excel in', specTitleHighlight: 'Every Campaign Type',
        specialties: [],
        trendingLabel: 'Recent Highlights', trendingTitleMain: 'Trending', trendingTitleHighlight: 'Right Now',
        trending: [],
        impactLabel: 'Measurable Results', impactTitleMain: 'Campaigns That', impactTitleHighlight: 'Deliver Real Impact',
        impactStats: [],
    });

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

    // 🔥 NEW: Fetch Global Page Content
    const fetchPageData = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/page-content`);
            if (res.data.data?.campaignsPage) {
                setPageData(prev => ({ ...prev, ...res.data.data.campaignsPage }));
            }
        } catch (err) {
            console.error("Fetch Page Data Error:", err);
        }
    };

    useEffect(() => {
        fetchCampaigns();
        fetchPageData(); // Fetching new features data as well
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

    // Handle Image Upload
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

    // Submit Handler (Create or Update Campaign Post)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            if (isEditing) {
                await axios.put(`${config.API_BASE_URL}/campaigns/${currentId}`, formData);
                setMessage({ text: 'Campaign updated successfully! 📢', type: 'success' });
            } else {
                await axios.post(`${config.API_BASE_URL}/campaigns`, formData);
                setMessage({ text: 'New campaign published! 🎉', type: 'success' });
            }
            
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
            detailedContent: campaign.detailedContent || '',
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

    // 🔥 NEW: Handlers for Page Content Arrays (Specialties, Trending, Stats)
    const handleArrayChange = (arrayName, index, field, value) => {
        const newArr = [...(pageData[arrayName] || [])];
        newArr[index][field] = value;
        setPageData({ ...pageData, [arrayName]: newArr });
    };

    const addArrayItem = (arrayName, emptyObj) => {
        setPageData({ ...pageData, [arrayName]: [...(pageData[arrayName] || []), emptyObj] });
    };

    const removeArrayItem = (arrayName, index) => {
        const newArr = pageData[arrayName].filter((_, i) => i !== index);
        setPageData({ ...pageData, [arrayName]: newArr });
    };

    const handlePageDataSave = async () => {
        setSubmitting(true);
        try {
            await axios.post(`${config.API_BASE_URL}/page-content`, { campaignsPage: pageData });
            setMessage({ text: 'Global Page Settings Saved Successfully! 💾', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: 'Error saving page settings!', type: 'error' });
        }
        setSubmitting(false);
    };

    if (loading) return <div className="loading-text" style={{padding: '20px', fontWeight: 'bold', color: '#6b7280'}}>Loading Campaigns Data...</div>;

    return (
        <div className="manage-content-wrapper pb-32">
            
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

            {/* ── CAMPAIGN FORM (UNTOUCHED) ── */}
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
                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                <button type="button" className="btn-add" style={{ margin: 0, padding: '10px 15px' }}>Upload File</button>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                />
                            </div>
                            {formData.imageUrl && (
                                <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="btn-remove" style={{padding: '10px 15px', margin: 0}}>Clear</button>
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

            {/* ── CAMPAIGNS GRID DISPLAY (UNTOUCHED) ── */}
            <div className="form-section" style={{marginTop: '40px', marginBottom: '60px'}}>
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

            {/* =========================================================================
                🔥 NEW FEATURES: PREMIUM UI FOR PAGE CONTENT SETTINGS 🔥
            ========================================================================= */}

            {/* ── SECTION 2: CAMPAIGN SPECIALTIES ── */}
            <div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">🎯</span>
                            Campaign Specialties
                        </h3>
                    </div>
                    <button type="button" onClick={() => addArrayItem('specialties', {icon:'', title:'', desc:''})} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-100 active:scale-95" style={{margin: 0}}>
                        + Add Specialty
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="form-group mb-0">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Main Title</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={pageData.specTitleMain || ''} onChange={e => setPageData({...pageData, specTitleMain: e.target.value})} placeholder="We Excel in" />
                    </div>
                    <div className="form-group mb-0">
                        <label className="text-xs font-bold text-amber-500 uppercase mb-2 block">Highlight Title</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-amber-600 font-serif italic" value={pageData.specTitleHighlight || ''} onChange={e => setPageData({...pageData, specTitleHighlight: e.target.value})} placeholder="Every Campaign Type" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(pageData.specialties || []).map((spec, i) => (
                        <div key={i} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-all group">
                            <button type="button" onClick={() => removeArrayItem('specialties', i)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10 font-bold">×</button>
                            <input type="text" className="w-full mb-3 px-4 py-2 text-sm rounded-lg border border-gray-100 focus:bg-emerald-50/30 outline-none transition-colors" placeholder="Icon (e.g. 🎯)" value={spec.icon || ''} onChange={e => handleArrayChange('specialties', i, 'icon', e.target.value)} />
                            <input type="text" className="w-full mb-3 px-4 py-2 text-sm rounded-lg border border-gray-100 focus:bg-emerald-50/30 outline-none transition-colors font-bold text-gray-700" placeholder="Specialty Title" value={spec.title || ''} onChange={e => handleArrayChange('specialties', i, 'title', e.target.value)} />
                            <textarea className="w-full px-4 py-3 text-sm rounded-lg border border-gray-100 focus:bg-emerald-50/30 outline-none transition-colors text-gray-600 min-h-[100px]" placeholder="Specialty Description..." value={spec.desc || ''} onChange={e => handleArrayChange('specialties', i, 'desc', e.target.value)}></textarea>
                        </div>
                    ))}
                    {pageData.specialties?.length === 0 && <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">No specialties added yet.</div>}
                </div>
            </div>

            {/* ── SECTION 3: TRENDING HIGHLIGHTS ── */}
            <div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">🔥</span>
                            Trending Highlights
                        </h3>
                    </div>
                    <button type="button" onClick={() => addArrayItem('trending', {title:'', desc:'', tags:''})} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-purple-100 active:scale-95" style={{margin: 0}}>
                        + Add Trending Card
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="form-group mb-0">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Main Title</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={pageData.trendingTitleMain || ''} onChange={e => setPageData({...pageData, trendingTitleMain: e.target.value})} placeholder="Trending" />
                    </div>
                    <div className="form-group mb-0">
                        <label className="text-xs font-bold text-amber-500 uppercase mb-2 block">Highlight Title</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-amber-600 font-serif italic" value={pageData.trendingTitleHighlight || ''} onChange={e => setPageData({...pageData, trendingTitleHighlight: e.target.value})} placeholder="Right Now" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(pageData.trending || []).map((item, i) => (
                        <div key={i} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-purple-200 transition-all group">
                            <button type="button" onClick={() => removeArrayItem('trending', i)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10 font-bold">×</button>
                            <input type="text" className="w-full mb-3 px-4 py-2 text-sm rounded-lg border border-gray-100 focus:bg-purple-50/30 outline-none transition-colors font-bold text-gray-800" placeholder="Campaign Title" value={item.title || ''} onChange={e => handleArrayChange('trending', i, 'title', e.target.value)} />
                            <textarea className="w-full mb-3 px-4 py-3 text-sm rounded-lg border border-gray-100 focus:bg-purple-50/30 outline-none transition-colors text-gray-600 min-h-[100px]" placeholder="Description..." value={item.desc || ''} onChange={e => handleArrayChange('trending', i, 'desc', e.target.value)}></textarea>
                            <input type="text" className="w-full px-4 py-2 text-xs font-bold text-amber-600 uppercase rounded-lg border border-gray-100 focus:bg-purple-50/30 outline-none transition-colors tracking-wide" placeholder="Tags (e.g. 🔥 Trending • 10M+ Views)" value={item.tags || ''} onChange={e => handleArrayChange('trending', i, 'tags', e.target.value)} />
                        </div>
                    ))}
                    {pageData.trending?.length === 0 && <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">No trending cards added yet.</div>}
                </div>
            </div>

            {/* ── SECTION 4: IMPACT COUNTERS (ANIMATED) ── */}
            <div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">📈</span>
                        Impact Counters (Animated)
                    </h3>
                    <button type="button" onClick={() => addArrayItem('impactStats', {number:'', label1:'', label2:''})} className="flex items-center gap-2 text-amber-700 bg-amber-100 hover:bg-amber-200 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95" style={{margin: 0}}>
                        + Add Counter Metric
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(pageData.impactStats || []).map((s, i) => (
                        <div key={i} className="relative p-6 bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl shadow-sm text-center group">
                            <button type="button" onClick={() => removeArrayItem('impactStats', i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 font-bold bg-white rounded-full w-6 h-6 shadow-sm flex items-center justify-center transition-colors">×</button>
                            
                            <div className="space-y-3 pt-2">
                                <input type="text" className="w-full bg-transparent text-center text-3xl font-black text-amber-600 placeholder-gray-300 focus:outline-none" placeholder="500M+" value={s.number || ''} onChange={e => handleArrayChange('impactStats', i, 'number', e.target.value)} />
                                <div className="space-y-1">
                                    <input type="text" className="w-full bg-transparent text-center text-[10px] font-black uppercase tracking-widest text-gray-800 focus:outline-none border-b border-transparent focus:border-amber-200 pb-1" placeholder="TOP LABEL" value={s.label1 || ''} onChange={e => handleArrayChange('impactStats', i, 'label1', e.target.value)} />
                                    <input type="text" className="w-full bg-transparent text-center text-[11px] font-medium text-gray-500 focus:outline-none border-b border-transparent focus:border-amber-200 pb-1" placeholder="bottom label" value={s.label2 || ''} onChange={e => handleArrayChange('impactStats', i, 'label2', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {pageData.impactStats?.length === 0 && <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">No metrics added yet.</div>}
                </div>
            </div>

            {/* ── GLOBAL STICKY SAVE BUTTON FOR PAGE SETTINGS ── */}
            <div className="mt-8 sticky bottom-4 z-50">
                <button onClick={handlePageDataSave} className="w-full bg-[#1a1a1a] text-white p-5 rounded-lg text-xl font-bold uppercase tracking-widest shadow-2xl hover:bg-[#b5862a] transition-all duration-300">
                    {submitting ? 'SAVING...' : '💾 SAVE PAGE SETTINGS'}
                </button>
            </div>
        </div>
            
        
    );
};

export default ManageCampaigns;