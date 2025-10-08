import fs from 'fs';
import path from 'path';

// Feature configurations
const features = [
  { name: 'Case Management System', slug: 'case-management', icon: 'fa-briefcase' },
  { name: 'Client Relationship Management', slug: 'client-crm', icon: 'fa-users' },
  { name: 'Document Management System', slug: 'document-management', icon: 'fa-folder-open' },
  { name: 'Time & Billing Management', slug: 'time-billing', icon: 'fa-clock' },
  { name: 'Calendar & Scheduling System', slug: 'calendar-scheduling', icon: 'fa-calendar-alt' },
  { name: 'Task & Workflow Management', slug: 'task-workflow', icon: 'fa-tasks' },
  { name: 'Legal Research & Knowledge Base', slug: 'legal-research', icon: 'fa-book' },
  { name: 'Court & Docket Management', slug: 'court-docket', icon: 'fa-gavel' },
  { name: 'Contract Management', slug: 'contract-management', icon: 'fa-file-contract' },
  { name: 'eDiscovery & Evidence Management', slug: 'ediscovery', icon: 'fa-search' },
  { name: 'Compliance & Risk Management', slug: 'compliance', icon: 'fa-shield-alt' },
  { name: 'Reporting & Analytics', slug: 'reporting-analytics', icon: 'fa-chart-bar' },
  { name: 'Communication & Collaboration', slug: 'communication', icon: 'fa-comments' },
  { name: 'Security & Access Control', slug: 'security', icon: 'fa-lock' },
  { name: 'Integration & API Management', slug: 'integration', icon: 'fa-plug' }
];

const subFeatures = {
  'case-management': [
    'creation-intake', 'tracking-status', 'assignment-distribution', 'timeline-management',
    'categorization-tagging', 'notes-updates', 'closing-archive', 'analytics-dashboard'
  ],
  'client-crm': [
    'database-management', 'communication-history', 'portal-access', 'intake-onboarding',
    'billing-information', 'conflict-checking', 'retention-feedback', 'relationship-analytics'
  ],
  'document-management': [
    'upload-storage', 'organization-indexing', 'templates-library', 'version-control',
    'search-retrieval', 'collaboration', 'security-permissions', 'automation'
  ],
  'time-billing': [
    'tracking-entry', 'billable-hours', 'invoice-generation', 'payment-processing',
    'expense-tracking', 'trust-accounting', 'rate-management', 'financial-reporting'
  ],
  'calendar-scheduling': [
    'court-dates', 'deadline-management', 'appointment-scheduling', 'attorney-availability',
    'reminders-notifications', 'calendar-sync', 'resource-scheduling', 'conflict-detection'
  ],
  'task-workflow': [
    'creation-assignment', 'workflow-automation', 'task-dependencies', 'priority-management',
    'task-templates', 'progress-tracking', 'team-collaboration', 'workflow-analytics'
  ],
  'legal-research': [
    'research-integration', 'knowledge-base', 'case-law-database', 'memoranda-library',
    'citation-management', 'precedent-tracking', 'research-collaboration', 'research-analytics'
  ],
  'court-docket': [
    'docket-management', 'electronic-filing', 'rules-procedures', 'hearing-preparation',
    'docket-monitoring', 'calendar-integration', 'filing-history', 'court-analytics'
  ],
  'contract-management': [
    'contract-drafting', 'review-approval', 'storage-organization', 'lifecycle-tracking',
    'obligation-management', 'renewal-expiration', 'contract-analytics', 'clause-library'
  ],
  'ediscovery': [
    'data-collection', 'review-platform', 'legal-hold', 'production-management',
    'privilege-review', 'evidence-organization', 'analytics-tar', 'ediscovery-reporting'
  ],
  'compliance': [
    'ethics-compliance', 'regulatory-compliance', 'risk-assessment', 'audit-trail',
    'policy-management', 'incident-management', 'compliance-reporting', 'training-certification'
  ],
  'reporting-analytics': [
    'financial-reports', 'performance-dashboards', 'case-analytics', 'attorney-productivity',
    'client-analytics', 'custom-reports', 'data-visualization', 'predictive-analytics'
  ],
  'communication': [
    'internal-messaging', 'email-integration', 'client-communication', 'video-conferencing',
    'document-sharing', 'communication-templates', 'notification-center', 'communication-analytics'
  ],
  'security': [
    'user-management', 'rbac', '2fa', 'data-encryption',
    'session-management', 'audit-logs', 'ip-whitelisting', 'security-reports'
  ],
  'integration': [
    'api-management', 'third-party', 'webhooks-events', 'data-import-export',
    'calendar-integration', 'accounting-integration', 'storage-integration', 'custom-integration'
  ]
};

// Generate main feature page template
function generateFeaturePage(feature) {
  const componentName = feature.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Page';
  
  return `import React from 'react';
import { Link } from 'react-router-dom';
import { subFeaturesData } from '../../../utils/featuresData';

const ${componentName}: React.FC = () => {
  const subFeatures = subFeaturesData['${feature.slug}'] || [];

  return (
    <div className="feature-page">
      <div className="feature-hero">
        <div className="container">
          <div className="feature-hero-content">
            <i className="fas ${feature.icon} feature-icon"></i>
            <h1>${feature.name}</h1>
            <p className="feature-subtitle">
              Comprehensive ${feature.name.toLowerCase()} tools and features for your law firm
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
                to={\`/features/${feature.slug}/\${subFeature.slug}\`}
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
          <h2>Get Started with ${feature.name}</h2>
          <p>Ready to streamline your ${feature.name.toLowerCase()}?</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Start Free Trial</Link>
            <a href="#" className="btn btn-secondary">Schedule Demo</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ${componentName};
`;
}

// Generate all feature pages
console.log('Generating React pages...');

features.forEach(feature => {
  const dirPath = path.join(__dirname, '../src/react/pages/features', feature.slug);
  const filePath = path.join(dirPath, `${feature.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page.tsx`);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const content = generateFeaturePage(feature);
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created ${filePath}`);
});

console.log(`\n✅ Generated ${features.length} feature pages!`);
console.log(`Total pages including sub-features: ${features.length + (8 * features.length)} pages`);
