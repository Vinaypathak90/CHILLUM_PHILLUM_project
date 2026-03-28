import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageContent.css'; // Standard admin CSS
import './ManageProjects.css'; 

const ManageTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form and Status states
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingInfo, setUploadingInfo] = useState(''); // File upload status

    // Initial Form State matching Team.js Model
    const initialFormState = {
        name: '',
        role: '',
        photoUrl: '',
        bio: '', // 🔥 BIO INCLUDED
        order: 0
    };
    const [formData, setFormData] = useState(initialFormState);

    // Fetch all team members on mount
    const fetchTeam = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/team');
            setTeam(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    // Handle Form Input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🚀 NEW: Handle Image Upload (Cloudinary)
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
            setFormData(prev => ({ ...prev, photoUrl: uploadRes.data.imageUrl }));
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
                // Update existing member
                await axios.put(`http://localhost:5000/api/team/${currentId}`, formData);
                setMessage({ text: 'Team member updated successfully! 👥', type: 'success' });
            } else {
                // Create new member
                await axios.post('http://localhost:5000/api/team', formData);
                setMessage({ text: 'New team member added! 🎉', type: 'success' });
            }
            
            // Reset form and refresh list
            setFormData(initialFormState);
            setIsEditing(false);
            setCurrentId(null);
            fetchTeam();
            
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Operation failed!', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // Load data into form for editing
    const handleEditClick = (member) => {
        setFormData({
            name: member.name,
            role: member.role,
            photoUrl: member.photoUrl,
            bio: member.bio || '', // Load bio
            order: member.order || 0
        });
        setCurrentId(member._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setCurrentId(null);
    };

    // Delete a member
    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            try {
                await axios.delete(`http://localhost:5000/api/team/${id}`);
                setMessage({ text: 'Team member removed.', type: 'success' });
                fetchTeam();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (err) {
                alert('Failed to delete team member.');
            }
        }
    };

    if (loading) return <div className="loading-text" style={{padding: '20px', fontWeight: 'bold', color: '#6b7280'}}>Loading Team Data...</div>;

    return (
        <div className="manage-content-wrapper">
            
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

            {/* ── TEAM MEMBER FORM ── */}
            <div className="form-section">
                <div className="section-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {isEditing 
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                }
                            </svg>
                        </div>
                        <h3>{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</h3>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="content-form">
                    
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required placeholder="e.g. John Doe" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Designation / Role</label>
                            <input type="text" name="role" className="form-input" value={formData.role} onChange={handleChange} required placeholder="e.g. Director" />
                        </div>
                    </div>

                    {/* 🔥 IMAGE UPLOAD UI (Preview + Text Box + File Upload) */}
                    <div className="form-group">
                        <label className="form-label">Profile Photo (URL or Upload)</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                            {formData.photoUrl && (
                                <img src={formData.photoUrl} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                            )}
                            <input 
                                type="text" name="photoUrl" className="form-input" 
                                value={formData.photoUrl} onChange={handleChange} 
                                placeholder="Image URL or Upload 👉" required style={{ flex: 1, margin: 0 }}
                            />
                           
                            {formData.photoUrl && (
                                <button type="button" onClick={() => setFormData({...formData, photoUrl: ''})} className="btn-remove" style={{padding: '10px 15px'}}>Clear</button>
                            )}
                        </div>
                    </div>

                    {/* 🔥 BIO TEXTAREA ADDED HERE */}
                    <div className="form-group">
                        <label className="form-label">Member Bio (For Details Popup)</label>
                        <textarea 
                            name="bio" 
                            className="form-input form-textarea" 
                            value={formData.bio} 
                            onChange={handleChange} 
                            placeholder="Enter a short bio or description about this team member..." 
                        ></textarea>
                    </div>

                    <div className="form-group" style={{maxWidth: '200px'}}>
                        <label className="form-label">Display Order (e.g. 1, 2, 3)</label>
                        <input type="number" name="order" className="form-input" value={formData.order} onChange={handleChange} />
                    </div>

                    <div className="form-actions" style={{justifyContent: 'flex-start', gap: '15px'}}>
                        <button type="submit" disabled={submitting} className="save-btn">
                            {submitting ? 'SAVING...' : (isEditing ? 'UPDATE MEMBER' : 'ADD MEMBER')}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleCancelEdit} className="btn-remove" style={{padding: '16px 30px'}}>
                                CANCEL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ── EXISTING TEAM LIST ── */}
            <div className="form-section" style={{marginTop: '40px'}}>
                <div className="section-header">
                    <h3>Current Team Members ({team.length})</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {team.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No team members found. Add someone to your crew above.</p>
                    ) : (
                        team.map((member) => (
                            <div key={member._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={member.photoUrl} alt={member.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#292e91', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                        #{member.order}
                                    </div>
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{member.name}</h4>
                                    <div style={{ margin: '0 0 10px 0', color: '#b5862a', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{member.role}</div>
                                    
                                    {/* BIO PREVIEW */}
                                    <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '13px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {member.bio || 'No bio provided.'}
                                    </p>
                                    
                                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                        <button onClick={() => handleEditClick(member)} className="btn-add" style={{flex: 1, padding: '10px', marginTop: 0}}>Edit</button>
                                        <button onClick={() => handleDeleteClick(member._id)} className="btn-remove" style={{flex: 1, padding: '10px', marginTop: 0}}>Delete</button>
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

export default ManageTeam;