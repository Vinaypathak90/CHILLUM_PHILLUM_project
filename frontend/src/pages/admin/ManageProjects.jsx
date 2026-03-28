import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageContent.css'; // Consistent admin styles
import './ManageProjects.css'; 

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form and Status states
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingInfo, setUploadingInfo] = useState('');

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
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

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
            const uploadRes = await axios.post('http://localhost:5000/api/upload', fd, {
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
                await axios.put(`http://localhost:5000/api/projects/${currentId}`, formData);
                setMessage({ text: 'Project successfully updated! 🎬', type: 'success' });
            } else {
                // Create new project
                await axios.post('http://localhost:5000/api/projects', formData);
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
                await axios.delete(`http://localhost:5000/api/projects/${id}`);
                setMessage({ text: 'Project deleted.', type: 'success' });
                fetchProjects();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (err) {
                alert('Failed to delete project.');
            }
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

        </div>
    );
};

export default ManageProjects;