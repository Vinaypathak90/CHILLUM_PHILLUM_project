import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import ModalsContainer from '../../components/ModalsContainer';

// 🔥 1. COUNTER ANIMATION COMPONENT
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Extract number from string (e.g., "500M+" -> 500)
  const targetNumber = parseInt(target.replace(/\D/g, '')) || 0;
  const suffix = target.replace(/[0-9]/g, ''); // Extract "M+" or "+"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = targetNumber;
    if (start === end) {
        setCount(end);
        return;
    }

    let timer = setInterval(() => {
      start += Math.ceil(end / (duration / 50));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [hasStarted, targetNumber, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const Projects = () => {
  const [content, setContent] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, projectsRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/page-content`),
          axios.get(`${config.API_BASE_URL}/projects`)
        ]);
        if (contentRes.data.success) setContent(contentRes.data.data);
        if (projectsRes.data.success) setProjectsList(projectsRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects content:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-2xl bg-[#f7f4ef] text-[#1a1a1a] font-bold font-['Bebas_Neue'] tracking-widest">Loading Portfolio...</div>;

  const pageData = content?.projectsPage || {};
  const caseStudies = pageData.caseStudies || [];
  const stats = pageData.stats || [];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 8;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <div className="bg-[#f7f4ef] text-[#1a1a1a] font-['DM_Sans'] overflow-x-hidden">
      <Navbar navData={content?.nav} />
      <HeroSection content={content} />

      {/* ── FEATURED PROJECTS GRID ── */}
      <section className="bg-[#f7f4ef] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">OUR WORK</span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">Featured <em className="italic text-[#b5862a]">Projects</em></h2>

        {projectsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {projectsList.map((project) => (
              <div key={project._id} onClick={() => setActiveProject(project)} className="cursor-pointer group" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transition: 'transform 0.3s ease' }}>
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-6">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-[0.75rem] font-semibold tracking-widest uppercase mb-2">{project.category}</p>
                      <h3 className="text-white text-[1.2rem] font-bold">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500 italic mt-8">No projects added yet.</p>}
      </section>

      <ModalsContainer activeProject={activeProject} onClose={() => setActiveProject(null)} />

      {/* ── CASE STUDIES ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">{pageData.caseStudiesLabel}</span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">{pageData.caseStudiesTitleMain} <em className="italic text-[#b5862a]">{pageData.caseStudiesTitleHighlight}</em></h2>
        {caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 mt-12">
            {caseStudies.map((study, i) => (
              <div key={i} className="p-8 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 border border-transparent hover:border-[#b5862a]/20">
                <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-4">{study.title}</h3>
                <p className="text-[#555] leading-[1.8] text-[0.95rem] mb-4">{study.desc}</p>
                <p className="text-[#b5862a] text-[0.85rem] font-semibold uppercase tracking-wider">Campaign Type: {study.type}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500 italic mt-8">No case studies added yet.</p>}
      </section>

      {/* ── PORTFOLIO BY NUMBERS (WITH COUNTER) ── */}
      <section className="bg-gradient-to-br from-[#f0ece4] to-[#e8e2d8] py-28 px-6 md:px-12 text-center">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">{pageData.statsLabel}</span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">{pageData.statsTitleMain} <em className="italic text-[#b5862a]">{pageData.statsTitleHighlight}</em></h2>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-8 mt-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="font-['Bebas_Neue'] text-[2.8rem] text-[#b5862a] mb-2 tracking-wider">
                  {/* 🔥 COUNTER APPLIED HERE */}
                  <Counter target={stat.number} />
                </div>
                <p className="text-[#888] text-[0.9rem] uppercase tracking-widest leading-relaxed">
                  <strong className="text-[#1a1a1a]">{stat.label1}</strong><br/>
                  {stat.label2}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA SECTION (WITH CLICK EFFECT) ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12 text-center">
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] mx-auto max-w-[600px] mb-6">{pageData.ctaTitleMain} <em className="italic text-[#b5862a]">{pageData.ctaTitleHighlight}</em></h2>
        <p className="text-[#555] text-[0.95rem] leading-[1.8] max-w-[600px] mx-auto mb-8">{pageData.ctaDesc}</p>
        
        {pageData.ctaButtonText && (
          <a 
            href={pageData.ctaButtonLink || "/contact"} 
            className="inline-block px-10 py-4 bg-[#b5862a] text-[#f7f4ef] text-[0.75rem] font-semibold tracking-[0.2em] uppercase border-2 border-[#b5862a] 
            transition-all duration-300 
            hover:bg-transparent hover:text-[#b5862a]
            active:scale-95 active:shadow-inner" 
            /* 🔥 'active:scale-95' gives the click effect */
          >
            {pageData.ctaButtonText}
          </a>
        )}
      </section>

      <Footer content={content} />
    </div>
  );
};

export default Projects;