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
        contactPage: {
            mapEmbedCode: '',
            mapHeight: '600px',
            locations: [],
            faqs: [],
            services: []
        },
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
                        contactPage: {
                            ...prev.contactPage,
                            ...(res.data.data.contactPage || {})
                        },
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

    const addArrayItem = (section, field, template = '') => {
        setContent(prev => ({ ...prev, [section]: { ...prev[section], [field]: [...(prev[section][field] || []), template] } }));
    };

    const removeArrayItem = (section, field, index) => {
        setContent(prev => {
            const newArr = [...prev[section][field]];
            newArr.splice(index, 1);
            return { ...prev, [section]: { ...prev[section], [field]: newArr } };
        });
    };

    // 🔥 CONTACTPAGE HANDLERS - For nested contactPage arrays (locations, faqs, services)
    const handleContactPageChange = (field, value) => {
        setContent(prev => ({
            ...prev,
            contactPage: {
                ...prev.contactPage,
                [field]: value
            }
        }));
    };

    const handleArrayChange = (arrayName, index, field, value) => {
        setContent(prev => {
            const newArray = [...(prev.contactPage[arrayName] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return {
                ...prev,
                contactPage: {
                    ...prev.contactPage,
                    [arrayName]: newArray
                }
            };
        });
    };

    const addContactPageArrayItem = (arrayName, template) => {
        setContent(prev => ({
            ...prev,
            contactPage: {
                ...prev.contactPage,
                [arrayName]: [...(prev.contactPage[arrayName] || []), template]
            }
        }));
    };

    const removeContactPageArrayItem = (arrayName, index) => {
        setContent(prev => {
            const newArray = [...(prev.contactPage[arrayName] || [])];
            newArray.splice(index, 1);
            return {
                ...prev,
                contactPage: {
                    ...prev.contactPage,
                    [arrayName]: newArray
                }
            };
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
        if (e && e.preventDefault) e.preventDefault();
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
{/* ── OUR JOURNEY EDIT ── */}
<div className="form-section mt-6">
    <div className="section-header">
        <div className="section-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3>Our Journey Section</h3>
    </div>
    
    <div className="form-grid-2">
        <div className="form-group">
            <label className="form-label">Section Label</label>
            <input type="text" className="form-input" value={content.about?.journeyLabel || ''} onChange={(e) => handleChange('about', 'journeyLabel', e.target.value)} placeholder="e.g. Our Journey" />
        </div>
        <div className="form-group">
            <label className="form-label">Main Title</label>
            <input type="text" className="form-input" value={content.about?.journeyTitleMain || ''} onChange={(e) => handleChange('about', 'journeyTitleMain', e.target.value)} placeholder="e.g. From Humble Beginnings to" />
        </div>
        <div className="form-group">
            <label className="form-label">Highlight Title</label>
            <input type="text" className="form-input" value={content.about?.journeyTitleHighlight || ''} onChange={(e) => handleChange('about', 'journeyTitleHighlight', e.target.value)} placeholder="e.g. Industry Leaders" />
        </div>
    </div>

    <label className="form-label mt-4" style={{display: 'block', marginBottom: '10px'}}>Journey Timeline (4 Items)</label>
    <div className="grid grid-cols-1 gap-4">
        {[0, 1, 2, 3].map((index) => (
            <div key={`journey-${index}`} className="studio-card-edit" style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '15px', alignItems: 'start' }}>
                <div className="form-group mb-0">
                    <label className="form-label">Year</label>
                    <input type="text" className="form-input" 
                        value={content.about?.journey?.[index]?.year || ''} 
                        onChange={(e) => {
                            const newJourney = [...(content.about?.journey || [{year:'',title:'',desc:''}, {year:'',title:'',desc:''}, {year:'',title:'',desc:''}, {year:'',title:'',desc:''}])];
                            newJourney[index] = { ...newJourney[index], year: e.target.value };
                            handleChange('about', 'journey', newJourney);
                        }} 
                        placeholder="e.g. 2019" 
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="form-group mb-0">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-input" 
                            value={content.about?.journey?.[index]?.title || ''} 
                            onChange={(e) => {
                                const newJourney = [...(content.about?.journey || [{year:'',title:'',desc:''}, {year:'',title:'',desc:''}, {year:'',title:'',desc:''}, {year:'',title:'',desc:''}])];
                                newJourney[index] = { ...newJourney[index], title: e.target.value };
                                handleChange('about', 'journey', newJourney);
                            }} 
                            placeholder="e.g. Studio Founded" 
                        />
                    </div>
                    <div className="form-group mb-0">
                        <label className="form-label">Description</label>
                        <textarea className="form-input form-textarea" style={{minHeight: '60px'}}
                            value={content.about?.journey?.[index]?.desc || ''} 
                            onChange={(e) => {
                                const newJourney = [...(content.about?.journey || [{year:'',title:'',desc:''}, {year:'',title:'',desc:''}, {year:'',title:'',desc:''}, {year:'',title:'',desc:''}])];
                                newJourney[index] = { ...newJourney[index], desc: e.target.value };
                                handleChange('about', 'journey', newJourney);
                            }} 
                            placeholder="Brief description..." 
                        />
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

{/* ── IMPACT SECTION EDIT ── */}
<div className="form-section mt-6">
    <div className="section-header">
        <div className="section-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <h3>Our Impact Section</h3>
    </div>
    
    <div className="form-grid-2">
        <div className="form-group">
            <label className="form-label">Section Label</label>
            <input type="text" className="form-input" value={content.about?.impactLabel || ''} onChange={(e) => handleChange('about', 'impactLabel', e.target.value)} placeholder="e.g. Our Impact" />
        </div>
        <div className="form-group">
            <label className="form-label">Main Title</label>
            <input type="text" className="form-input" value={content.about?.impactTitleMain || ''} onChange={(e) => handleChange('about', 'impactTitleMain', e.target.value)} placeholder="e.g. Creating" />
        </div>
        <div className="form-group">
            <label className="form-label">Highlight Title</label>
            <input type="text" className="form-input" value={content.about?.impactTitleHighlight || ''} onChange={(e) => handleChange('about', 'impactTitleHighlight', e.target.value)} placeholder="e.g. Meaningful Work" />
        </div>
        <div className="form-group">
            <label className="form-label">Title End</label>
            <input type="text" className="form-input" value={content.about?.impactTitleEnd || ''} onChange={(e) => handleChange('about', 'impactTitleEnd', e.target.value)} placeholder="e.g. Every Day" />
        </div>
    </div>
    
    <div className="form-group mt-4">
        <label className="form-label">Impact Description</label>
        <textarea className="form-input form-textarea" value={content.about?.impactDescription || ''} onChange={(e) => handleChange('about', 'impactDescription', e.target.value)} placeholder="Paragraph text..." />
    </div>

    <label className="form-label mt-4" style={{display: 'block', marginBottom: '10px'}}>Impact Big Stats (3 Items)</label>
    <div className="form-grid-2">
        {[0, 1, 2].map((index) => (
            <div key={`impact-stat-${index}`} className="studio-card-edit">
                <div className="form-group">
                    <label className="form-label">Big Number</label>
                    <input type="text" className="form-input" 
                        value={content.about?.impactStats?.[index]?.number || ''} 
                        onChange={(e) => {
                            const newImpactStats = [...(content.about?.impactStats || [{number:'',label:''}, {number:'',label:''}, {number:'',label:''}])];
                            newImpactStats[index] = { ...newImpactStats[index], number: e.target.value };
                            handleChange('about', 'impactStats', newImpactStats);
                        }} 
                        placeholder="e.g. 500M+" 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Label</label>
                    <input type="text" className="form-input" 
                        value={content.about?.impactStats?.[index]?.label || ''} 
                        onChange={(e) => {
                            const newImpactStats = [...(content.about?.impactStats || [{number:'',label:''}, {number:'',label:''}, {number:'',label:''}])];
                            newImpactStats[index] = { ...newImpactStats[index], label: e.target.value };
                            handleChange('about', 'impactStats', newImpactStats);
                        }} 
                        placeholder="e.g. Total Views" 
                    />
                </div>
            </div>
        ))}
    </div>
</div>

                {/* ── STUDIO SECTION (WHAT WE DO) ── */}
                <div className="admin-section-container mt-12 p-6 bg-white rounded-lg shadow-md border-t-4 border-[#b5862a]">
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
                
                {/* =========================================
    STUDIO SECTION EDIT (FULLY DYNAMIC N-ITEMS)
========================================= */}

    <h2 className="text-2xl font-bold mb-6 text-[#1a1a1a]">Manage Studio Page</h2>

    

    {/* ── 2. CAPABILITIES ── */}
    <div className="form-group mb-8 p-4 border rounded bg-gray-50">
        <div className="flex justify-between items-center mb-4">
            <label className="form-label text-lg font-bold mb-0">Capabilities (Glassmorphism Cards)</label>
            <button 
                type="button"
                onClick={() => {
                    const newCaps = [...(content.studio?.capabilities || [])];
                    newCaps.push({ icon: '', title: '', image: '', items: [] });
                    handleChange('studio', 'capabilities', newCaps);
                }}
                className="bg-[#b5862a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#9a7020] transition"
            >
                + Add New Capability
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(content.studio?.capabilities || []).map((cap, index) => (
                <div key={`cap-${index}`} className="p-3 border border-gray-200 bg-white rounded relative">
                    <button 
                        type="button"
                        onClick={() => {
                            const newCaps = [...content.studio.capabilities];
                            newCaps.splice(index, 1);
                            handleChange('studio', 'capabilities', newCaps);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        🗑️
                    </button>

                    <div className="flex gap-2 mb-2 w-[90%]">
                        <input type="text" className="form-input w-1/4" 
                            value={cap.icon || ''} 
                            onChange={(e) => {
                                const newCaps = [...content.studio.capabilities];
                                newCaps[index].icon = e.target.value;
                                handleChange('studio', 'capabilities', newCaps);
                            }} 
                            placeholder="Emoji (📹)" 
                        />
                        <input type="text" className="form-input w-3/4" 
                            value={cap.title || ''} 
                            onChange={(e) => {
                                const newCaps = [...content.studio.capabilities];
                                newCaps[index].title = e.target.value;
                                handleChange('studio', 'capabilities', newCaps);
                            }} 
                            placeholder="Title" 
                        />
                    </div>
                    <input type="text" className="form-input mb-2" 
                        value={cap.image || ''} 
                        onChange={(e) => {
                            const newCaps = [...content.studio.capabilities];
                            newCaps[index].image = e.target.value;
                            handleChange('studio', 'capabilities', newCaps);
                        }} 
                        placeholder="Background Image URL" 
                    />
                    <textarea className="form-input text-sm" rows="2"
                        value={(cap.items || []).join(', ')} 
                        onChange={(e) => {
                            const newCaps = [...content.studio.capabilities];
                            newCaps[index].items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                            handleChange('studio', 'capabilities', newCaps);
                        }} 
                        placeholder="Bullet points (Separate with commas)" 
                    />
                </div>
            ))}
            {!(content.studio?.capabilities?.length > 0) && <p className="text-gray-400 text-sm">No capabilities added yet.</p>}
        </div>
    </div>

    {/* ── 3. OUR PROCESS ── */}
    <div className="form-group mb-8 p-4 border rounded bg-gray-50">
        <div className="flex justify-between items-center mb-4">
            <label className="form-label text-lg font-bold mb-0">Our Process Steps</label>
            <button 
                type="button"
                onClick={() => {
                    const newProcess = [...(content.studio?.processSteps || [])];
                    newProcess.push({ step: '', title: '', desc: '' });
                    handleChange('studio', 'processSteps', newProcess);
                }}
                className="bg-[#b5862a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#9a7020] transition"
            >
                + Add Process Step
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(content.studio?.processSteps || []).map((step, index) => (
                <div key={`process-${index}`} className="p-3 border border-gray-200 bg-white rounded flex gap-3 relative">
                    <button 
                        type="button"
                        onClick={() => {
                            const newProcess = [...content.studio.processSteps];
                            newProcess.splice(index, 1);
                            handleChange('studio', 'processSteps', newProcess);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        🗑️
                    </button>

                    <input type="text" className="form-input w-16 text-center font-bold h-10" 
                        value={step.step || ''} 
                        onChange={(e) => {
                            const newProcess = [...content.studio.processSteps];
                            newProcess[index].step = e.target.value;
                            handleChange('studio', 'processSteps', newProcess);
                        }} 
                        placeholder="#" 
                    />
                    <div className="w-[85%]">
                        <input type="text" className="form-input mb-2" 
                            value={step.title || ''} 
                            onChange={(e) => {
                                const newProcess = [...content.studio.processSteps];
                                newProcess[index].title = e.target.value;
                                handleChange('studio', 'processSteps', newProcess);
                            }} 
                            placeholder="Step Title" 
                        />
                        <textarea className="form-input" rows="2"
                            value={step.desc || ''} 
                            onChange={(e) => {
                                const newProcess = [...content.studio.processSteps];
                                newProcess[index].desc = e.target.value;
                                handleChange('studio', 'processSteps', newProcess);
                            }} 
                            placeholder="Short description..." 
                        />
                    </div>
                </div>
            ))}
            {!(content.studio?.processSteps?.length > 0) && <p className="text-gray-400 text-sm">No steps added yet.</p>}
        </div>
    </div>

    {/* ── 4. TECHNOLOGY STACK ── */}
    <div className="form-group mb-8 p-4 border rounded bg-gray-50">
        <div className="flex justify-between items-center mb-4">
            <label className="form-label text-lg font-bold mb-0">Technology Stack</label>
            <button 
                type="button"
                onClick={() => {
                    const newTech = [...(content.studio?.techStack || [])];
                    newTech.push({ title: '', desc: '', image: '' });
                    handleChange('studio', 'techStack', newTech);
                }}
                className="bg-[#b5862a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#9a7020] transition"
            >
                + Add Tech Stack
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(content.studio?.techStack || []).map((tech, index) => (
                <div key={`tech-${index}`} className="p-3 border border-gray-200 bg-white rounded relative">
                    <button 
                        type="button"
                        onClick={() => {
                            const newTech = [...content.studio.techStack];
                            newTech.splice(index, 1);
                            handleChange('studio', 'techStack', newTech);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        🗑️
                    </button>

                    <input type="text" className="form-input mb-2 font-bold w-[85%]" 
                        value={tech.title || ''} 
                        onChange={(e) => {
                            const newTech = [...content.studio.techStack];
                            newTech[index].title = e.target.value;
                            handleChange('studio', 'techStack', newTech);
                        }} 
                        placeholder="Tool Name" 
                    />
                    <input type="text" className="form-input mb-2 text-sm" 
                        value={tech.desc || ''} 
                        onChange={(e) => {
                            const newTech = [...content.studio.techStack];
                            newTech[index].desc = e.target.value;
                            handleChange('studio', 'techStack', newTech);
                        }} 
                        placeholder="Short description" 
                    />
                    <input type="text" className="form-input text-sm" 
                        value={tech.image || ''} 
                        onChange={(e) => {
                            const newTech = [...content.studio.techStack];
                            newTech[index].image = e.target.value;
                            handleChange('studio', 'techStack', newTech);
                        }} 
                        placeholder="Image URL" 
                    />
                </div>
            ))}
            {!(content.studio?.techStack?.length > 0) && <p className="text-gray-400 text-sm">No tech stack added yet.</p>}
        </div>
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
                    {/* =========================================================================
                🔥 2. NEW FEATURES: PREMIUM UI (MAP, LOCATIONS, FAQS, SERVICES) 🔥
            ========================================================================= */}

            {/* ── DYNAMIC MAP EMBED ── */}
            <div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-10 transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">🗺️</span> Dynamic Map Setup
                    </h3>
                </div>
                <div className="mb-4">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Google Maps iFrame HTML</label>
                    <p className="text-xs text-gray-400 mb-3">Copy the "Embed a map" HTML from Google Maps and paste it below.</p>
                    <textarea 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 min-h-[120px] font-mono text-sm text-gray-600 bg-gray-50 transition-colors" 
                        value={content.contactPage?.mapEmbedCode || ''} 
                        onChange={(e) => handleContactPageChange('mapEmbedCode', e.target.value)}
                        placeholder='<iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                    ></textarea>
                </div>
                {content.contactPage?.mapEmbedCode && (
                    <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden h-[250px] [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 pointer-events-none opacity-80" 
                         dangerouslySetInnerHTML={{ __html: content.contactPage.mapEmbedCode }}>
                    </div>
                )}
            </div>

            {/* ── OFFICE LOCATIONS ── */}
            <div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-10 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">🏢</span> Office Locations
                    </h3>
                    <button type="button" onClick={() => addContactPageArrayItem('locations', {title:'', address:'', phone:'', hours:''})} className="flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95" style={{margin:0}}>
                        + Add Office
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(content.contactPage?.locations || []).map((loc, i) => (
                        <div key={i} className="relative p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:border-purple-200 transition-colors group">
                            <button type="button" onClick={() => removeContactPageArrayItem('locations', i)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10 font-bold">×</button>
                            <input className="w-full mb-3 px-4 py-2 text-sm rounded-lg border border-gray-200 focus:bg-white outline-none font-bold text-purple-700 transition-colors" placeholder="Location Name (e.g. 📍 Mumbai Studio)" value={loc.title || ''} onChange={e => handleArrayChange('locations', i, 'title', e.target.value)} />
                            <textarea className="w-full mb-3 px-4 py-3 text-sm rounded-lg border border-gray-200 focus:bg-white outline-none min-h-[80px] transition-colors" placeholder="Full Address" value={loc.address || ''} onChange={e => handleArrayChange('locations', i, 'address', e.target.value)}></textarea>
                            <input className="w-full mb-3 px-4 py-2 text-sm rounded-lg border border-gray-200 focus:bg-white outline-none transition-colors" placeholder="Phone Contact" value={loc.phone || ''} onChange={e => handleArrayChange('locations', i, 'phone', e.target.value)} />
                            <input className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:bg-white outline-none text-gray-500 transition-colors" placeholder="Operating Hours" value={loc.hours || ''} onChange={e => handleArrayChange('locations', i, 'hours', e.target.value)} />
                        </div>
                    ))}
                    {(!content.contactPage?.locations || content.contactPage.locations.length === 0) && <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">No office locations added yet.</div>}
                </div>
            </div>

            {/* ── FREQUENTLY ASKED QUESTIONS (FAQS) ── */}
            <div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-10 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">❓</span> FAQ Management
                    </h3>
                    <button type="button" onClick={() => addContactPageArrayItem('faqs', {question:'', answer:''})} className="flex items-center gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95" style={{margin:0}}>
                        + Add Question
                    </button>
                </div>
                <div className="space-y-5">
                    {(content.contactPage?.faqs || []).map((faq, i) => (
                        <div key={i} className="relative p-6 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col gap-3 group hover:border-amber-200 transition-colors">
                            <button type="button" onClick={() => removeContactPageArrayItem('faqs', i)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10 font-bold">×</button>
                            <input className="w-full pr-10 px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-amber-400 outline-none font-bold text-gray-800 transition-colors" placeholder="Question (e.g. 💬 What is your timeline?)" value={faq.question || ''} onChange={e => handleArrayChange('faqs', i, 'question', e.target.value)} />
                            <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-amber-400 outline-none text-sm text-gray-600 min-h-[80px] transition-colors" placeholder="Provide the detailed answer here..." value={faq.answer || ''} onChange={e => handleArrayChange('faqs', i, 'answer', e.target.value)}></textarea>
                        </div>
                    ))}
                    {(!content.contactPage?.faqs || content.contactPage.faqs.length === 0) && <div className="py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">No FAQs added yet.</div>}
                </div>
            </div>

            {/* ── OUR SERVICES GRID ── */}
            <div className="form-section bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-10 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-2 bg-pink-50 text-pink-600 rounded-lg">✨</span> Our Services
                    </h3>
                    <button type="button" onClick={() => addContactPageArrayItem('services', {icon:'', title:'', desc:''})} className="flex items-center gap-2 bg-pink-100 text-pink-700 hover:bg-pink-200 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95" style={{margin:0}}>
                        + Add Service
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {(content.contactPage?.services || []).map((srv, i) => (
                        <div key={i} className="relative p-5 bg-gray-50 border border-gray-100 rounded-xl text-center hover:border-pink-200 transition-colors group shadow-sm hover:shadow-md">
                            <button type="button" onClick={() => removeContactPageArrayItem('services', i)} className="absolute -top-2 -right-2 text-red-500 text-sm font-bold bg-red-50 hover:bg-red-500 hover:text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-all z-10">×</button>
                            <input className="w-full mb-3 mt-1 text-center text-3xl bg-transparent outline-none focus:scale-110 transition-transform" placeholder="Icon (🎬)" value={srv.icon || ''} onChange={e => handleArrayChange('services', i, 'icon', e.target.value)} />
                            <input className="w-full mb-3 text-center text-sm font-bold bg-white border border-gray-200 focus:border-pink-400 rounded-lg px-2 py-2 outline-none transition-colors" placeholder="Service Title" value={srv.title || ''} onChange={e => handleArrayChange('services', i, 'title', e.target.value)} />
                            <textarea className="w-full text-center text-xs text-gray-500 bg-white border border-gray-200 focus:border-pink-400 rounded-lg px-2 py-2 outline-none min-h-[70px] resize-none transition-colors" placeholder="Short Desc" value={srv.desc || ''} onChange={e => handleArrayChange('services', i, 'desc', e.target.value)}></textarea>
                        </div>
                    ))}
                    {(!content.contactPage?.services || content.contactPage.services.length === 0) && <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">No services added yet.</div>}
                </div>
            </div>

            {/* ── STICKY GLOBAL SAVE BUTTON ── */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[100]">
                <button 
                    type="button"
                    onClick={handleSave} 
                    disabled={saving} 
                    className={`w-full flex items-center justify-center gap-3 ${saving ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black text-white active:scale-[0.98]'} p-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-gray-700 transition-all duration-300`}
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Saving Data...
                        </>
                    ) : (
                        <>
                            <span className="text-emerald-400 text-2xl">💾</span> 
                            Save All Content Settings
                        </>
                    )}
                </button>
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