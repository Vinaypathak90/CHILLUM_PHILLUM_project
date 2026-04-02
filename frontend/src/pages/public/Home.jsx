import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from "../../config";
// Make sure your CSS has the modal-overlay styles and client slider styles

// ─── REUSABLE SUB-COMPONENTS ───
const Navbar = ({ navData }) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Reset error state if the logo image source changes
    setImgFailed(false);
  }, [navData?.logoImage]);

  React.useEffect(() => {
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={isMenuOpen ? 'menu-open' : ''}>
      <div className="nav-top">
        <a href="#home" className="nav-logo">
          {!imgFailed && (
            <img
              src={navData?.logoImage || "/logo.png"}
              alt="Chillum Phillum"
              onError={() => setImgFailed(true)}
            />
          )}
          {imgFailed && <span>{navData?.logoText || "CHILLUM PHILLUM"}</span>}
        </a>

        {/* Desktop links */}
        <ul className="nav-links desktop-links">
          <li><a href="#about">About</a></li>
          <li><a href="#studio">The Studio</a></li>
          <li><a href="#team">Our Team</a></li>
          <li><a href="#projects">Our Projects</a></li>
          <li><a href="#news">Our Campaigns</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Hamburger button */}
        <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="mobile-nav">
        <ul className="nav-links">
          <li><a href="#about" onClick={handleLinkClick}>About</a></li>
          <li><a href="#studio" onClick={handleLinkClick}>The Studio</a></li>
          <li><a href="#team" onClick={handleLinkClick}>Our Team</a></li>
          <li><a href="#projects" onClick={handleLinkClick}>Our Projects</a></li>
          <li><a href="#news" onClick={handleLinkClick}>Our Campaigns</a></li>
          <li><a href="#contact" onClick={handleLinkClick}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

const SectionHeader = ({ label, titleMain, titleHighlight, titleEnd, align = 'left' }) => (
  <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start' }}>
    <span className="section-label">{label}</span>
    <h2 className="section-title" style={{ maxWidth: align === 'center' ? '100%' : '680px', margin: 0 }}>
      {titleMain} <em>{titleHighlight}</em> {titleEnd}
    </h2>
  </div>
);

// ─── MAIN HOME COMPONENT ───

const Home = () => {
  // 1. ALL STATES AT THE TOP (React Rules of Hooks)
  const [data, setData] = useState({
    pageContent: null,
    projects: [],
    team: [],
    campaigns: []
  });
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState('Send Message');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  // 🔥 STATE FOR POPUPS (MODALS)
  const [activeImage, setActiveImage] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const [activeStudio, setActiveStudio] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);

  // 🔥 SLIDER STATES (Moved to top level)
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [footerImgFailed, setFooterImgFailed] = useState(false);

useEffect(() => {
    setFooterImgFailed(false);
}, [data.pageContent?.nav?.logoImage]);
  // 2. ALL EFFECTS
  
  // Lock background scroll when any modal is open
  useEffect(() => {
    if (activeImage || activeProject || activeTeam || activeStudio || activeCampaign) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeImage, activeProject, activeTeam, activeStudio, activeCampaign]);

  // Fetch Main Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, projectRes, teamRes, campaignRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/page-content`),
          axios.get(`${config.API_BASE_URL}/projects`),
          axios.get(`${config.API_BASE_URL}/team`),
          axios.get(`${config.API_BASE_URL}/campaigns`)
        ]);

        
        setData({
          pageContent: contentRes.data.data,
          projects: projectRes.data.data,
          team: teamRes.data.data,
          campaigns: campaignRes.data.data
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Clients for Slider
  useEffect(() => {
    const fetchClients = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/clients`);
            if (res.data.success) {
                setClients(res.data.data);
            }
            setLoadingClients(false);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setLoadingClients(false);
        }
    };
    fetchClients();
  }, []);

  // Animations & DOM Manipulation
  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-links a');
      const navEl = document.querySelector('nav');
      const navTopEl = document.querySelector('.nav-top');

      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
      });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
      });

      if (window.scrollY > 60) {
        if(navTopEl) navTopEl.style.padding = '0.5rem 3rem';
        if(navEl) navEl.style.boxShadow = '0 2px 24px rgba(0,0,0,0.08)';
      } else {
        if(navTopEl) navTopEl.style.padding = '1rem 3rem';
        if(navEl) navEl.style.boxShadow = 'none';
      }
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}ms`;
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.team-card, .project-card, .news-card, .stat-item, .studio-card, .about-img, .section-title, .section-label, .about-text p, .contact-info p, .divider')
      .forEach((el, i) => {
        el.classList.add('reveal-hidden');
        el.dataset.delay = (i % 4) * 100;
        revealObserver.observe(el);
      });

    const counters = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent.trim();
          const target = parseInt(raw) || 0;
          const suffix = raw.replace(/[0-9]/g, ''); 
          let count = 0;
          const step = Math.max(1, Math.ceil(target / 50));
          const timer = setInterval(() => {
            count += step;
            if (count >= target) { 
              count = target; 
              clearInterval(timer); 
            }
            el.textContent = count + suffix;
          }, 28);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, [loading]);

  // 3. HELPER FUNCTIONS
  const handleSpotlight = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', x + '%');
    e.currentTarget.style.setProperty('--my', y + '%');
  };

  const applyTilt = (e, intensity = 8) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * intensity;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * intensity;
    e.currentTarget.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  };

  const removeTilt = (e) => {
    e.currentTarget.style.transform = '';
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Sending...');
    try {
      await axios.post(`${config.API_BASE_URL}/messages`, formData);
      setFormStatus('Sent!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('Send Message'), 3000);
    } catch (err) {
      setFormStatus('Error!');
      setTimeout(() => setFormStatus('Send Message'), 3000);
    }
  };

  const closeAllModals = () => {
    setActiveImage(null);
    setActiveProject(null);
    setActiveTeam(null);
    setActiveStudio(null);
    setActiveCampaign(null);
  };

  // 4. EARLY RETURN (Must be after all hooks!)
  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: '#f7f4ef', color: '#1a1a1a', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>🎬 Loading Chillum Phillum...</div>;

  // 5. VARIABLES FOR RENDER
  const content = data.pageContent || {};
  const heroImages = (content.hero?.backgroundImages || []).filter(img => img.trim() !== '');
  const fallbackHero = ["https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80", "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"];
  const displayHeroImages = heroImages.length > 0 ? heroImages : fallbackHero;
  
  const aboutParagraphs = content.about?.paragraphs?.length > 0 ? content.about.paragraphs : ["We combine cinematic vision with advertising craft and photography excellence..."];
  const displayStats = content.about?.stats?.length > 0 ? content.about.stats : [{ number: "50+", label: "PROJECTS" }, { number: "5+", label: "YEARS" }, { number: "30+", label: "CLIENTS" }];

  // 🔥 BULLETPROOF URL FIXER
const getValidUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '' || url === '#') return null;
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return `https://${cleanUrl}`;
  }
  return cleanUrl;
};

const instagramUrl = getValidUrl(content.footer?.socials?.instagram);
const xUrl = getValidUrl(content.footer?.socials?.x);
const facebookUrl = getValidUrl(content.footer?.socials?.facebook);
  // 6. MAIN RENDER
  return (
    <>
      <Navbar navData={content.nav} />

      {/* ── HERO SECTION ── */}
      <section id="home" onMouseMove={handleSpotlight}>
        <div className="hero-strip" aria-hidden="true">
          <div className="hero-strip-track">
            {[...displayHeroImages, ...displayHeroImages, ...displayHeroImages].map((img, i) => (
              <div className="hero-strip-item" key={i} onClick={() => setActiveImage(img)} style={{cursor: 'pointer'}}>
                <img src={img} alt="Hero Background"/>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">{content.hero?.eyebrow || 'Est. · Creative Production Studio'}</p>
          <h1 className="hero-title">
            {content.hero?.titleMain || 'WHERE IT IS'}
            <span>{content.hero?.titleHighlight || 'Always Buzzing'}</span>
          </h1>
          <p className="hero-sub">{content.hero?.subtitle || 'Film · Production · Advertising · Photography'}</p>
          <div className="hero-cta">
            <a href="#projects" className="btn-gold">Our Projects</a>
            <a href="#about" className="btn-outline">Learn More</a>
          </div>
        </div>
        <div className="scroll-hint" aria-hidden="true"><div className="scroll-line"></div><span>Scroll</span></div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about">
        <div className="about-text">
          <SectionHeader 
            label={content.about?.label || 'About Us'} 
            titleMain={content.about?.titleMain || 'A Creative Studio Where'} 
            titleHighlight={content.about?.titleHighlight || 'Bold Ideas'} 
            titleEnd={content.about?.titleEnd || 'Come to Life'} 
            align="left"
          />
          <div className="divider"></div>
          {aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
          <div className="about-stats">
            {displayStats.map((s, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-num">{s.number}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="about-images">
          {content.about?.images?.map((img, i) => img && (
            <div className="about-img" key={i} onClick={() => setActiveImage(img)} style={{cursor: 'pointer'}}>
              <img src={img} alt="Studio"/>
            </div>
          ))}
        </div>
      </section>

      {/* ── STUDIO SECTION ── */}
      <section id="studio">
        <SectionHeader 
          label={content.studio?.label || 'What We Do'} 
          titleMain={content.studio?.titleMain || 'The'} 
          titleHighlight={content.studio?.titleHighlight || 'Chillum Phillum'} 
          titleEnd={content.studio?.titleEnd || 'Way'} 
          align="center"
        />
        <div className="studio-grid">
          {content.studio?.cards?.map((card, i) => card.label && (
            <div className="studio-card" key={i} onClick={() => setActiveStudio(card)} onMouseMove={(e) => applyTilt(e, 6)} onMouseLeave={removeTilt}>
              <img src={card.image} alt={card.label} />
              <span className="studio-card-label">{card.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section id="team">
        <div className="team-header">
          <SectionHeader label="Our People" titleMain="Meet the" titleHighlight="Creative Team" align="left" />
        </div>
        <div className="team-grid">
          {data.team.length > 0 ? data.team.map((member) => (
            <div className="team-card" key={member._id} onClick={() => setActiveTeam(member)} style={{cursor: 'pointer'}}>
              <div className="team-photo">
                <img src={member.photoUrl} alt={member.name} />
                <div className="team-photo-overlay"></div>
              </div>
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
            </div>
          )) : <p style={{color: '#888'}}>Team members will appear here.</p>}
        </div>
      </section>

      {/* ── PROJECTS SECTION ── */}
      <section id="projects">
        <div className="projects-header">
          <SectionHeader label="Our Work" titleMain="Featured" titleHighlight="Projects" align="left" />
          <a  style={{textAlign: 'center'}} href="#contact" className="btn-gold">Start a Project</a>
        </div>
        <div className="projects-grid">
          {data.projects.filter(p => p.isFeatured !== false).map((project) => (
            <div className="project-card" key={project._id} onClick={() => setActiveProject(project)} onMouseMove={(e) => applyTilt(e, 8)} onMouseLeave={removeTilt}>
              <img src={project.imageUrl} alt={project.title} />
              <div className="project-info">
                <p className="project-type">{project.category}</p>
                <p className="project-name">{project.title}</p>
                <p className="project-desc">{project.shortDescription || project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* ── CLIENT SLIDER SECTION ── */}
{!loadingClients && clients.length > 0 && (
  <div className="client-slider-wrapper">
    <div className="client-slider-header">
      <span className="section-eyebrow">Collaborations &amp; Clientele</span>
      <h3>Trusted by <em>Iconic</em> Brands</h3>
      <div className="header-divider"></div>
      <p>Companies we have collaborated with</p>
    </div>

    <div style={{ position: 'relative' }}>
      <div className="slider-fade-left"></div>
      <div className="slider-fade-right"></div>

      <div className="slider-container">
        <div className="slider-track">
          {/* Set 1 */}
          {clients.map((client) => (
            <div className="slide" key={`a-${client._id}`}>
              <img src={client.logoUrl} alt={client.name} loading="lazy" />
            </div>
          ))}
          {/* Set 2 */}
          {clients.map((client) => (
            <div className="slide" key={`b-${client._id}`}>
              <img src={client.logoUrl} alt={client.name} loading="lazy" />
            </div>
          ))}
          {/* Set 3 — kam logos ho toh bhi seamless */}
          {clients.map((client) => (
            <div className="slide" key={`c-${client._id}`}>
              <img src={client.logoUrl} alt={client.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
      {/* ── NEWS / CAMPAIGNS SECTION ── */}
      <section id="news">
        <div className="news-header">
          <SectionHeader label="Latest Updates" titleMain="Our" titleHighlight="Campaigns" align="left" />
          <a  style={{textAlign: 'center'}} href="#contact" className="btn-gold">Collaborate</a>
        </div>
        <div className="news-grid">
          {data.campaigns.filter(c => c.isPublished !== false).map((camp) => (
            <div className="news-card" key={camp._id} onClick={() => setActiveCampaign(camp)}>
              <div className="news-img"><img src={camp.imageUrl} alt={camp.title} /></div>
              <span className="news-date">{camp.dateString}</span>
              <h3 className="news-title">{camp.title}</h3>
              <p className="news-excerpt">{camp.excerpt}</p>
              <span className="news-read" style={{cursor:'pointer'}}>Read More →</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact">
        <div className="contact-info">
          <SectionHeader label="Get In Touch" titleMain="Let's Create Something" titleHighlight="Remarkable" align="left" />
          <div className="divider"></div>
          <p>{content.contact?.description || "We're always looking for exciting projects and bold collaborators. Whether you're a filmmaker, brand, or storyteller — reach out and let's make something together."}</p>
          <div className="contact-detail">
            <a href={`mailto:${content.contact?.email || 'hello@chillumphillum.com'}`}>{content.contact?.email || 'hello@chillumphillum.com'}</a>
            <a href={`tel:${content.contact?.phone || '+919999999999'}`}>{content.contact?.phone || '+91 99999 99999'}</a>
            <a href="#">{content.contact?.location || 'India'}</a>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleContactSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/></div>
            <div className="form-group"><label>Email</label><input type="email" placeholder="your@email.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Phone</label><input type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}/></div>
            <div className="form-group"><label>Subject</label><input type="text" placeholder="Project Inquiry" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}/></div>
          </div>
          <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your project..." required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea></div>
          <button className="form-submit" type="submit" style={{ backgroundColor: formStatus === 'Sent!' ? '#2d7a4f' : '', color: formStatus === 'Sent!' ? '#fff' : '' }}>{formStatus}</button>
        </form>
      </section>

      {/* ── FOOTER ── */}
{/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          {/* LOGO LOGIC (Image with Text Fallback) */}
          <div className="footer-logo">
            {!footerImgFailed && content.nav?.logoImage ? (
              <img
                src={content.nav.logoImage}
                alt="Chillum Phillum"
                className="footer-logo-img"
                onError={() => setFooterImgFailed(true)}
              />
            ) : (
              <span>{content.nav?.logoText || 'CHILLUM PHILLUM'}</span>
            )}
          </div>

          {/* SOCIAL MEDIA ICONS (Controlled by Backend) */}
          <div className="footer-socials">
            {/* Instagram */}
           <a 
  href={instagramUrl || '#'} 
  target="_blank"
  rel="noopener noreferrer" 
  aria-label="Instagram"
  onClick={(e) => { if (!instagramUrl) e.preventDefault(); }}
  style={{ cursor: instagramUrl ? 'pointer' : 'default', opacity: instagramUrl ? 1 : 0.5 }}
>
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            {/* X (Twitter) */}
            <a 
  href={xUrl || '#'} 
  target="_blank"
  rel="noopener noreferrer" 
  aria-label="X (Twitter)"
  onClick={(e) => { if (!xUrl) e.preventDefault(); }}
  style={{ cursor: xUrl ? 'pointer' : 'default', opacity: xUrl ? 1 : 0.5 }}
>
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Facebook */}
          <a 
  href={facebookUrl || '#'} 
  target="_blank"
  rel="noopener noreferrer" 
  aria-label="Facebook"
  onClick={(e) => { if (!facebookUrl) e.preventDefault(); }}
  style={{ cursor: facebookUrl ? 'pointer' : 'default', opacity: facebookUrl ? 1 : 0.5 }}
>
              <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{content.footer?.copyrightText || '© 2026 Chillum Phillum. All rights reserved.'}</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 🚀 DYNAMIC POPUPS / MODALS */}
      {/* ========================================================= */}

      {/* 1. HERO / ABOUT IMAGE LIGHTBOX */}
      <div className={`modal-overlay bg-blur-dark ${activeImage ? 'active' : ''}`} onClick={closeAllModals}>
        <button className="modal-close-btn light" onClick={closeAllModals}>×</button>
        {activeImage && (
          <div className="pop-content" onClick={(e) => e.stopPropagation()}>
            <img src={activeImage} className="hero-lightbox-img" alt="Enlarged view" />
          </div>
        )}
      </div>

      {/* 2. PROJECT POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeProject ? 'active' : ''}`} onClick={closeAllModals}>
        <button className="modal-close-btn" onClick={closeAllModals}>×</button>
        {activeProject && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeProject.imageUrl} alt={activeProject.title} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">{activeProject.category}</span>
              <h3 className="modal-title">{activeProject.title}</h3>
              <p className="modal-desc">{activeProject.detailedDescription || activeProject.shortDescription || activeProject.description}</p>
              <button className="btn-gold" style={{alignSelf: 'flex-start'}} onClick={closeAllModals}>Close Details</button>
            </div>
          </div>
        )}
      </div>

      {/* 3. TEAM POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeTeam ? 'active' : ''}`} onClick={closeAllModals}>
        <button className="modal-close-btn" onClick={closeAllModals}>×</button>
        {activeTeam && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeTeam.photoUrl} alt={activeTeam.name} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">{activeTeam.role}</span>
              <h3 className="modal-title">{activeTeam.name}</h3>
              <p className="modal-desc">{activeTeam.bio || "Bringing unmatched creativity and expertise to Chillum Phillum. Ensuring every frame and concept is executed flawlessly."}</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. STUDIO POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeStudio ? 'active' : ''}`} onClick={closeAllModals}>
        <button className="modal-close-btn" onClick={closeAllModals}>×</button>
        {activeStudio && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeStudio.image} alt={activeStudio.label} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">The Chillum Phillum Way</span>
              <h3 className="modal-title">{activeStudio.label}</h3>
              <p className="modal-desc">{activeStudio.description || `Our dedicated team combines cinematic vision with top-tier craft in ${activeStudio.label}. We work tirelessly to ensure the highest quality output.`}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. CAMPAIGN POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeCampaign ? 'active' : ''}`} onClick={closeAllModals}>
        <button className="modal-close-btn" onClick={closeAllModals}>×</button>
        {activeCampaign && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeCampaign.imageUrl} alt={activeCampaign.title} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">{activeCampaign.dateString}</span>
              <h3 className="modal-title" style={{fontSize: '2rem'}}>{activeCampaign.title}</h3>
              <p className="modal-desc">{activeCampaign.detailedContent || activeCampaign.excerpt}</p>
              {activeCampaign.readMoreLink && activeCampaign.readMoreLink !== '#' && (
                <a href={activeCampaign.readMoreLink} target="_blank" rel="noreferrer" className="btn-gold" style={{alignSelf: 'flex-start'}}>Read Full Article</a>
              )}
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default Home;