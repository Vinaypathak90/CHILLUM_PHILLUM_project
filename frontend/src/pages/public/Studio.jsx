import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import StudioSection from '../../components/StudioSection';
import ModalsContainer from '../../components/ModalsContainer';

const Studio = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStudio, setActiveStudio] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  // 🔥 NAYA STATE: View All control karne ke liye
  const [showAllCaps, setShowAllCaps] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);

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
        console.error("Error fetching studio content:", err);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // 2. Custom 3D Tilt Effect
  const applyTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
  };

  const removeTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl bg-[#f7f4ef] text-[#1a1a1a] font-bold font-['Bebas_Neue']">
        Loading The Studio...
      </div>
    );
  }

  // 3. Backend Fallbacks
  const studioData = content?.studio || {};
  
  const capabilities = studioData.capabilities?.length > 0 ? studioData.capabilities : [
    { icon: "📹", title: "Video Production", image: "https://images.unsplash.com/photo-1518131672697-611eb14bf8f6?w=800&q=80", items: ["4K & 8K cinematography", "Drone footage & aerial shots", "Multi-camera productions", "Live event coverage"] },
    { icon: "📸", title: "Photography", image: "https://images.unsplash.com/photo-1554046920-90dcac824b22?w=800&q=80", items: ["Professional studio shoots", "On-location photography", "Product & commercial photography", "High-speed photography"] },
    { icon: "🎬", title: "Post Production", image: "https://images.unsplash.com/photo-1536240478700-b8600115ebfb?w=800&q=80", items: ["Color grading & correction", "VFX & motion graphics", "Sound design & mixing", "Video editing & assembly"] },
    // Extra demo items to show "View All" functionality
    { icon: "🎙️", title: "Sound Design", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80", items: ["Foley artistry", "Voiceover recording", "Podcast production", "Surround sound mixing"] },
    { icon: "✍️", title: "Scriptwriting", image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80", items: ["Concept ideation", "Storyboarding", "Dialogue writing", "Pitch deck creation"] }
  ];

  const processSteps = studioData.processSteps?.length > 0 ? studioData.processSteps : [
    { step: "1", title: "Discovery & Planning", desc: "Understanding your vision, goals, and target audience in detail." },
    { step: "2", title: "Concept Development", desc: "Creative brainstorming and storyboarding for your project." },
    { step: "3", title: "Production", desc: "High-quality execution with professional crew and equipment." },
    { step: "4", title: "Post Production", desc: "Editing, effects, color grading, and final delivery in all formats." }
  ];

  const techStack = studioData.techStack?.length > 0 ? studioData.techStack : [
    { title: "Adobe Suite", desc: "Premiere, AfterEffects, Photoshop", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80" },
    { title: "DaVinci Resolve", desc: "Professional color grading", image: "https://images.unsplash.com/photo-1588693899738-f1c5c0a373b7?w=800&q=80" },
    { title: "Cinema 4D", desc: "3D animation & motion graphics", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
    { title: "Red Cameras", desc: "Professional cinema cameras", image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800&q=80" },
    // Extra demo items
    { title: "Unreal Engine", desc: "High-end 3D environments", image: "https://images.unsplash.com/photo-1605342205561-1205391219b2?w=800&q=80" },
    { title: "Arri Alexa", desc: "Industry standard cinema tech", image: "https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=800&q=80" }
  ];

  // 🔥 SLICE LOGIC: Determine how many items to show based on state
  const displayedCapabilities = showAllCaps ? capabilities : capabilities.slice(0, 3);
  const displayedTechStack = showAllTech ? techStack : techStack.slice(0, 4);

  return (
    <div className="bg-[#f7f4ef] text-[#1a1a1a] font-['DM_Sans'] overflow-x-hidden">
      <Navbar navData={content?.nav} />

      <HeroSection content={content} onImageClick={setActiveImage} onSpotlight={() => {}} />

      <StudioSection content={content} onStudioClick={setActiveStudio} onApplyTilt={applyTilt} onRemoveTilt={removeTilt} />

      {/* ── CAPABILITIES (With View All & Lazy Load) ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">
          {studioData.capabilitiesLabel || 'Studio Capabilities'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {studioData.capabilitiesTitleMain || 'State-of-the-art'} <em className="italic text-[#b5862a]">{studioData.capabilitiesTitleHighlight || 'Equipment & Technology'}</em>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 mt-12 justify-center transition-all duration-500">
          {displayedCapabilities.map((cap, i) => (
            <div 
              key={i} 
              className="relative overflow-hidden rounded-xl h-[450px] group shadow-lg w-full animate-[fadeUp_0.5s_ease-out_forwards]"
            >
              {/* 🔥 IMAGE LOAD BALANCING (loading="lazy" & decoding="async") 🔥 */}
              <img 
                src={cap.image || cap.img} 
                alt={cap.title} 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-[#e8e4dc]"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>

              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full translate-y-[60%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-xl">
                  <h3 className="text-xl mb-3 text-white font-semibold drop-shadow-md flex items-center gap-2">
                    <span>{cap.icon}</span> {cap.title}
                  </h3>
                  <ul className="text-white/90 leading-[2] text-[0.9rem] list-disc list-inside opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {cap.items.map((item, idx) => (
                      <li key={idx} className="truncate">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 VIEW ALL BUTTON FOR CAPABILITIES 🔥 */}
        {capabilities.length > 3 && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setShowAllCaps(!showAllCaps)}
              className="px-8 py-3 border-2 border-[#b5862a] text-[#b5862a] font-semibold text-[0.8rem] tracking-[0.2em] uppercase hover:bg-[#b5862a] hover:text-white transition-all duration-300 rounded-sm"
            >
              {showAllCaps ? 'View Less' : 'View All Capabilities'}
            </button>
          </div>
        )}
      </section>

      {/* ── OUR PROCESS ── */}
      <section className="bg-gradient-to-br from-[#f0ece4] to-[#e8e2d8] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">
          {studioData.processLabel || 'Our Process'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {studioData.processTitleMain || 'From'} <em className="italic text-[#b5862a]">{studioData.processTitleHighlight || 'Concept to Delivery'}</em>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mt-12 justify-center">
          {processSteps.map((step, i) => (
            <div key={i} className="text-center group w-full">
              <div className="w-[60px] h-[60px] bg-[#b5862a] rounded-full mx-auto mb-4 flex items-center justify-center font-['Bebas_Neue'] text-2xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(181,134,42,0.6)]">
                {step.step || (i + 1)}
              </div>
              <h3 className="text-[1rem] mb-2 text-[#1a1a1a] font-medium">{step.title}</h3>
              <p className="text-[#555] text-[0.9rem] leading-relaxed px-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECHNOLOGY STACK (With View All & Lazy Load) ── */}
      <section className="bg-[#f5f1eb] py-28 px-6 md:px-12">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-[#b5862a] mb-4">
          {studioData.techStackLabel || 'Technology Stack'}
        </span>
        <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15]">
          {studioData.techStackTitleMain || 'Industry-Leading'} <em className="italic text-[#b5862a]">{studioData.techStackTitleHighlight || 'Tools & Software'}</em>
        </h2>
        <p className="text-[#555] text-[0.95rem] leading-[1.8] max-w-[700px] mt-6 mb-12">
          {studioData.techStackDescription || "We utilize the latest in creative production software and hardware to ensure your project benefits from cutting-edge technology and superior creative capabilities."}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 justify-center transition-all duration-500">
          {displayedTechStack.map((tech, i) => (
            <div 
              key={i} 
              className="relative overflow-hidden h-[250px] rounded-lg group cursor-pointer shadow-md w-full animate-[fadeUp_0.5s_ease-out_forwards]"
            >
              {/* 🔥 IMAGE LOAD BALANCING 🔥 */}
              <img 
                src={tech.image || tech.img} 
                alt={tech.title} 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0 bg-[#e8e4dc]"
              />
              <div className="absolute inset-0 bg-black/60 transition-colors duration-300 group-hover:bg-[#b5862a]/70 mix-blend-multiply"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 transition-transform duration-300 group-hover:-translate-y-2">
                <p className="font-['Bebas_Neue'] text-3xl tracking-wide text-white mb-2 drop-shadow-md">
                  {tech.title}
                </p>
                <p className="text-white/90 text-[0.85rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  {tech.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 VIEW ALL BUTTON FOR TECH STACK 🔥 */}
        {techStack.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setShowAllTech(!showAllTech)}
              className="px-8 py-3 border-2 border-[#b5862a] text-[#b5862a] font-semibold text-[0.8rem] tracking-[0.2em] uppercase hover:bg-[#b5862a] hover:text-white transition-all duration-300 rounded-sm"
            >
              {showAllTech ? 'View Less' : 'Explore All Tech'}
            </button>
          </div>
        )}
      </section>

      <Footer content={content} />

      <ModalsContainer
        activeImage={activeImage}
        activeProject={null}
        activeTeam={null}
        activeStudio={activeStudio}
        activeCampaign={null}
        onClose={() => {
          setActiveImage(null);
          setActiveStudio(null);
        }}
      />
    </div>
  );
};

export default Studio;