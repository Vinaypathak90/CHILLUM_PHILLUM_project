import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageContent.css'; // Consistent admin styles
import './ManageProjects.css'; 
import config from "../../config";// Centralized config for API base URL
const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form and Status states
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingInfo, setUploadingInfo] = useState('');

    // Page Data State (for case studies, stats, CTA)
    const [pageData, setPageData] = useState({
        caseStudiesTitleMain: '',
        caseStudiesTitleHighlight: '',
        caseStudies: [],
        stats: [],
        ctaTitleMain: '',
        ctaTitleHighlight: '',
        ctaDesc: ''
    });

    // 🔥 Initial Form State matching updated Project.js Model
    const initialFormState = {
        title: '',
        category: '',
        shortDescription: '',     // Nayi field card ke liye
        detailedDescription: '',  // Nayi field popup ke liye
        imageUrl: '',
        order: 0
    };
    const [formData, setFormData] = useState(initialFormState);

    // Fetch all projects on mount
    const fetchProjects = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/projects`);
            setProjects(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchPageData();
    }, []);

    // Fetch page data (case studies, stats, CTA)
    const fetchPageData = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/page-content`);
            if (res.data.success && res.data.data?.projectsPage) {
                setPageData(res.data.data.projectsPage);
            }
        } catch (err) {
            console.error("Error fetching page data:", err);
        }
    };

    // Handle Form Input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🚀 NEW: Handle Image Upload
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
                // Update existing project
                await axios.put(`${config.API_BASE_URL}/projects/${currentId}`, formData);
                setMessage({ text: 'Project successfully updated! 🎬', type: 'success' });
            } else {
                // Create new project
                await axios.post(`${config.API_BASE_URL}/projects`, formData);
                setMessage({ text: 'New project published! 🚀', type: 'success' });
            }
            
            // Reset form and refresh list
            setFormData(initialFormState);
            setIsEditing(false);
            setCurrentId(null);
            fetchProjects();
            
            // Hide message after 3 seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Operation failed!', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // Load data into form for editing
    const handleEditClick = (project) => {
        setFormData({
            title: project.title,
            category: project.category,
            // Fallback to old 'description' if 'shortDescription' is missing for old data
            shortDescription: project.shortDescription || project.description || '', 
            detailedDescription: project.detailedDescription || '',
            imageUrl: project.imageUrl,
            order: project.order || 0
        });
        setCurrentId(project._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setCurrentId(null);
    };

    // Delete a project
    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this project?')) {
            try {
                await axios.delete(`${config.API_BASE_URL}/projects/${id}`);
                setMessage({ text: 'Project deleted.', type: 'success' });
                fetchProjects();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (err) {
                alert('Failed to delete project.');
            }
        }
    };

    // Add item to array fields (caseStudies, stats)
    const addArrayItem = (field, newItem) => {
        setPageData({
            ...pageData,
            [field]: [...(pageData[field] || []), newItem]
        });
    };

    // Remove item from array fields
    const removeArrayItem = (field, index) => {
        setPageData({
            ...pageData,
            [field]: pageData[field].filter((_, i) => i !== index)
        });
    };

    // Update nested array item properties
    const handleArrayChange = (field, index, key, value) => {
        const updatedArray = [...pageData[field]];
        updatedArray[index] = { ...updatedArray[index], [key]: value };
        setPageData({ ...pageData, [field]: updatedArray });
    };

    // Save page data (case studies, stats, CTA)
    const handlePageDataSave = async () => {
        setSubmitting(true);
        try {
            const dataToSave = {
                projectsPage: pageData
            };
            await axios.post(`${config.API_BASE_URL}/page-content`, dataToSave);
            setMessage({ text: '✅ Page settings saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: '❌ Failed to save: ' + (err.response?.data?.message || err.message), type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-text" style={{padding: '20px', fontWeight: 'bold', color: '#6b7280'}}>Loading Projects Data...</div>;

    return (
        <div className="manage-content-wrapper">
            
            {/* Status Alerts */}
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

            {/* ── PROJECT FORM ── */}
            <div className="form-section">
                <div className="section-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {isEditing 
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                }
                            </svg>
                        </div>
                        <h3>{isEditing ? 'Edit Project Details' : 'Add New Project'}</h3>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="content-form">
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Project Title</label>
                            <input 
                                type="text" name="title" required
                                className="form-input"
                                value={formData.title} onChange={handleChange}
                                placeholder="e.g. The Silent Frame"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input 
                                type="text" name="category" required
                                className="form-input"
                                value={formData.category} onChange={handleChange}
                                placeholder="e.g. Film Making, Advertising"
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
                                type="url" name="imageUrl" required
                                className="form-input" style={{ flex: 1, margin: 0 }}
                                value={formData.imageUrl} onChange={handleChange}
                                placeholder="https://images.unsplash.com/photo-..."
                            />
                           
                            {formData.imageUrl && (
                                <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="btn-remove" style={{padding: '10px 15px'}}>Clear</button>
                            )}
                        </div>
                    </div>

                    {/* 🔥 NEW SHORT DESCRIPTION */}
                    <div className="form-group">
                        <label className="form-label">Short Description (For Card Preview)</label>
                        <textarea 
                            name="shortDescription" required
                            className="form-input form-textarea" style={{minHeight: '80px'}}
                            value={formData.shortDescription} onChange={handleChange}
                            placeholder="Briefly describe the project... (Max 150 characters)"
                            maxLength="150"
                        ></textarea>
                    </div>

                    {/* 🔥 NEW DETAILED DESCRIPTION */}
                    <div className="form-group">
                        <label className="form-label">Detailed Description (For Pop-up View)</label>
                        <textarea 
                            name="detailedDescription" required
                            className="form-input form-textarea" style={{minHeight: '150px'}}
                            value={formData.detailedDescription} onChange={handleChange}
                            placeholder="Full story about the project..."
                        ></textarea>
                    </div>

                    <div className="form-actions" style={{justifyContent: 'flex-start', gap: '15px'}}>
                        <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
                            <label className="form-label">Display Order</label>
                            <input 
                                type="number" name="order" min="0" required
                                className="form-input"
                                value={formData.order} onChange={handleChange}
                            />
                        </div>
                        <button type="submit" disabled={submitting} className="save-btn" style={{alignSelf: 'flex-end'}}>
                            {submitting ? 'PROCESSING...' : (isEditing ? 'UPDATE PROJECT' : 'PUBLISH PROJECT')}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleCancelEdit} className="btn-remove" style={{alignSelf: 'flex-end', padding: '16px 30px'}}>
                                CANCEL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ── PROJECTS GRID DISPLAY ── */}
            <div className="form-section" style={{marginTop: '40px'}}>
                <div className="section-header">
                    <h3>Live Portfolio Grid <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400', marginLeft: '10px' }}>({projects.length} Projects Total)</span></h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {projects.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No projects found. Add your first project above.</p>
                    ) : (
                        projects.map((proj) => (
                            <div key={proj._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#292e91', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                        Order: {proj.order}
                                    </div>
                                </div>
                                
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ color: '#b5862a', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>
                                        {proj.category}
                                    </div>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                                        {proj.title}
                                    </h4>
                                    <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
                                        {proj.shortDescription || proj.description}
                                    </p>
                                    
                                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                        <button onClick={() => handleEditClick(proj)} className="btn-add" style={{flex: 1, padding: '10px', marginTop: 0}}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteClick(proj._id)} className="btn-remove" style={{flex: 1, padding: '10px', marginTop: 0}}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

         {/* ========================================================================
    ── SECTION 3: CASE STUDIES (RE-DESIGNED) ──
======================================================================== */}
<div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 transition-all hover:shadow-md">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
        <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">📂</span>
                Case Studies & Headings
            </h3>
            <p className="text-gray-500 text-sm mt-1">Manage deep-dive articles and section titles.</p>
        </div>
        <button 
            type="button"
            onClick={() => addArrayItem('caseStudies', {title:'', desc:'', type:''})} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
            <span className="text-lg">+</span> Add Case Study
        </button>
    </div>

    {/* Section Titles Edit */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <div className="form-group">
            <label className="text-sm font-bold text-gray-700 mb-2 block uppercase tracking-wider">Main Title</label>
            <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                placeholder="Deep Dive into Our"
                value={pageData.caseStudiesTitleMain || ''} 
                onChange={e => setPageData({...pageData, caseStudiesTitleMain: e.target.value})} 
            />
        </div>
        <div className="form-group">
            <label className="text-sm font-bold text-gray-700 mb-2 block uppercase tracking-wider">Highlight Title (Gold)</label>
            <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white font-serif italic text-amber-600"
                placeholder="Best Work"
                value={pageData.caseStudiesTitleHighlight || ''} 
                onChange={e => setPageData({...pageData, caseStudiesTitleHighlight: e.target.value})} 
            />
        </div>
    </div>

    {/* Case Studies Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(pageData.caseStudies || []).map((cs, i) => (
            <div key={i} className="group relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-gray-100">
                <button 
                    type="button" 
                    onClick={() => removeArrayItem('caseStudies', i)} 
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10"
                >
                    ×
                </button>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Project Title</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-100 focus:bg-indigo-50/30 transition-colors font-bold text-gray-700" 
                            placeholder="e.g. The Brand Revolution" 
                            value={cs.title || ''} 
                            onChange={e => handleArrayChange('caseStudies', i, 'title', e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Description</label>
                        <textarea 
                            className="w-full px-3 py-2 rounded-lg border border-gray-100 focus:bg-indigo-50/30 transition-colors text-sm text-gray-600 min-h-[100px]" 
                            placeholder="Describe the case study details..." 
                            value={cs.desc || ''} 
                            onChange={e => handleArrayChange('caseStudies', i, 'desc', e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Campaign Category</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-100 focus:bg-indigo-50/30 transition-colors text-xs font-semibold text-indigo-600" 
                            placeholder="e.g. Advertising" 
                            value={cs.type || ''} 
                            onChange={e => handleArrayChange('caseStudies', i, 'type', e.target.value)} 
                        />
                    </div>
                </div>
            </div>
        ))}
        {pageData.caseStudies?.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                No case studies added yet. Click the button above to start.
            </div>
        )}
    </div>
</div>

{/* ========================================================================
    ── SECTION 4: IMPACT COUNTERS (RE-DESIGNED) ──
======================================================================== */}
<div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 transition-all hover:shadow-md">
    <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">📊</span>
            Impact Counters
        </h3>
        <button 
            type="button"
            onClick={() => addArrayItem('stats', {number:'', label1:'', label2:''})} 
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-bold px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-all"
        >
            + Add Metric
        </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(pageData.stats || []).map((s, i) => (
            <div key={i} className="relative p-6 bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl shadow-sm text-center group">
                <button 
                    type="button" 
                    onClick={() => removeArrayItem('stats', i)} 
                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>

                <div className="space-y-3 pt-2">
                    <input 
                        type="text" 
                        className="w-full bg-transparent text-center text-3xl font-black text-amber-600 placeholder-gray-300 focus:outline-none" 
                        placeholder="500M+" 
                        value={s.number || ''} 
                        onChange={e => handleArrayChange('stats', i, 'number', e.target.value)} 
                    />
                    <div className="space-y-1">
                        <input 
                            type="text" 
                            className="w-full bg-transparent text-center text-[10px] font-black uppercase tracking-tighter text-gray-800 focus:outline-none border-b border-transparent focus:border-amber-200" 
                            placeholder="PRIMARY LABEL" 
                            value={s.label1 || ''} 
                            onChange={e => handleArrayChange('stats', i, 'label1', e.target.value)} 
                        />
                        <input 
                            type="text" 
                            className="w-full bg-transparent text-center text-[10px] font-medium text-gray-400 focus:outline-none border-b border-transparent focus:border-amber-200" 
                            placeholder="secondary label" 
                            value={s.label2 || ''} 
                            onChange={e => handleArrayChange('stats', i, 'label2', e.target.value)} 
                        />
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

{/* ========================================================================
    ── SECTION 5: CTA SETTINGS (RE-DESIGNED) ──
======================================================================== */}
<div className="form-section bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl shadow-xl p-8 mb-20 text-white border border-gray-800">
    <div className="flex items-center gap-3 mb-8">
        <span className="p-2 bg-white/10 text-amber-400 rounded-lg">🚀</span>
        <h3 className="text-2xl font-bold">Ready to Start (CTA) Section</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="form-group">
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-widest">Main CTA Title</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 transition-all outline-none text-lg text-white"
                    placeholder="Ready to Bring Your"
                    value={pageData.ctaTitleMain || ''} 
                    onChange={e => setPageData({...pageData, ctaTitleMain: e.target.value})} 
                />
            </div>
            <div className="form-group">
                <label className="text-xs font-bold text-amber-400/60 mb-2 block uppercase tracking-widest">Highlight Title (Gold)</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 focus:bg-amber-500/10 transition-all outline-none text-lg text-amber-400 font-serif italic"
                    placeholder="Vision to Life?"
                    value={pageData.ctaTitleHighlight || ''} 
                    onChange={e => setPageData({...pageData, ctaTitleHighlight: e.target.value})} 
                />
            </div>
        </div>
        <div className="form-group">
            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-widest">CTA Description</label>
            <textarea 
                className="w-full h-full min-h-[160px] px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 transition-all outline-none text-gray-300 text-sm leading-relaxed"
                placeholder="Let's discuss your next project..."
                value={pageData.ctaDesc || ''} 
                onChange={e => setPageData({...pageData, ctaDesc: e.target.value})} 
            />
        </div>
    </div>
</div>

{/* ========================================================================
    ── STICKY MASTER SAVE BAR (RE-DESIGNED) ──
======================================================================== */}
<div className="mt-8 sticky bottom-4 z-50">
                <button onClick={handlePageDataSave} className="w-full bg-[#1a1a1a] text-white p-5 rounded-lg text-xl font-bold uppercase tracking-widest shadow-2xl hover:bg-[#b5862a] transition-all duration-300">
                    {submitting ? 'SAVING...' : '💾 SAVE PAGE SETTINGS'}
                </button>
            </div>
        </div>
            
        
    );
};

export default ManageProjects;