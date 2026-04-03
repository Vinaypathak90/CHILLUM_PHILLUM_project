import React from 'react';
import SectionHeader from './SectionHeader';

const CampaignsSection = ({ campaigns, onCampaignClick }) => {
  return (
    <section id="news">
      <div className="news-header">
        <SectionHeader label="Latest Updates" titleMain="Our" titleHighlight="Campaigns" align="left" />
        <a style={{textAlign: 'center'}} href="#contact" className="btn-gold">Collaborate</a>
      </div>
      <div className="news-grid">
        {campaigns.filter(c => c.isPublished !== false).map((camp) => (
          <div className="news-card" key={camp._id} onClick={() => onCampaignClick(camp)}>
            <div className="news-img"><img src={camp.imageUrl} alt={camp.title} /></div>
            <span className="news-date">{camp.dateString}</span>
            <h3 className="news-title">{camp.title}</h3>
            <p className="news-excerpt">{camp.excerpt}</p>
            <span className="news-read" style={{cursor:'pointer'}}>Read More →</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CampaignsSection;
