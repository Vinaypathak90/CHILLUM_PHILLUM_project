import React from 'react';

const Navbar = ({ navData }) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Reset error state if the logo image source changes
    setImgFailed(false);
  }, [navData?.logoImage]);

  React.useEffect(() => {
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={isMenuOpen ? 'menu-open' : ''}>
      <div className="nav-top">
        <a href="#home" className="nav-logo">
          {!imgFailed && (
            <img
              src={navData?.logoImage || "/logo.png"}
              alt="Chillum Phillum"
              onError={() => setImgFailed(true)}
            />
          )}
          {imgFailed && <span>{navData?.logoText || "CHILLUM PHILLUM"}</span>}
        </a>

        {/* Desktop links */}
        <ul className="nav-links desktop-links">
          <li><a href="/about">About</a></li>
          <li><a href="/studio">The Studio</a></li>
          <li><a href="/team">Our Team</a></li>
          <li><a href="/projects">Our Projects</a></li>
          <li><a href="/campaigns">Our Campaigns</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        {/* Hamburger button */}
        <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="mobile-nav">
        <ul className="nav-links">
          <li><a href="/about" onClick={handleLinkClick}>About</a></li>
          <li><a href="/studio" onClick={handleLinkClick}>The Studio</a></li>
          <li><a href="/team" onClick={handleLinkClick}>Our Team</a></li>
          <li><a href="/projects" onClick={handleLinkClick}>Our Projects</a></li>
          <li><a href="/campaigns" onClick={handleLinkClick}>Our Campaigns</a></li>
          <li><a href="/contact" onClick={handleLinkClick}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
