import React from 'react';
import SectionHeader from './SectionHeader';

const AboutSection = ({ content, onImageClick }) => {
  const aboutParagraphs = content.about?.paragraphs?.length > 0 ? content.about.paragraphs : ["We combine cinematic vision with advertising craft and photography excellence..."];
  const displayStats = content.about?.stats?.length > 0 ? content.about.stats : [{ number: "50+", label: "PROJECTS" }, { number: "5+", label: "YEARS" }, { number: "30+", label: "CLIENTS" }];

  return (
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
          <div className="about-img" key={i} onClick={() => onImageClick(img)} style={{cursor: 'pointer'}}>
            <img src={img} alt="Studio"/>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
