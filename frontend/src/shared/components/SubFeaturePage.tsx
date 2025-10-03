import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { subFeaturesData, featuresData } from '../utils/featuresData';
import type { SubFeature } from '../types/index';

const SubFeaturePage: React.FC = () => {
  const { subFeature } = useParams<{ subFeature: string }>();
  const currentPath = window.location.pathname;
  const featureSlug = currentPath.split('/')[2]; // Extract feature slug from URL
  
  const feature = featuresData.find(f => f.slug === featureSlug);
  const subFeatures: SubFeature[] = (featureSlug && subFeaturesData[featureSlug as keyof typeof subFeaturesData]) || [];
  const currentSubFeature = subFeatures.find((sf: SubFeature) => sf.slug === subFeature);

  if (!currentSubFeature || !feature) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="sub-feature-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/features/${featureSlug}`}>{feature.name}</Link>
          <span>/</span>
          <span>{currentSubFeature.name}</span>
        </div>
      </div>

      {/* Sub-feature Content */}
      <div className="sub-feature-hero">
        <div className="container">
          <div className="sub-feature-hero-content">
            <span className="sub-feature-category">{feature.name}</span>
            <h1>{currentSubFeature.name}</h1>
            <p className="sub-feature-description">{currentSubFeature.description}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="sub-feature-content">
          {/* Overview Section */}
          <section className="content-section">
            <h2>Overview</h2>
            <p>
              The {currentSubFeature.name} feature provides comprehensive tools and capabilities to help your law firm 
              manage this critical aspect of your practice. Built with enterprise-grade reliability and security, 
              this feature integrates seamlessly with other Yellow Cross modules.
            </p>
          </section>

          {/* Key Features */}
          <section className="content-section">
            <h2>Key Features</h2>
            <div className="features-list">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Enterprise-grade Security</h4>
                  <p>Bank-level encryption and security protocols to protect sensitive data</p>
                </div>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Real-time Collaboration</h4>
                  <p>Work together with your team in real-time with instant updates</p>
                </div>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Advanced Automation</h4>
                  <p>Automate routine tasks and workflows to save time and reduce errors</p>
                </div>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Comprehensive Reporting</h4>
                  <p>Generate detailed reports and analytics for better decision making</p>
                </div>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Mobile Access</h4>
                  <p>Access your data from anywhere on any device</p>
                </div>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>API Integration</h4>
                  <p>Connect with third-party tools and services via our robust API</p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="content-section">
            <h2>Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <i className="fas fa-clock"></i>
                <h4>Save Time</h4>
                <p>Automate repetitive tasks and streamline workflows</p>
              </div>
              <div className="benefit-card">
                <i className="fas fa-dollar-sign"></i>
                <h4>Reduce Costs</h4>
                <p>Eliminate inefficiencies and optimize resource allocation</p>
              </div>
              <div className="benefit-card">
                <i className="fas fa-chart-line"></i>
                <h4>Improve Productivity</h4>
                <p>Empower your team with better tools and insights</p>
              </div>
              <div className="benefit-card">
                <i className="fas fa-shield-alt"></i>
                <h4>Ensure Compliance</h4>
                <p>Stay compliant with industry regulations and standards</p>
              </div>
            </div>
          </section>

          {/* Related Features */}
          <section className="content-section">
            <h2>Related Features</h2>
            <div className="related-features">
              {subFeatures
                .filter((sf: SubFeature) => sf.slug !== subFeature)
                .slice(0, 3)
                .map((sf: SubFeature) => (
                  <Link
                    key={sf.slug}
                    to={`/features/${featureSlug}/${sf.slug}`}
                    className="related-feature-card"
                  >
                    <h4>{sf.name}</h4>
                    <p>{sf.description}</p>
                  </Link>
                ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="sub-feature-cta">
            <h2>Ready to Get Started?</h2>
            <p>Try {currentSubFeature.name} and see how it can transform your practice</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">Start Free Trial</Link>
              <a href="#" className="btn btn-secondary">Schedule Demo</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SubFeaturePage;
