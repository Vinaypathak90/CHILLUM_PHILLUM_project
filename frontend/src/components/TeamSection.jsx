import React, { useState } from 'react';
import SectionHeader from './SectionHeader';

const TeamSection = ({ team = [], onTeamClick }) => {
  // 🔥 1. VIEW ALL STATE
  const [showAll, setShowAll] = useState(false);

  // 🔥 2. LOGIC: Images choti hain toh default 4 dikhate hain (pehle 3 the)
  const displayedTeam = showAll ? team : team.slice(0, 4);

  return (
    <section id="team" className="relative py-28 px-6 md:px-12 bg-gradient-to-b from-[#ebe6de] to-[#f0ece4] overflow-hidden">
      
      {/* Background Decorative Element */}
      <div 
        className="absolute -bottom-[100px] -left-[100px] w-[500px] h-[500px] rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(181,134,42,0.06) 0%, transparent 70%)' }}
      ></div>

      <div className="relative z-10 mb-16">
        <SectionHeader label="Our People" titleMain="Meet the" titleHighlight="Creative Team" align="left" />
      </div>

      {/* ── TEAM GRID (Tailwind 4-Columns for smaller images) ── */}
      {/* NAYA: sm:grid-cols-2, md:grid-cols-3, lg:grid-cols-4 kar diya hai */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-500 justify-items-center">
        {displayedTeam.length > 0 ? (
          displayedTeam.map((member, index) => (
            <div 
              // 🔥 NAYA: max-w-[240px] aur mx-auto lagaya taaki image ek limit se zyada badi na ho
              className="text-center group hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out pb-4 rounded-lg cursor-pointer animate-[fadeUp_0.5s_ease-out_forwards] w-full max-w-[240px] mx-auto" 
              key={member._id || index} 
              onClick={() => onTeamClick?.(member)}
            >
              {/* Photo Container */}
              <div className="relative overflow-hidden mb-4 aspect-[3/4] rounded-t-lg">
                <img 
                  src={member.photoUrl || member.image} 
                  alt={member.name} 
                  loading="lazy"
                  className="w-full h-full object-cover object-top grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out bg-[#e8e4dc]"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-[#0a0a0a]/15 to-transparent z-10 opacity-100 group-hover:opacity-50 transition-opacity duration-400"></div>
              </div>
              
              <p className="font-['Playfair_Display'] text-[1.05rem] text-[#1a1a1a] mb-1 transition-colors duration-300 group-hover:text-[#b5862a] px-2 font-bold">
                {member.name}
              </p>
              <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[#b5862a] px-2 font-medium">
                {member.role}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[#888] italic col-span-full">Team members will appear here.</p>
        )}
      </div>

      {/* ── VIEW ALL BUTTON ── */}
      {/* Agar 4 se zyada log hain tabhi button aayega */}
      {team.length > 4 && (
        <div className="relative z-10 mt-12 flex justify-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 border-2 border-[#b5862a] text-[#b5862a] font-semibold text-[0.8rem] tracking-[0.2em] uppercase hover:bg-[#b5862a] hover:text-white transition-all duration-300 rounded-sm"
          >
            {showAll ? 'View Less' : 'View All Members'}
          </button>
        </div>
      )}

    </section>
  );
};

export default TeamSection;