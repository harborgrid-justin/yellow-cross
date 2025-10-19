import React from 'react';
import { Link } from 'react-router-dom';
import { subFeaturesData } from '../../shared/utils/featuresData';

const FinancialServicesPage: React.FC = () => {
  const subFeatures = subFeaturesData['financial-services'] || [];

  return (
    <div className="feature-page">
      <div className="feature-hero">
        <div className="container">
          <div className="feature-hero-content">
            <i className="fas fa-university feature-icon"></i>
            <h1>Financial Services</h1>
            <p className="feature-subtitle">
              Banking, finance, and regulatory compliance
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
                to={`/features/financial-services/${subFeature.slug}`}
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
          <h2>Get Started with Financial Services</h2>
          <p>Ready to streamline your financial services?</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Start Free Trial</Link>
            <a href="#" className="btn btn-secondary">Schedule Demo</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FinancialServicesPage;
