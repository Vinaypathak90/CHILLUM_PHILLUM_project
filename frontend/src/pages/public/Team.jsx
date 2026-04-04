import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import TeamSection from '../../components/TeamSection';
import ModalsContainer from '../../components/ModalsContainer';


const Team = () => {
  const [content, setContent] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTeam, setActiveTeam] = useState(null);

  // 1. Fetch Data from Backend
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [contentRes, teamRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/page-content`),
          axios.get(`${config.API_BASE_URL}/team`)
        ]);
        
        if (contentRes.data.success) {
          setContent(contentRes.data.data);
        }
        
        if (teamRes.data.success) {
          setMembers(teamRes.data.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team content:", err);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl bg-[#f7f4ef] text-[#1a1a1a] font-bold font-['Bebas_Neue']">
        Loading Team...
      </div>
    );
  }

  // 2. Strict Backend Data Mapping
  const teamData = content?.team || {};
  const cultureCards = teamData.cultureCards || [];
  const testimonials = teamData.testimonials || [];

  return (
    <div className="bg-[#f7f4ef] text-[#1a1a1a] font-['DM_Sans'] overflow-x-hidden">
      <Navbar navData={content?.nav} />

      {/* ── HEADER HERO (Passing full content so it matches Home/About) ── */}
      <HeroSection content={content} />

      {/* ── MEET THE TEAM (Passing content to TeamSection) ── */}
      <TeamSection team={members} onTeamClick={setActiveTeam} />
      <ModalsContainer activeTeam={activeTeam} onClose={() => setActiveTeam(null)} />

      {/* ── STUDIO CULTURE ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4 text-center">
          {teamData.cultureLabel || 'Studio Culture'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] text-center">
          {teamData.cultureTitleMain || 'Built on'} <em className="italic text-[#b5862a]">{teamData.cultureTitleHighlight || 'Collaboration & Innovation'}</em>
        </h2>
        <p className="text-[#555] text-[0.95rem] leading-[1.8] max-w-[700px] mt-6 mb-12">
          {teamData.cultureDesc || "Our studio thrives on a culture of creative collaboration, continuous learning, and pushing artistic boundaries. We believe in empowering our team members to take ownership of their craft."}
        </p>

        {cultureCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
            {cultureCards.map((card, i) => (
              <div key={i} className="p-8 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                <h3 className="text-[1.1rem] text-[#b5862a] mb-3 font-semibold flex items-center gap-2">
                  <span>{card.icon}</span> {card.title}
                </h3>
                <p className="text-[#555] leading-[1.8] text-[0.95rem]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No culture entries added yet.</p>
        )}
      </section>

      {/* ── TESTIMONIALS (What Our Team Says) ── */}
      <section className="bg-gradient-to-br from-[#f0ece4] to-[#e8e2d8] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">
          {teamData.testimonialsLabel || 'What Our Team Says'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {teamData.testimonialsTitleMain || 'Working at'} <em className="italic text-[#b5862a]">{teamData.testimonialsTitleHighlight || 'Chillum Phillum'}</em>
        </h2>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 mt-12">
            {testimonials.map((test, i) => (
              <div key={i} className="p-8 bg-white rounded-lg shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <p className="text-[#555] leading-[1.8] mb-6 italic text-[0.95rem]">
                  "{test.quote}"
                </p>
                <p className="font-semibold text-[#1a1a1a]">{test.name}</p>
                <p className="text-[#888] text-[0.85rem] mt-1">{test.role}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic mt-8">No testimonials added yet.</p>
        )}
      </section>

      {/* ── CAREER / HIRING SECTION ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between ">
        <div className="max-w-[700px]">
          <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4 text-center">
            {teamData.careerLabel || 'Career With Us'}
          </span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
            {teamData.careerTitleMain || "We're Always Looking for"} <em className="italic text-[#b5862a]">{teamData.careerTitleHighlight || 'Talented Creators'}</em>
          </h2>
          <p className="text-[#555] text-[0.95rem] leading-[1.8] mt-6 mb-8 md:mb-0">
            {teamData.careerDesc || "If you're passionate about filmmaking, photography, design, or any aspect of creative production, we'd love to hear from you. Check back soon for current openings or reach out with your portfolio."}
          </p>
        </div>
        <a 
          href={teamData.careerButtonLink || "/contact"} 
          className="inline-block px-10 py-4 bg-[#b5862a] text-[#1a1a1a] text-[0.75rem] font-semibold tracking-[0.2em] uppercase border-2 border-[#b5862a] hover:bg-transparent hover:text-[#b5862a] transition-all duration-300 whitespace-nowrap"
        >
          {teamData.careerButtonText || 'Get In Touch'}
        </a>
      </section>

      <Footer content={content} />
    </div>
  );
};

export default Team;