import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import ModalsContainer from '../../components/ModalsContainer';
import CampaignsSection from '../../components/CampaignsSection';
import ClientSliderSection from '../../components/ClientSliderSection';
// 🔥 COUNTER ANIMATION COMPONENT
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const targetString = String(target || '0');
  const targetNumber = parseInt(targetString.replace(/\D/g, '')) || 0;
  const suffix = targetString.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) setHasStarted(true);
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

const Campaigns = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // 1. Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, clientsRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/page-content`),
          axios.get(`${config.API_BASE_URL}/clients`)
        ]);
        
        if (contentRes.data.success) setContent(contentRes.data.data);
        if (clientsRes.data.success) setClients(clientsRes.data.data);
        
        setLoading(false);
        setLoadingClients(false);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setLoading(false);
        setLoadingClients(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl bg-[#f7f4ef] text-[#1a1a1a] font-bold font-['Bebas_Neue'] tracking-widest">
        Loading Campaigns...
      </div>
    );
  }

  // 2. Strict Backend Data Mapping with EXACT HTML Fallbacks
  const pageData = content?.campaignsPage || {};

  // Default HTML Fallbacks (transformed to match CampaignsSection structure)
  const defaultUpdates = [
    { _id: '1', imageUrl: 'https://images.unsplash.com/photo-1540655037529-dec987208707?w=800&q=80', dateString: 'March 2025', title: 'Chillum Phillum Announces New Short Film in Production', excerpt: 'Our latest cinematic short is now in pre-production, exploring stories rooted in the heartland of India.', isPublished: true },
    { _id: '2', imageUrl: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80', dateString: 'January 2025', title: 'Partnership with Leading Brand for National Ad Campaign', excerpt: 'We partnered with a top consumer brand to produce a high-impact national advertising campaign across digital platforms.', isPublished: true },
    { _id: '3', imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', dateString: 'October 2024', title: 'Photography Series Featured at Regional Arts Exhibition', excerpt: 'Our Light & Shadow photography series was showcased at a regional arts exhibition, receiving critical acclaim.', isPublished: true }
  ];

  const defaultSpecialties = [
    { icon: '🎯', title: 'Advertising Campaigns', desc: 'High-impact brand campaigns that cut through the noise and create lasting impressions on your target audience.' },
    { icon: '🎬', title: 'Product Launches', desc: 'Comprehensive multimedia strategies to generate buzz and excitement around new product releases.' },
    { icon: '📱', title: 'Digital Campaigns', desc: 'Social media-optimized content, web series, and digital storytelling that engages modern audiences.' }
  ];

  const defaultTrending = [
    { title: 'GreenEarth Initiative Campaign', desc: 'A groundbreaking environmental awareness campaign reaching 10M+ audiences across digital platforms.', tags: '🔥 Trending • 10M+ Views • 2025' },
    { title: 'TechVision Product Series', desc: 'Innovative tech product launch campaign with mixed reality elements and interactive content.', tags: '🎯 Campaign • 25M+ Reach • 2025' },
    { title: 'Brand Heritage Documentary', desc: 'A compelling 5-part series documenting the journey of a 50-year-old iconic Indian brand.', tags: '📽️ Series • 15M+ Views • 2024' }
  ];

  const defaultStats = [
    { number: '350%', label1: 'Avg. Engagement', label2: 'Increase' },
    { number: '45%', label1: 'Brand Recall', label2: 'Boost' },
    { number: '2.5x', label1: 'Conversion', label2: 'Rate' }
  ];

  // Final Data Arrays (Backend priority, HTML defaults as fallback)
  const updates = pageData.updates?.length > 0 ? pageData.updates : defaultUpdates;
  const specialties = pageData.specialties?.length > 0 ? pageData.specialties : defaultSpecialties;
  const trending = pageData.trending?.length > 0 ? pageData.trending : defaultTrending;
  const impactStats = pageData.impactStats?.length > 0 ? pageData.impactStats : defaultStats;

  return (
    <div className="bg-[#f7f4ef] text-[#1a1a1a] font-['DM_Sans'] overflow-x-hidden">
      <Navbar navData={content?.nav} />

      {/* ── HERO SECTION ── */}
        <HeroSection content={content} />

      {/* ── LATEST UPDATES / NEWS ── */}
      <CampaignsSection campaigns={updates} onCampaignClick={setActiveCampaign} />
    
     <ClientSliderSection clients={clients} loading={loadingClients} />
{/* ── CAMPAIGN SPECIALTIES ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">
          {pageData.specLabel || 'Campaign Specialties'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {pageData.specTitleMain || 'We Excel in'} <em className="italic text-[#b5862a]">{pageData.specTitleHighlight || 'Every Campaign Type'}</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-12">
          {specialties.map((spec, i) => (
            <div key={i} className="p-8 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
              <div className="flex items-start gap-3 mb-4">
                {spec.icon && <span className="text-2xl">{spec.icon}</span>}
                <h3 className="text-[1.1rem] text-[#b5862a] font-bold">
                  {spec.title}
                </h3>
              </div>
              <p className="text-[#555] leading-[1.8] text-[0.95rem]">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RECENT HIGHLIGHTS / TRENDING ── */}
      <section className="bg-gradient-to-br from-[#f0ece4] to-[#e8e2d8] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">
          {pageData.trendingLabel || 'Recent Highlights'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {pageData.trendingTitleMain || 'Trending'} <em className="italic text-[#b5862a]">{pageData.trendingTitleHighlight || 'Right Now'}</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 mt-12">
          {trending.map((item, i) => (
            <div key={i} className="p-8 bg-white rounded-lg">
              <h3 className="text-[1.05rem] mb-[0.8rem] text-[#1a1a1a] font-bold">
                {item.title}
              </h3>
              <p className="text-[#555] text-[0.9rem] leading-[1.8] mb-4">
                {item.desc}
              </p>
              <p className="text-[#b5862a] text-[0.85rem] font-semibold">
                {item.tags}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MEASURABLE RESULTS / IMPACT STATS ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4 text-center">
          {pageData.impactLabel || 'Measurable Results'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] text-center font-normal leading-[1.15]">
          {pageData.impactTitleMain || 'Campaigns That'} <em className="italic text-[#b5862a] ">{pageData.impactTitleHighlight || 'Deliver Real Impact'}</em>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mt-12">
          {impactStats.map((stat, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-lg">
              <p className="font-['Bebas_Neue'] text-[2.5rem] text-[#b5862a] mb-[0.5rem] tracking-wider">
                {/* 🔥 ANIMATED COUNTER HERE */}
                <Counter target={stat.number} />
              </p>
              <p className="text-[#555] text-[0.9rem] leading-[1.5]">
                <strong className="text-[#1a1a1a] font-bold">{stat.label1}</strong><br/>
                {stat.label2}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ModalsContainer activeCampaign={activeCampaign} onClose={() => setActiveCampaign(null)} />
      <Footer content={content} />
    </div>
  );
};

export default Campaigns;