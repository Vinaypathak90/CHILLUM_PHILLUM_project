import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ navData }) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    // Reset error state if the logo image source changes
    setImgFailed(false);
  }, [navData?.logoImage]);

  React.useEffect(() => {
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  React.useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={isMenuOpen ? 'menu-open' : ''}>
      <div className="nav-top">
        <Link to="/" className="nav-logo">
          {!imgFailed && (
            <img
              src={navData?.logoImage || "/logo.png"}
              alt="Chillum Phillum"
              onError={() => setImgFailed(true)}
            />
          )}
          {imgFailed && <span>{navData?.logoText || "CHILLUM PHILLUM"}</span>}
        </Link>

        {/* Desktop links */}
        <ul className="nav-links desktop-links">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link></li>
          <li><Link to="/studio" className={isActive('/studio') ? 'active' : ''}>The Studio</Link></li>
          <li><Link to="/team" className={isActive('/team') ? 'active' : ''}>Our Team</Link></li>
          <li><Link to="/projects" className={isActive('/projects') ? 'active' : ''}>Our Projects</Link></li>
          <li><Link to="/campaigns" className={isActive('/campaigns') ? 'active' : ''}>Our Campaigns</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
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
          <li><Link to="/" onClick={handleLinkClick} className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/about" onClick={handleLinkClick} className={isActive('/about') ? 'active' : ''}>About</Link></li>
          <li><Link to="/studio" onClick={handleLinkClick} className={isActive('/studio') ? 'active' : ''}>The Studio</Link></li>
          <li><Link to="/team" onClick={handleLinkClick} className={isActive('/team') ? 'active' : ''}>Our Team</Link></li>
          <li><Link to="/projects" onClick={handleLinkClick} className={isActive('/projects') ? 'active' : ''}>Our Projects</Link></li>
          <li><Link to="/campaigns" onClick={handleLinkClick} className={isActive('/campaigns') ? 'active' : ''}>Our Campaigns</Link></li>
          <li><Link to="/contact" onClick={handleLinkClick} className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
