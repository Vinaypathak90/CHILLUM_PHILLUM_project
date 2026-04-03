import React from 'react';

const SectionHeader = ({ label, titleMain, titleHighlight, titleEnd, align = 'left' }) => (
  <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start' }}>
    <span className="section-label">{label}</span>
    <h2 className="section-title" style={{ maxWidth: align === 'center' ? '100%' : '680px', margin: 0 }}>
      {titleMain} <em>{titleHighlight}</em> {titleEnd}
    </h2>
  </div>
);

export default SectionHeader;
