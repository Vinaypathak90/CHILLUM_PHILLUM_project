import React from 'react';

const ModalsContainer = ({
  activeImage,
  activeProject,
  activeTeam,
  activeStudio,
  activeCampaign,
  onClose
}) => {
  return (
    <>
      {/* 1. HERO / ABOUT IMAGE LIGHTBOX */}
      <div className={`modal-overlay bg-blur-dark ${activeImage ? 'active' : ''}`} onClick={onClose}>
        <button className="modal-close-btn light" onClick={onClose}>×</button>
        {activeImage && (
          <div className="pop-content" onClick={(e) => e.stopPropagation()}>
            <img src={activeImage} className="hero-lightbox-img" alt="Enlarged view" />
          </div>
        )}
      </div>

      {/* 2. PROJECT POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeProject ? 'active' : ''}`} onClick={onClose}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {activeProject && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeProject.imageUrl} alt={activeProject.title} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">{activeProject.category}</span>
              <h3 className="modal-title">{activeProject.title}</h3>
              <p className="modal-desc">{activeProject.detailedDescription || activeProject.shortDescription || activeProject.description}</p>
              <button className="btn-gold" style={{alignSelf: 'flex-start'}} onClick={onClose}>Close Details</button>
            </div>
          </div>
        )}
      </div>

      {/* 3. TEAM POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeTeam ? 'active' : ''}`} onClick={onClose}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {activeTeam && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeTeam.photoUrl} alt={activeTeam.name} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">{activeTeam.role}</span>
              <h3 className="modal-title">{activeTeam.name}</h3>
              <p className="modal-desc">{activeTeam.bio || "Bringing unmatched creativity and expertise to Chillum Phillum. Ensuring every frame and concept is executed flawlessly."}</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. STUDIO POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeStudio ? 'active' : ''}`} onClick={onClose}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {activeStudio && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeStudio.image} alt={activeStudio.label} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">The Chillum Phillum Way</span>
              <h3 className="modal-title">{activeStudio.label}</h3>
              <p className="modal-desc">{activeStudio.description || `Our dedicated team combines cinematic vision with top-tier craft in ${activeStudio.label}. We work tirelessly to ensure the highest quality output.`}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. CAMPAIGN POPUP */}
      <div className={`modal-overlay bg-blur-dark ${activeCampaign ? 'active' : ''}`} onClick={onClose}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {activeCampaign && (
          <div className="pop-content modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-col"><img src={activeCampaign.imageUrl} alt={activeCampaign.title} /></div>
            <div className="modal-text-col">
              <span className="modal-meta">{activeCampaign.dateString}</span>
              <h3 className="modal-title" style={{fontSize: '2rem'}}>{activeCampaign.title}</h3>
              <p className="modal-desc">{activeCampaign.detailedContent || activeCampaign.excerpt}</p>
              {activeCampaign.readMoreLink && activeCampaign.readMoreLink !== '#' && (
                <a href={activeCampaign.readMoreLink} target="_blank" rel="noreferrer" className="btn-gold" style={{alignSelf: 'flex-start'}}>Read Full Article</a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ModalsContainer;
