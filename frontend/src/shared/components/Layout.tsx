import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { featuresData } from '../utils/featuresData';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-layout">
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="nav-brand">
            <Link to="/">
              <i className="fas fa-balance-scale"></i>
              <span>Yellow Cross</span>
            </Link>
          </div>
          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} role="menubar">
            <li role="none"><Link to="/" role="menuitem">Home</Link></li>
            <li role="none" className="dropdown">
              <a href="#" role="menuitem" aria-haspopup="true">Features</a>
              <ul className="dropdown-menu">
                {featuresData.map((feature) => (
                  <li key={feature.slug}>
                    <Link to={`/features/${feature.slug}`}>{feature.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
            {isAuthenticated ? (
              <>
                <li role="none" className="dropdown">
                  <a href="#" role="menuitem" aria-haspopup="true">
                    <i className="fas fa-user"></i> {user?.firstName || user?.username}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
                  </ul>
                </li>
              </>
            ) : (
              <li role="none"><Link to="/login" className="btn-login" role="menuitem">Login</Link></li>
            )}
          </ul>
          <button 
            className="hamburger" 
            aria-label="Toggle navigation menu" 
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Yellow Cross</h4>
              <p>Enterprise-grade law firm practice management platform</p>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                {featuresData.slice(0, 9).map((feature) => (
                  <li key={feature.slug}>
                    <Link to={`/features/${feature.slug}`}>{feature.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Yellow Cross. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
