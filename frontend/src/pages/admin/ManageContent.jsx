import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageContent.css';
import config from "../../config";
const ManageContent = () => {
    // State matching full schema
    const [content, setContent] = useState({
        nav: { logoText: '', logoImage: '' },
        hero: { backgroundImages: [''], eyebrow: '', titleMain: '', titleHighlight: '', subtitle: '' },
        about: { label: '', titleMain: '', titleHighlight: '', titleEnd: '', paragraphs: [''], images: ['', '', ''] },
        studio: { label: '', titleMain: '', titleHighlight: '', titleEnd: '', cards: [{image: '', label: ''}, {image: '', label: ''}, {image: '', label: ''}, {image: '', label: ''}] },
        contact: { email: '', phone: '', location: '' },
        footer: { 
            copyrightText: '', 
            socials: { instagram: '', x: '', facebook: '' } 
        }
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [uploadingInfo, setUploadingInfo] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/page-content`);
                if (res.data.data && Object.keys(res.data.data).length > 0) {
                    setContent(prev => ({
                        ...prev,
                        ...res.data.data,
                        nav: { ...prev.nav, ...res.data.data.nav },
                        hero: { ...prev.hero, ...res.data.data.hero },
                        about: { ...prev.about, ...res.data.data.about },
                        studio: { ...prev.studio, ...res.data.data.studio },
                        contact: { ...prev.contact, ...res.data.data.contact },
                        footer: {
                            ...prev.footer,
                            ...(res.data.data.footer || {}),
                            socials: {
                                ...prev.footer.socials,
                                ...(res.data.data.footer?.socials || {})
                            }
                        }
                    }));
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching content:", err);
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleChange = (section, field, value) => {
        setContent(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    };

    const handleArrayStringChange = (section, field, index, value) => {
        setContent(prev => {
            const newArr = [...(prev[section][field] || [])];
            newArr[index] = value;
            return { ...prev, [section]: { ...prev[section], [field]: newArr } };
        });
    };

    const addArrayItem = (section, field) => {
        setContent(prev => ({ ...prev, [section]: { ...prev[section], [field]: [...(prev[section][field] || []), ''] } }));
    };

    const removeArrayItem = (section, field, index) => {
        setContent(prev => {
            const newArr = [...prev[section][field]];
            newArr.splice(index, 1);
            return { ...prev, [section]: { ...prev[section], [field]: newArr } };
        });
    };

    const handleStudioCardChange = (index, field, value) => {
        setContent(prev => {
            const newCards = [...(prev.studio.cards || [])];
            newCards[index] = { ...newCards[index], [field]: value };
            return { ...prev, studio: { ...prev.studio, cards: newCards } };
        });
    };

    const handleImageUpload = async (e, section, field, index = null, subField = null) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingInfo('Uploading Image... Please wait ⏳');
        const formData = new FormData();
        formData.append('image', file); 

        try {
            const uploadRes = await axios.post(`${config.API_BASE_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const newImageUrl = uploadRes.data.imageUrl; 

            if (index !== null && subField !== null) {
                handleStudioCardChange(index, subField, newImageUrl); 
            } else if (index !== null) {
                handleArrayStringChange(section, field, index, newImageUrl); 
            } else {
                handleChange(section, field, newImageUrl); 
            }
            
            setUploadingInfo('Image uploaded successfully! ✅');
            setTimeout(() => setUploadingInfo(''), 3000);
            e.target.value = null; 
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadingInfo('❌ Upload failed! Check your backend /api/upload route.');
            setTimeout(() => setUploadingInfo(''), 5000);
        }
    };

    const handleRemoveImage = (section, field, index = null, subField = null) => {
        if (index !== null && subField !== null) {
            handleStudioCardChange(index, subField, '');
        } else if (index !== null) {
            handleArrayStringChange(section, field, index, '');
        } else {
            handleChange(section, field, '');
        }
    };
    const handleSocialChange = (platform, value) => {
        let finalValue = value.trim();
        
        // 🔥 AUTO-FIX: Add https:// if URL doesn't have protocol
        if (finalValue && !finalValue.match(/^https?:\/\//)) {
            finalValue = 'https://' + finalValue;
        }
        
        setContent(prev => {
            // 🔥 FIX: Safe data extraction taaki code crash na ho
            const safeFooter = prev.footer || {};
            const safeSocials = safeFooter.socials || {};

            return {
                ...prev,
                footer: {
                    ...safeFooter,
                    socials: {
                        ...safeSocials,
                        [platform]: finalValue
                    }
                }
            };
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        
        try {
            await axios.post(`${config.API_BASE_URL}/page-content`, content);
            setMessage('Website Content Updated Successfully! 🔥 Refresh your main site to see changes.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setMessage(''), 5000); 
        } catch (err) {
            alert('Error saving content. Check console.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-text" style={{padding: '20px', fontWeight: 'bold', color: '#6b7280'}}>Loading Content Editor...</div>;

    return (
        <div className="manage-content-wrapper">
            
            {message && (
                <div className="alert-success" style={{ marginBottom: '20px' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {message}
                </div>
            )}

            {uploadingInfo && (
                <div className="alert-success" style={{ marginBottom: '20px', backgroundColor: '#eff2fe', color: '#292e91', border: '1px solid #c7d2fe' }}>
                    {uploadingInfo}
                </div>
            )}

            <form onSubmit={handleSave} className="content-form">
                
                {/* ── LOGO & NAVIGATION ── */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" /></svg>
                        </div>
                        <h3>Logo & Navigation</h3>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Logo Text</label>
                        <input type="text" className="form-input" value={content.nav?.logoText || ''} onChange={(e) => handleChange('nav', 'logoText', e.target.value)} placeholder="e.g. CHILLUM PHILLUM" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Logo Image (URL or Upload)</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                            {content.nav?.logoImage && <img src={content.nav.logoImage} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#292e91' }} />}
                            <input type="text" className="form-input" value={content.nav?.logoImage || ''} onChange={(e) => handleChange('nav', 'logoImage', e.target.value)} placeholder="Image URL or Upload 👉" style={{ flex: 1, margin: 0 }} />
                            {content.nav?.logoImage && <button type="button" onClick={() => handleRemoveImage('nav', 'logoImage')} className="btn-remove">Clear</button>}
                        </div>
                    </div>
                </div>

                {/* ── HERO SECTION ── */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h3>Hero Section</h3>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hero Background Images (Moving Carousel)</label>
                        {content.hero?.backgroundImages?.map((img, index) => (
                            <div key={`hero-img-${index}`} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                                {img && <img src={img} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />}
                                <input type="text" className="form-input" value={img || ''} onChange={(e) => handleArrayStringChange('hero', 'backgroundImages', index, e.target.value)} placeholder="Image URL or Upload 👉" style={{ flex: 1, margin: 0 }} />
                                <button type="button" className="btn-remove" style={{padding: '10px 15px'}} onClick={() => removeArrayItem('hero', 'backgroundImages', index)} title="Delete Slot">🗑️</button>
                            </div>
                        ))}
                        <button type="button" className="btn-add" onClick={() => addArrayItem('hero', 'backgroundImages')}>+ Add Another Background Slot</button>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label">Eyebrow Text (Top Small Text)</label>
                        <input type="text" className="form-input" value={content.hero?.eyebrow || ''} onChange={(e) => handleChange('hero', 'eyebrow', e.target.value)} placeholder="e.g. Est. · Creative Production Studio" />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Main Title</label>
                            <input type="text" className="form-input" value={content.hero?.titleMain || ''} onChange={(e) => handleChange('hero', 'titleMain', e.target.value)} placeholder="e.g. WHERE IT IS" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Highlighted Title</label>
                            <input type="text" className="form-input" value={content.hero?.titleHighlight || ''} onChange={(e) => handleChange('hero', 'titleHighlight', e.target.value)} placeholder="e.g. Always Buzzing" />
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label">Subtitle</label>
                        <input type="text" className="form-input" value={content.hero?.subtitle || ''} onChange={(e) => handleChange('hero', 'subtitle', e.target.value)} placeholder="e.g. Film · Production · Advertising" />
                    </div>
                </div>

                {/* ── ABOUT SECTION EDIT ── */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3>About Us Details</h3>
                    </div>

                    {/* 🔥 FIX: Added Label and Title End for About */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Section Label (e.g. ABOUT)</label>
                            <input type="text" className="form-input" value={content.about?.label || ''} onChange={(e) => handleChange('about', 'label', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">About Main Title (Part 1)</label>
                            <input type="text" className="form-input" value={content.about?.titleMain || ''} onChange={(e) => handleChange('about', 'titleMain', e.target.value)} placeholder="e.g. A Creative Studio Where" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">About Highlight Title (Gold Text)</label>
                            <input type="text" className="form-input" value={content.about?.titleHighlight || ''} onChange={(e) => handleChange('about', 'titleHighlight', e.target.value)} placeholder="e.g. Bold Ideas" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">About Title End (Part 3)</label>
                            <input type="text" className="form-input" value={content.about?.titleEnd || ''} onChange={(e) => handleChange('about', 'titleEnd', e.target.value)} placeholder="e.g. Come to Life" />
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label">About Paragraphs</label>
                        {content.about?.paragraphs?.map((p, index) => (
                            <div className="array-item-row" key={`about-p-${index}`}>
                                <textarea className="form-input form-textarea" value={p} onChange={(e) => handleArrayStringChange('about', 'paragraphs', index, e.target.value)} placeholder="Enter paragraph text..." required></textarea>
                                <button type="button" className="btn-remove" onClick={() => removeArrayItem('about', 'paragraphs', index)}>X</button>
                            </div>
                        ))}
                        <button type="button" className="btn-add" onClick={() => addArrayItem('about', 'paragraphs')}>+ Add New Paragraph</button>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label">About Images (Exact 3 URLs needed for Grid Layout)</label>
                        {[0, 1, 2].map((index) => (
                            <div key={`about-img-${index}`} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                                {content.about?.images?.[index] && <img src={content.about.images[index]} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />}
                                <input type="text" className="form-input" value={content.about?.images?.[index] || ''} onChange={(e) => handleArrayStringChange('about', 'images', index, e.target.value)} placeholder={`Image URL ${index + 1}`} style={{ flex: 1, margin: 0 }} />
                                {content.about?.images?.[index] && <button type="button" onClick={() => handleRemoveImage('about', 'images', index)} className="btn-remove" style={{padding: '10px 15px'}}>Clear</button>}
                            </div>
                        ))}
                    </div>
                </div>
<div className="form-group mt-4">
    <label className="form-label" style={{display: 'block', marginBottom: '10px'}}>About Stats Counters (3 Items)</label>
    <div className="form-grid-2">
        {[0, 1, 2].map((index) => (
            <div className="studio-card-edit" key={`stat-${index}`}>
                <div className="form-group">
                    <label className="form-label">Stat {index + 1} Number (e.g. 50+)</label>
                    <input type="text" className="form-input" 
                        value={content.about?.stats?.[index]?.number || ''} 
                        onChange={(e) => {
                            const newStats = [...(content.about?.stats || [{number:'',label:''}, {number:'',label:''}, {number:'',label:''}])];
                            newStats[index] = { ...newStats[index], number: e.target.value };
                            handleChange('about', 'stats', newStats);
                        }} 
                        placeholder="e.g. 50+" 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Stat {index + 1} Label (e.g. PROJECTS)</label>
                    <input type="text" className="form-input" 
                        value={content.about?.stats?.[index]?.label || ''} 
                        onChange={(e) => {
                            const newStats = [...(content.about?.stats || [{number:'',label:''}, {number:'',label:''}, {number:'',label:''}])];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            handleChange('about', 'stats', newStats);
                        }} 
                        placeholder="e.g. PROJECTS" 
                    />
                </div>
            </div>
        ))}
    </div>
</div>
                {/* ── STUDIO SECTION (WHAT WE DO) ── */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3>Studio (What We Do)</h3>
                    </div>
                    
                    {/* 🔥 FIX: Added Label and Title End for Studio */}
                    <div className="form-grid-2 mb-4">
                        <div className="form-group">
                            <label className="form-label">Section Label (e.g. WHAT WE DO)</label>
                            <input type="text" className="form-input" value={content.studio?.label || ''} onChange={(e) => handleChange('studio', 'label', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Main Title (Part 1)</label>
                            <input type="text" className="form-input" value={content.studio?.titleMain || ''} onChange={(e) => handleChange('studio', 'titleMain', e.target.value)} placeholder="e.g. The" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Highlight Title (Gold Text)</label>
                            <input type="text" className="form-input" value={content.studio?.titleHighlight || ''} onChange={(e) => handleChange('studio', 'titleHighlight', e.target.value)} placeholder="e.g. Chillum Phillum" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Title End (Part 3)</label>
                            <input type="text" className="form-input" value={content.studio?.titleEnd || ''} onChange={(e) => handleChange('studio', 'titleEnd', e.target.value)} placeholder="e.g. Way" />
                        </div>
                    </div>

                    <label className="form-label" style={{display: 'block', marginBottom: '10px'}}>Studio Service Cards (4 Cards Required)</label>
                    <div className="form-grid-2">
                        {[0, 1, 2, 3].map((index) => (
                            <div className="studio-card-edit" key={`studio-card-${index}`}>
                                <div className="form-group">
                                    <label className="form-label">Card {index + 1} Label</label>
                                    <input type="text" className="form-input" value={content.studio?.cards?.[index]?.label || ''} onChange={(e) => handleStudioCardChange(index, 'label', e.target.value)} placeholder="e.g. Photography" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Card {index + 1} Background Image</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#fff', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                        {content.studio?.cards?.[index]?.image && <img src={content.studio.cards[index].image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <input type="text" className="form-input" value={content.studio?.cards?.[index]?.image || ''} onChange={(e) => handleStudioCardChange(index, 'image', e.target.value)} placeholder="URL or Upload 👇" style={{ padding: '6px' }} />
                                           </div>
                                    </div>
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Card {index + 1} Popup Description</label>
                <textarea 
                    className="form-input form-textarea" 
                    style={{ minHeight: '80px' }}
                    value={content.studio?.cards?.[index]?.description || ''} 
                    onChange={(e) => handleStudioCardChange(index, 'description', e.target.value)} 
                    placeholder={`Enter description for ${content.studio?.cards?.[index]?.label || 'this service'} popup...`} 
                ></textarea>
            </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CONTACT DETAILS EDIT ── */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3>Contact Information</h3>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Public Email Address</label>
                            <input type="email" className="form-input" value={content.contact?.email || ''} onChange={(e) => handleChange('contact', 'email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-input" value={content.contact?.phone || ''} onChange={(e) => handleChange('contact', 'phone', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group mt-4">
                        <label className="form-label">Location / Address</label>
                        <input type="text" className="form-input" value={content.contact?.location || ''} onChange={(e) => handleChange('contact', 'location', e.target.value)} />
                    </div>
                </div>
{/* 🔥 NAYA: FOOTER & SOCIAL MEDIA SECTION ── */}
                <div className="form-section" style={{ backgroundColor: '#fdfbf7', border: '1px solid #e2e8f0' }}>
                    <div className="section-header">
                        <div className="section-icon" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        </div>
                        <h3>Footer & Social Media</h3>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Copyright Text</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={content.footer?.copyrightText || ''} 
                            onChange={(e) => handleChange('footer', 'copyrightText', e.target.value)} 
                            placeholder="e.g. © 2026 Chillum Phillum. All rights reserved." 
                        />
                    </div>
                    
                    <label className="form-label" style={{display: 'block', marginTop: '20px', marginBottom: '10px'}}>Social Media Links</label>
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">📸 Instagram URL</label>
                            <input 
                                type="url" 
                                className="form-input" 
                                placeholder="https://instagram.com/..."
                                value={content.footer?.socials?.instagram || ''} 
                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">🐦 X (Twitter) URL</label>
                            <input 
                                type="url" 
                                className="form-input" 
                                placeholder="https://x.com/..."
                                value={content.footer?.socials?.x || ''} 
                                onChange={(e) => handleSocialChange('x', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">📘 Facebook URL</label>
                            <input 
                                type="url" 
                                className="form-input" 
                                placeholder="https://facebook.com/..."
                                value={content.footer?.socials?.facebook || ''} 
                                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {/* ── SAVE BUTTON ── */}
                <div className="form-actions">
                    <button type="submit" disabled={saving} className="save-btn">
                        {saving ? (
                            <>
                                <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24" style={{marginRight: '10px'}}>
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                SAVING CHANGES...
                            </>
                        ) : (
                            'UPDATE WEBSITE CONTENT'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageContent;