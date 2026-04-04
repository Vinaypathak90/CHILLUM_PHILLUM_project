import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import ContactSection from '../../components/ContactSection';


const Contact = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [btnText, setBtnText] = useState('Send Message');
  const [btnState, setBtnState] = useState('default'); // default, sending, success
  
  // Toggle States
  const [activeFaq, setActiveFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/page-content`);
        if (res.data.success) setContent(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching content:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setBtnText('Sending...');
    setBtnState('sending');
    
    try {
      // In real app, send to backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBtnText('Sent! ✓');
      setBtnState('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => {
        setBtnText('Send Message');
        setBtnState('default');
      }, 3000);
    } catch (err) {
      setBtnText('Error Sending');
      setBtnState('default');
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-2xl bg-[#f7f4ef] text-[#1a1a1a] font-bold font-['Bebas_Neue'] tracking-widest">Loading Contact...</div>;

  // ─── EXTRACT BACKEND DATA & FALLBACKS ───
  const pageData = content?.contactPage || {};

  const locations = pageData.locations?.length > 0 ? pageData.locations : [
    { title: '📍 Mumbai Studio', address: 'Bandra West, Mumbai - 400050', phone: '+91 22 1234 5678', hours: 'Mon-Fri: 10 AM - 7 PM' },
    { title: '📍 Delhi Office', address: 'Connaught Place, New Delhi - 110001', phone: '+91 11 1234 5678', hours: 'Mon-Fri: 10 AM - 7 PM' },
    { title: '📍 Bangalore Hub', address: 'Whitefield, Bangalore - 560066', phone: '+91 80 1234 5678', hours: 'Mon-Fri: 10 AM - 7 PM' }
  ];

  const faqs = pageData.faqs?.length > 0 ? pageData.faqs : [
    { question: '💬 What is your typical project timeline?', answer: 'Project timelines vary based on scope, but typically range from 2-8 weeks. We discuss timelines during the discovery phase.' },
    { question: '💬 Do you work with international clients?', answer: 'Absolutely! We\'ve worked with clients across Europe, USA, and Asia. Remote collaboration is seamless with our workflow.' },
    { question: '💬 What file formats do you deliver?', answer: 'We deliver in all standard formats: ProRes, DNxHD, MP4, MOV, and more. Format is determined based on your platform requirements.' },
    { question: '💬 Can we schedule a consultation?', answer: 'Yes! Fill out the form above or call us directly. We offer free consultations to discuss your creative needs.' }
  ];

  const services = pageData.services?.length > 0 ? pageData.services : [
    { icon: '🎬', title: 'Video Production', desc: 'Concept to final delivery' },
    { icon: '📸', title: 'Photography', desc: 'Commercial & creative' },
    { icon: '🎨', title: 'Design & Animation', desc: 'Motion graphics & VFX' },
    { icon: '🎙️', title: 'Audio Production', desc: 'Sound design & mixing' },
    { icon: '📽️', title: 'Post Production', desc: 'Editing & color grading' },
    { icon: '🎯', title: 'Strategy & Consulting', desc: 'Creative direction' }
  ];

  // Logic to show limited vs all items
  const displayedFaqs = showAllFaqs ? faqs : faqs.slice(0, 3);
  const displayedServices = showAllServices ? services : services.slice(0, 3);

  return (
    <div className="bg-[#f7f4ef] text-[#1a1a1a] font-['DM_Sans'] overflow-x-hidden selection:bg-[#b5862a] selection:text-white">
      <Navbar navData={content?.nav} />

      {/* ── HERO SECTION ── */}
        <HeroSection content={content} />

      {/* ────────────────────────────────────────────────────────────────
          🔥 SECTION 1: CONTACT FORM (COMPLETELY SEPARATE) 🔥
          ──────────────────────────────────────────────────────────────── */}
        <ContactSection content={content} formData={formData} onFormChange={handleFormChange} onFormSubmit={handleFormSubmit} btnText={btnText} btnState={btnState} />
        

      {/* ────────────────────────────────────────────────────────────────
          🔥 SECTION 2: THICKER MAP (COMPLETELY SEPARATE & DISTINCT) 🔥
          ──────────────────────────────────────────────────────────────── */}
      {pageData.mapEmbedCode && (
        <section className="w-full bg-[#f7f4ef] pt-0" style={{ height: pageData.mapHeight || '600px' }}>
          <div 
            className="w-full h-full grayscale-[25%] hover:grayscale-0 transition-all duration-700 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0" 
            dangerouslySetInnerHTML={{ __html: pageData.mapEmbedCode }} 
          />
        </section>
      )}

      {/* ── OUR LOCATIONS ── */}
      <section className="relative bg-gradient-to-br from-[#f5f1eb] via-[#f7f4ef] to-[#f5f1eb] py-32 px-6 md:px-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#b5862a]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#b5862a]/3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4 text-left font-bold">
            {pageData.locationsLabel || 'Our Locations'}
          </span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] text-left mb-16">
            {pageData.locationsTitleMain || 'Where to'} <em className="italic text-[#b5862a]">{pageData.locationsTitleHighlight || 'Find Us'}</em>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
            {locations.map((loc, i) => (
              <div 
                key={i} 
                className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(181,134,42,0.25)] border border-white/30 backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#b5862a]/10 via-transparent to-[#b5862a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <h3 className="text-[1.15rem] mb-6 text-[#b5862a] font-bold flex items-center gap-3 group-hover:text-[#d4a84b] transition-colors">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{loc.title.charAt(0)}</span>
                    {loc.title}
                  </h3>
                  
                  <div className="space-y-4 text-[0.95rem]">
                    <div className="flex gap-3">
                      <span className="text-[#b5862a] font-bold min-w-fit">📍</span>
                      <p className="text-[#555] leading-relaxed">{loc.address}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#b5862a] font-bold min-w-fit">📞</span>
                      <a href={`tel:${loc.phone}`} className="text-[#1a1a1a] font-medium hover:text-[#b5862a] transition-colors">
                        {loc.phone}
                      </a>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#b5862a] font-bold min-w-fit">🕐</span>
                      <p className="text-[#555]">{loc.hours}</p>
                    </div>
                  </div>
                </div>

                {/* Border Animation */}
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-[#b5862a]/20 via-[#b5862a]/10 to-[#b5862a]/5 group-hover:from-[#b5862a]/40 group-hover:via-[#b5862a]/20 group-hover:to-[#b5862a]/10 transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (WITH ACCORDION & SHOW ALL) ── */}
      <section className="relative bg-gradient-to-br from-[#f0ece4] via-[#e8e3da] to-[#f0ece4] py-32 px-6 md:px-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#b5862a]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#b5862a]/4 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto">
          <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4 font-bold text-center md:text-left">{pageData.faqLabel || 'FAQ'}</span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] mb-16 text-center md:text-left">
            {pageData.faqTitleMain || 'Common'} <em className="italic text-[#b5862a]">{pageData.faqTitleHighlight || 'Questions'}</em>
          </h2>
          
          <div className="bg-transparent space-y-4">
            {displayedFaqs.map((faq, i) => (
              <div 
                key={i}
                onClick={() => toggleFaq(i)}
                className="group cursor-pointer p-6 rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-md overflow-hidden"
                style={{
                  background: activeFaq === i 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  boxShadow: activeFaq === i 
                    ? '0 8px 32px 0 rgba(181,134,42,0.2), inset 0 1px 1px 0 rgba(255,255,255,0.3)'
                    : '0 8px 32px 0 rgba(31,38,135,0.08), inset 0 1px 1px 0 rgba(255,255,255,0.15)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#b5862a]/10 via-transparent to-[#b5862a]/5 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-[1rem] text-[#1a1a1a] font-bold group-hover:text-[#b5862a] transition-colors flex-1 pt-1">
                      {faq.question}
                    </h3>
                    <span className={`text-[#b5862a] text-2xl font-bold transition-all duration-400 flex-shrink-0 ${activeFaq === i ? 'rotate-45 scale-110' : 'rotate-0'}`}>
                      {activeFaq === i ? '−' : '+'}
                    </span>
                  </div>
                  
                  {/* 🔥 ENHANCED SMOOTH ACCORDION ANIMATION */}
                  <div className={`transition-all duration-500 overflow-hidden ${activeFaq === i ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#555] text-[0.95rem] leading-[1.8]">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-[#b5862a]/20 via-[#b5862a]/10 to-[#b5862a]/5 group-hover:from-[#b5862a]/40 group-hover:via-[#b5862a]/20 group-hover:to-[#b5862a]/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* 🔥 FAQ VIEW ALL BUTTON */}
          {faqs.length > 3 && (
            <div className="mt-16 text-center">
              <button 
                onClick={() => setShowAllFaqs(!showAllFaqs)}
                className="inline-block px-12 py-4 bg-transparent text-[#1a1a1a] border-2 border-[#b5862a] text-[0.75rem] font-bold tracking-[0.2em] uppercase hover:bg-[#b5862a] hover:text-white hover:shadow-[0_12px_35px_rgba(181,134,42,0.3)] transition-all duration-300 active:scale-95 hover:-translate-y-1"
              >
                {showAllFaqs ? '− View Less Questions' : `+ View All Questions (${faqs.length})`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── OUR SERVICES (WITH SHOW ALL BUTTON) ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12 text-left">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">{pageData.servicesLabel || 'Our Services'}</span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] mb-8">
          {pageData.servicesTitleMain || 'Comprehensive Creative'} <em className="italic text-[#b5862a]">{pageData.servicesTitleHighlight || 'Solutions'}</em>
        </h2>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mt-[2rem] max-w-7xl">
          {displayedServices.map((srv, i) => (
            <div key={i} className="p-[1.5rem] bg-white text-center rounded-[8px] shadow-sm hover:shadow-[0_8px_25px_rgba(181,134,42,0.15)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#b5862a]/20 group">
              <p className="font-bold text-[#1a1a1a] mb-[0.3rem] flex flex-col items-center gap-2 group-hover:text-[#b5862a] transition-colors">
                <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">{srv.icon}</span> 
                {srv.title}
              </p>
              <p className="text-[#888] text-[0.85rem]">{srv.desc}</p>
            </div>
          ))}
        </div>

        {/* 🔥 SERVICES VIEW ALL BUTTON */}
        {services.length > 3 && (
          <div className="mt-12 text-center md:text-left">
            <button 
              onClick={() => setShowAllServices(!showAllServices)}
              className="inline-block px-10 py-4 bg-transparent text-[#1a1a1a] border-2 border-[#b5862a] text-[0.75rem] font-bold tracking-[0.2em] uppercase hover:bg-[#b5862a] hover:text-[#1a1a1a] transition-all duration-300 active:scale-95 hover:-translate-y-1 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(181,134,42,0.25)] cursor-pointer"
            >
              {showAllServices ? 'View Less Services' : `View All Services (${services.length})`}
            </button>
          </div>
        )}
      </section>

      

      <Footer content={content} />
    </div>
  );
};

export default Contact;