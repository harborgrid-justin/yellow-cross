import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { featuresData } from '../../shared/utils/featuresData';
import type { Feature } from '../../shared/types/index';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" role="banner">
        <div className="container">
          <div className="hero-content">
            {isAuthenticated && user ? (
              <>
                <h1>Welcome back, {user.firstName || user.username}!</h1>
                <p className="hero-subtitle">
                  Access your law firm's practice management dashboard
                </p>
                <div className="hero-cta">
                  <Link to="/features/case-management" className="btn btn-primary btn-lg">
                    <i className="fas fa-briefcase"></i> Go to Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-lg">
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1>Enterprise Law Firm Practice Management</h1>
                <p className="hero-subtitle">
                  Comprehensive, full-featured platform designed for law firms to manage their practices effectively
                </p>
                <div className="hero-stats">
                  <div className="stat">
                    <h3>15</h3>
                    <p>Core Features</p>
                  </div>
                  <div className="stat">
                    <h3>120</h3>
                    <p>Sub-Features</p>
                  </div>
                  <div className="stat">
                    <h3>100%</h3>
                    <p>Cloud-Based</p>
                  </div>
                </div>
                <div className="hero-cta">
                  <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                  <a href="#features" className="btn btn-secondary btn-lg">Explore Features</a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Comprehensive Feature Set</h2>
          <p className="section-subtitle">
            Everything your law firm needs in one integrated platform
          </p>
          <div className="features-grid">
            {featuresData.map((feature: Feature) => (
              <Link
                key={feature.slug}
                to={`/features/${feature.slug}`}
                className="feature-card"
              >
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
                <span className="feature-count">{feature.subFeatureCount} sub-features</span>
                <span className="feature-link">
                  Explore <i className="fas fa-arrow-right"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Transform Your Practice?</h2>
            <p>Join thousands of law firms using Yellow Cross to streamline their operations</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
