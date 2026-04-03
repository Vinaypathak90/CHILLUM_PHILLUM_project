import React from 'react';

const ClientSliderSection = ({ clients, loading }) => {
  if (loading || clients.length === 0) return null;

  return (
    <div className="client-slider-wrapper">
      <div className="client-slider-header">
        <span className="section-eyebrow">Collaborations &amp; Clientele</span>
        <h3>Trusted by <em>Iconic</em> Brands</h3>
        <div className="header-divider"></div>
        <p>Companies we have collaborated with</p>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="slider-fade-left"></div>
        <div className="slider-fade-right"></div>

        <div className="slider-container">
          <div className="slider-track">
            {/* Set 1 */}
            {clients.map((client) => (
              <div className="slide" key={`a-${client._id}`}>
                <img src={client.logoUrl} alt={client.name} loading="lazy" />
              </div>
            ))}
            {/* Set 2 */}
            {clients.map((client) => (
              <div className="slide" key={`b-${client._id}`}>
                <img src={client.logoUrl} alt={client.name} loading="lazy" />
              </div>
            ))}
            {/* Set 3 */}
            {clients.map((client) => (
              <div className="slide" key={`c-${client._id}`}>
                <img src={client.logoUrl} alt={client.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSliderSection;
