import React from 'react';
import { Link } from 'react-router-dom';
import { subFeaturesData } from '../../shared/utils/featuresData';

const AppellatePracticePage: React.FC = () => {
  const subFeatures = subFeaturesData['appellate-practice'] || [];

  return (
    <div className="feature-page">
      <div className="feature-hero">
        <div className="container">
          <div className="feature-hero-content">
            <i className="fas fa-balance-scale-right feature-icon"></i>
            <h1>Appellate Practice</h1>
            <p className="feature-subtitle">
              Appellate briefs, oral arguments, and appeals
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="sub-features-section">
          <h2>Features & Capabilities</h2>
          <div className="sub-features-grid">
            {subFeatures.map((subFeature) => (
              <Link
                key={subFeature.id}
                to={`/features/appellate-practice/${subFeature.slug}`}
                className="sub-feature-card"
              >
                <div className="sub-feature-header">
                  <i className="fas fa-check-circle"></i>
                  <h3>{subFeature.name}</h3>
                </div>
                <p>{subFeature.description}</p>
                <span className="sub-feature-link">
                  Learn more <i className="fas fa-arrow-right"></i>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="feature-cta">
          <h2>Get Started with Appellate Practice</h2>
          <p>Ready to streamline your appellate practice?</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Start Free Trial</Link>
            <a href="#" className="btn btn-secondary">Schedule Demo</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppellatePracticePage;
