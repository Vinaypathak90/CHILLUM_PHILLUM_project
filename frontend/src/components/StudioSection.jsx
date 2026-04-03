import React from 'react';
import SectionHeader from './SectionHeader';

const StudioSection = ({ content, onStudioClick, onApplyTilt, onRemoveTilt }) => {
  return (
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
          <div 
            className="studio-card" 
            key={i} 
            onClick={() => onStudioClick(card)} 
            onMouseMove={(e) => onApplyTilt(e, 6)} 
            onMouseLeave={onRemoveTilt}
          >
            <img src={card.image} alt={card.label} />
            <span className="studio-card-label">{card.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudioSection;
