import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from "../../config";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import AboutSection from '../../components/AboutSection';
import StudioSection from '../../components/StudioSection';
import TeamSection from '../../components/TeamSection';
import ProjectsSection from '../../components/ProjectsSection';
import ClientSliderSection from '../../components/ClientSliderSection';
import CampaignsSection from '../../components/CampaignsSection';
import ContactSection from '../../components/ContactSection';
import ModalsContainer from '../../components/ModalsContainer';

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

  // 🔥 STATE FOR POPUPS (MODALS)
  const [activeImage, setActiveImage] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const [activeStudio, setActiveStudio] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);

  // 🔥 SLIDER STATES (Moved to top level)
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
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
  return (
    <>
      <Navbar navData={content.nav} />

      <HeroSection content={content} onImageClick={setActiveImage} onSpotlight={handleSpotlight} />

      <AboutSection content={content} onImageClick={setActiveImage} />

      <StudioSection content={content} onStudioClick={setActiveStudio} onApplyTilt={applyTilt} onRemoveTilt={removeTilt} />

      <TeamSection team={data.team} onTeamClick={setActiveTeam} />

      <ProjectsSection projects={data.projects} onProjectClick={setActiveProject} onApplyTilt={applyTilt} onRemoveTilt={removeTilt} />

      <ClientSliderSection clients={clients} loading={loadingClients} />

      <CampaignsSection campaigns={data.campaigns} onCampaignClick={setActiveCampaign} />

      <ContactSection content={data.pageContent} />

      <Footer content={data.pageContent} />

      <ModalsContainer
        activeImage={activeImage}
        activeProject={activeProject}
        activeTeam={activeTeam}
        activeStudio={activeStudio}
        activeCampaign={activeCampaign}
        onClose={closeAllModals}
      />
    </>
  );
};

export default Home;