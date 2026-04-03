import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AboutSection from '../../components/AboutSection';
import HeroSection from '../../components/HeroSection';


const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔥 FIX 1: activeImage ka state define kar diya
  const [activeImage, setActiveImage] = useState(null);

  // 1. Fetch Data from Backend
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/page-content`);
        if (res.data.success) {
          setContent(res.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching about content:", err);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // 2. Counter Animation Effect (Scroll observer)
  useEffect(() => {
    if (loading) return;

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
    return () => counterObserver.disconnect();
  }, [loading]);

  // 🔥 FIX 2: Stop background scrolling when image is open
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeImage]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl bg-[#f7f4ef] text-[#1a1a1a] font-bold font-['Bebas_Neue']">
        Loading Our Story...
      </div>
    );
  }

  // 3. Backend Fallbacks
  const aboutData = content?.about || {};
  
  const journey = aboutData.journey?.length > 0 ? aboutData.journey : [
    { year: "2019", title: "Studio Founded", desc: "Chillum Phillum officially launches with a small but mighty team." },
    { year: "2020", title: "First Awards", desc: "Recognition for innovative film work and creative excellence." },
    { year: "2022", title: "Expansion", desc: "Expanded team and upgraded facilities for larger productions." },
    { year: "2024", title: "Industry Recognition", desc: "Established as go-to creative partner for top brands across India." }
  ];

  const impactStats = aboutData.impactStats?.length > 0 ? aboutData.impactStats : [
    { number: "500M+", label: "Total Views" },
    { number: "25+", label: "Awards Won" },
    { number: "100+", label: "Happy Clients" }
  ];

  return (
    <div className="bg-[#f7f4ef] text-[#1a1a1a] font-['DM_Sans'] overflow-x-hidden">
      <Navbar navData={content?.nav} />

      {/* ── HEADER HERO (Cinematic Zoom & Overlap) ── */}
       <HeroSection content={content} onImageClick={(img) => setActiveImage(img)} />  
       
       {/* ── ABOUT SECTION & CORE VALUES ── */}
      <AboutSection content={content} onImageClick={(img) => setActiveImage(img)} />

      {/* ── OUR JOURNEY ── */}
      <section className="bg-gradient-to-br from-[#f0ece4] to-[#e8e2d8] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">{aboutData.journeyLabel || 'Our Journey'}</span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {aboutData.journeyTitleMain || 'From Humble Beginnings to'} <em className="italic text-[#b5862a]">{aboutData.journeyTitleHighlight || 'Industry Leaders'}</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {journey.map((item, i) => (
            <div key={i} className="text-center bg-white/40 p-6 rounded-lg border border-[#b5862a]/10 hover:bg-white/80 transition duration-300">
              <div className="font-['Bebas_Neue'] text-5xl text-[#b5862a] mb-2">{item.year}</div>
              <p className="text-[#555] text-[0.9rem] leading-relaxed">
                <strong className="text-[#1a1a1a] block mb-1">{item.title}</strong>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPACT SECTION ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">{aboutData.impactLabel || 'Our Impact'}</span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {aboutData.impactTitleMain || 'Creating'} <em className="italic text-[#b5862a]">{aboutData.impactTitleHighlight || 'Meaningful Work'}</em> {aboutData.impactTitleEnd || 'Every Day'}
        </h2>
        <p className="text-[#555] text-[1rem] leading-[1.9] max-w-[800px] mt-6">
          {aboutData.impactDescription || "Over the years, we've had the privilege of working with diverse clients, from emerging startups to established giants. Our work has earned recognition at prestigious industry award shows and most importantly, has connected with millions of viewers across digital platforms and traditional media."}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          {impactStats.map((stat, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-transform duration-300">
              <div className="stat-num font-['Bebas_Neue'] text-5xl md:text-6xl text-[#b5862a]">{stat.number}</div>
              <p className="text-[#888] text-[0.85rem] mt-2 uppercase tracking-[0.1em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer content={content} />

      {/* 🔥 FIX 3: THE IMAGE LIGHTBOX MODAL 🔥 */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white text-5xl font-light transition-colors"
            onClick={() => setActiveImage(null)}
          >
            &times;
          </button>

          {/* The Image */}
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center animate-[popIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()} /* Image pe click karne se band nahi hoga */
          >
            <img 
              src={activeImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default About;