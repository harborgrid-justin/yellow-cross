import React from 'react';
import { Link } from 'react-router-dom';
import { subFeaturesData } from '../../shared/utils/featuresData';

const EducationLawPage: React.FC = () => {
  const subFeatures = subFeaturesData['education-law'] || [];

  return (
    <div className="feature-page">
      <div className="feature-hero">
        <div className="container">
          <div className="feature-hero-content">
            <i className="fas fa-graduation-cap feature-icon"></i>
            <h1>Education Law</h1>
            <p className="feature-subtitle">
              Education law compliance and student matters
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
                to={`/features/education-law/${subFeature.slug}`}
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
          <h2>Get Started with Education Law</h2>
          <p>Ready to streamline your education law?</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Start Free Trial</Link>
            <a href="#" className="btn btn-secondary">Schedule Demo</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EducationLawPage;
