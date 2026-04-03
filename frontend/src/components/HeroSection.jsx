import React from 'react';

const HeroSection = ({ content, onImageClick, onSpotlight }) => {
  const heroImages = (content.hero?.backgroundImages || []).filter(img => img.trim() !== '');
  const fallbackHero = ["https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80", "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"];
  const displayHeroImages = heroImages.length > 0 ? heroImages : fallbackHero;

  return (
    <section id="home" onMouseMove={onSpotlight}>
      <div className="hero-strip" aria-hidden="true">
        <div className="hero-strip-track">
          {[...displayHeroImages, ...displayHeroImages, ...displayHeroImages].map((img, i) => (
            <div className="hero-strip-item" key={i} onClick={() => onImageClick(img)} style={{cursor: 'pointer'}}>
              <img src={img} alt="Hero Background"/>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-overlay" aria-hidden="true"></div>
      <div className="hero-content">
        <p className="hero-eyebrow">{content.hero?.eyebrow || 'Est. · Creative Production Studio'}</p>
        <h1 className="hero-title">
          {content.hero?.titleMain || 'WHERE IT IS'}
          <span>{content.hero?.titleHighlight || 'Always Buzzing'}</span>
        </h1>
        <p className="hero-sub">{content.hero?.subtitle || 'Film · Production · Advertising · Photography'}</p>
        <div className="hero-cta">
          <a href="#projects" className="btn-gold">Our Projects</a>
          <a href="#about" className="btn-outline" style={{backgroundColor: '#757575', border: '2px solid var(--gold)', color: '#ffff'}}>Learn More</a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true"><div className="scroll-line"></div><span>Scroll</span></div>
    </section>
  );
};

export default HeroSection;
