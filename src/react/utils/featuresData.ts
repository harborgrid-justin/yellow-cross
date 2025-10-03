import { Feature, SubFeature } from '../types';

export const featuresData: Feature[] = [
    {
        name: 'Case Management System',
        icon: 'fa-briefcase',
        endpoint: '/api/cases',
        category: 'management',
        description: 'Complete case lifecycle management from intake to closing',
        subFeatureCount: 8,
        slug: 'case-management'
    },
    {
        name: 'Client Relationship Management',
        icon: 'fa-users',
        endpoint: '/api/clients',
        category: 'management',
        description: 'Comprehensive client database and relationship tracking',
        subFeatureCount: 8,
        slug: 'client-crm'
    },
    {
        name: 'Document Management System',
        icon: 'fa-folder-open',
        endpoint: '/api/documents',
        category: 'management',
        description: 'Secure document storage, versioning, and collaboration',
        subFeatureCount: 8,
        slug: 'document-management'
    },
    {
        name: 'Time & Billing Management',
        icon: 'fa-clock',
        endpoint: '/api/billing',
        category: 'management',
        description: 'Track billable hours and generate invoices',
        subFeatureCount: 8,
        slug: 'time-billing'
    },
    {
        name: 'Calendar & Scheduling System',
        icon: 'fa-calendar-alt',
        endpoint: '/api/calendar',
        category: 'management',
        description: 'Court dates, deadlines, and appointment management',
        subFeatureCount: 8,
        slug: 'calendar-scheduling'
    },
    {
        name: 'Task & Workflow Management',
        icon: 'fa-tasks',
        endpoint: '/api/tasks',
        category: 'management',
        description: 'Task assignment and workflow automation',
        subFeatureCount: 8,
        slug: 'task-workflow'
    },
    {
        name: 'Legal Research & Knowledge Base',
        icon: 'fa-book',
        endpoint: '/api/research',
        category: 'legal',
        description: 'Integrated legal research and knowledge management',
        subFeatureCount: 8,
        slug: 'legal-research'
    },
    {
        name: 'Court & Docket Management',
        icon: 'fa-gavel',
        endpoint: '/api/court',
        category: 'legal',
        description: 'Track court dockets and manage filings',
        subFeatureCount: 8,
        slug: 'court-docket'
    },
    {
        name: 'Contract Management',
        icon: 'fa-file-contract',
        endpoint: '/api/contracts',
        category: 'legal',
        description: 'Contract lifecycle from drafting to renewal',
        subFeatureCount: 8,
        slug: 'contract-management'
    },
    {
        name: 'eDiscovery & Evidence Management',
        icon: 'fa-search',
        endpoint: '/api/ediscovery',
        category: 'legal',
        description: 'Evidence collection, review, and production',
        subFeatureCount: 8,
        slug: 'ediscovery'
    },
    {
        name: 'Compliance & Risk Management',
        icon: 'fa-shield-alt',
        endpoint: '/api/compliance',
        category: 'compliance',
        description: 'Ethics tracking and risk assessment',
        subFeatureCount: 8,
        slug: 'compliance'
    },
    {
        name: 'Reporting & Analytics',
        icon: 'fa-chart-bar',
        endpoint: '/api/reports',
        category: 'analytics',
        description: 'Business intelligence and performance metrics',
        subFeatureCount: 8,
        slug: 'reporting-analytics'
    },
    {
        name: 'Communication & Collaboration',
        icon: 'fa-comments',
        endpoint: '/api/communication',
        category: 'management',
        description: 'Team messaging and client communication',
        subFeatureCount: 8,
        slug: 'communication'
    },
    {
        name: 'Security & Access Control',
        icon: 'fa-lock',
        endpoint: '/api/security',
        category: 'compliance',
        description: 'Role-based permissions and audit logs',
        subFeatureCount: 8,
        slug: 'security'
    },
    {
        name: 'Integration & API Management',
        icon: 'fa-plug',
        endpoint: '/api/integrations',
        category: 'management',
        description: 'Third-party integrations and API access',
        subFeatureCount: 8,
        slug: 'integration'
    }
];

export const subFeaturesData: Record<string, SubFeature[]> = {
    'case-management': [
        { id: 1, name: 'Case Creation & Intake', description: 'Create new cases, intake forms, client questionnaires', slug: 'creation-intake', featureSlug: 'case-management' },
        { id: 2, name: 'Case Tracking & Status', description: 'Track case progress, status updates, milestones', slug: 'tracking-status', featureSlug: 'case-management' },
        { id: 3, name: 'Case Assignment & Distribution', description: 'Assign cases to attorneys, distribute workload', slug: 'assignment-distribution', featureSlug: 'case-management' },
        { id: 4, name: 'Case Timeline Management', description: 'Visual timeline, key dates, event tracking', slug: 'timeline-management', featureSlug: 'case-management' },
        { id: 5, name: 'Case Categorization & Tagging', description: 'Organize cases by practice area, type, priority', slug: 'categorization-tagging', featureSlug: 'case-management' },
        { id: 6, name: 'Case Notes & Updates', description: 'Add notes, updates, case journal', slug: 'notes-updates', featureSlug: 'case-management' },
        { id: 7, name: 'Case Closing & Archive', description: 'Close cases, archive management, retention policies', slug: 'closing-archive', featureSlug: 'case-management' },
        { id: 8, name: 'Case Analytics Dashboard', description: 'Case metrics, performance indicators, trends', slug: 'analytics-dashboard', featureSlug: 'case-management' }
    ],
    'client-crm': [
        { id: 1, name: 'Client Database Management', description: 'Centralized client information, contact details', slug: 'database-management', featureSlug: 'client-crm' },
        { id: 2, name: 'Client Communication History', description: 'Track all client interactions, emails, calls', slug: 'communication-history', featureSlug: 'client-crm' },
        { id: 3, name: 'Client Portal Access', description: 'Secure client portal for case access', slug: 'portal-access', featureSlug: 'client-crm' },
        { id: 4, name: 'Client Intake & Onboarding', description: 'New client onboarding workflows, intake forms', slug: 'intake-onboarding', featureSlug: 'client-crm' },
        { id: 5, name: 'Client Billing Information', description: 'Payment methods, billing preferences, credit status', slug: 'billing-information', featureSlug: 'client-crm' },
        { id: 6, name: 'Client Conflict Checking', description: 'Automated conflict of interest checks', slug: 'conflict-checking', featureSlug: 'client-crm' },
        { id: 7, name: 'Client Retention & Feedback', description: 'Client satisfaction surveys, retention tracking', slug: 'retention-feedback', featureSlug: 'client-crm' },
        { id: 8, name: 'Client Relationship Analytics', description: 'Client lifetime value, engagement metrics', slug: 'relationship-analytics', featureSlug: 'client-crm' }
    ],
    // I'll create comprehensive sub-features for remaining features
    'document-management': [
        { id: 1, name: 'Document Upload & Storage', description: 'Secure cloud storage, version control', slug: 'upload-storage', featureSlug: 'document-management' },
        { id: 2, name: 'Document Organization & Indexing', description: 'Folder structure, tagging, metadata', slug: 'organization-indexing', featureSlug: 'document-management' },
        { id: 3, name: 'Document Templates Library', description: 'Legal templates, forms, pleadings', slug: 'templates-library', featureSlug: 'document-management' },
        { id: 4, name: 'Document Version Control', description: 'Track revisions, compare versions', slug: 'version-control', featureSlug: 'document-management' },
        { id: 5, name: 'Document Search & Retrieval', description: 'Full-text search, advanced filters', slug: 'search-retrieval', featureSlug: 'document-management' },
        { id: 6, name: 'Document Collaboration', description: 'Real-time editing, comments, annotations', slug: 'collaboration', featureSlug: 'document-management' },
        { id: 7, name: 'Document Security & Permissions', description: 'Access control, encryption, redaction', slug: 'security-permissions', featureSlug: 'document-management' },
        { id: 8, name: 'Document Automation', description: 'Auto-generate documents from templates', slug: 'automation', featureSlug: 'document-management' }
    ],
    'time-billing': [
        { id: 1, name: 'Time Tracking & Entry', description: 'Manual and automatic time tracking', slug: 'tracking-entry', featureSlug: 'time-billing' },
        { id: 2, name: 'Billable Hours Management', description: 'Track billable vs non-billable hours', slug: 'billable-hours', featureSlug: 'time-billing' },
        { id: 3, name: 'Invoice Generation', description: 'Create professional invoices, statements', slug: 'invoice-generation', featureSlug: 'time-billing' },
        { id: 4, name: 'Payment Processing', description: 'Accept payments, payment plans, receipts', slug: 'payment-processing', featureSlug: 'time-billing' },
        { id: 5, name: 'Expense Tracking', description: 'Track case-related expenses, reimbursements', slug: 'expense-tracking', featureSlug: 'time-billing' },
        { id: 6, name: 'Trust Accounting', description: 'IOLTA compliance, trust account management', slug: 'trust-accounting', featureSlug: 'time-billing' },
        { id: 7, name: 'Rate Management', description: 'Hourly rates, flat fees, contingency fees', slug: 'rate-management', featureSlug: 'time-billing' },
        { id: 8, name: 'Financial Reporting', description: 'Revenue reports, accounts receivable, profitability', slug: 'financial-reporting', featureSlug: 'time-billing' }
    ],
    'calendar-scheduling': [
        { id: 1, name: 'Court Date Management', description: 'Track court appearances, hearings, trials', slug: 'court-dates', featureSlug: 'calendar-scheduling' },
        { id: 2, name: 'Deadline Management', description: 'Calculate deadlines, statute of limitations', slug: 'deadline-management', featureSlug: 'calendar-scheduling' },
        { id: 3, name: 'Appointment Scheduling', description: 'Client meetings, consultations, depositions', slug: 'appointment-scheduling', featureSlug: 'calendar-scheduling' },
        { id: 4, name: 'Attorney Availability', description: 'Manage attorney schedules, conflicts', slug: 'attorney-availability', featureSlug: 'calendar-scheduling' },
        { id: 5, name: 'Reminder & Notification System', description: 'Automated reminders, alerts', slug: 'reminders-notifications', featureSlug: 'calendar-scheduling' },
        { id: 6, name: 'Calendar Synchronization', description: 'Sync with Outlook, Google Calendar', slug: 'calendar-sync', featureSlug: 'calendar-scheduling' },
        { id: 7, name: 'Resource Scheduling', description: 'Conference rooms, equipment reservation', slug: 'resource-scheduling', featureSlug: 'calendar-scheduling' },
        { id: 8, name: 'Conflict Detection', description: 'Automatic scheduling conflict detection', slug: 'conflict-detection', featureSlug: 'calendar-scheduling' }
    ],
    'task-workflow': [
        { id: 1, name: 'Task Creation & Assignment', description: 'Create tasks, assign to team members', slug: 'creation-assignment', featureSlug: 'task-workflow' },
        { id: 2, name: 'Workflow Automation', description: 'Automate routine legal workflows', slug: 'workflow-automation', featureSlug: 'task-workflow' },
        { id: 3, name: 'Task Dependencies', description: 'Define task relationships, prerequisites', slug: 'task-dependencies', featureSlug: 'task-workflow' },
        { id: 4, name: 'Priority Management', description: 'Set task priorities, urgent flags', slug: 'priority-management', featureSlug: 'task-workflow' },
        { id: 5, name: 'Task Templates', description: 'Pre-defined task lists for common processes', slug: 'task-templates', featureSlug: 'task-workflow' },
        { id: 6, name: 'Progress Tracking', description: 'Monitor task completion, bottlenecks', slug: 'progress-tracking', featureSlug: 'task-workflow' },
        { id: 7, name: 'Team Collaboration', description: 'Task comments, file attachments', slug: 'team-collaboration', featureSlug: 'task-workflow' },
        { id: 8, name: 'Workflow Analytics', description: 'Efficiency metrics, completion rates', slug: 'workflow-analytics', featureSlug: 'task-workflow' }
    ],
    'legal-research': [
        { id: 1, name: 'Legal Research Integration', description: 'Connect to Westlaw, LexisNexis', slug: 'research-integration', featureSlug: 'legal-research' },
        { id: 2, name: 'Internal Knowledge Base', description: 'Store firm knowledge, best practices', slug: 'knowledge-base', featureSlug: 'legal-research' },
        { id: 3, name: 'Case Law Database', description: 'Search precedents, relevant cases', slug: 'case-law-database', featureSlug: 'legal-research' },
        { id: 4, name: 'Legal Memoranda Library', description: 'Store and retrieve legal memos', slug: 'memoranda-library', featureSlug: 'legal-research' },
        { id: 5, name: 'Research Citation Management', description: 'Organize citations, references', slug: 'citation-management', featureSlug: 'legal-research' },
        { id: 6, name: 'Precedent Tracking', description: 'Monitor relevant case law changes', slug: 'precedent-tracking', featureSlug: 'legal-research' },
        { id: 7, name: 'Research Collaboration', description: 'Share research, annotate findings', slug: 'research-collaboration', featureSlug: 'legal-research' },
        { id: 8, name: 'Research Analytics', description: 'Research time tracking, cost analysis', slug: 'research-analytics', featureSlug: 'legal-research' }
    ],
    'court-docket': [
        { id: 1, name: 'Docket Management', description: 'Track court dockets, filings', slug: 'docket-management', featureSlug: 'court-docket' },
        { id: 2, name: 'Electronic Filing', description: 'E-filing integration, submission tracking', slug: 'electronic-filing', featureSlug: 'court-docket' },
        { id: 3, name: 'Court Rules & Procedures', description: 'Local rules, filing requirements', slug: 'rules-procedures', featureSlug: 'court-docket' },
        { id: 4, name: 'Hearing Preparation', description: 'Hearing checklists, preparation tools', slug: 'hearing-preparation', featureSlug: 'court-docket' },
        { id: 5, name: 'Docket Monitoring', description: 'Automated docket updates, alerts', slug: 'docket-monitoring', featureSlug: 'court-docket' },
        { id: 6, name: 'Court Calendar Integration', description: 'Sync court dates with calendar', slug: 'calendar-integration', featureSlug: 'court-docket' },
        { id: 7, name: 'Filing History', description: 'Complete filing history, tracking', slug: 'filing-history', featureSlug: 'court-docket' },
        { id: 8, name: 'Court Analytics', description: 'Court performance metrics, trends', slug: 'court-analytics', featureSlug: 'court-docket' }
    ],
    'contract-management': [
        { id: 1, name: 'Contract Drafting', description: 'Create contracts from templates', slug: 'contract-drafting', featureSlug: 'contract-management' },
        { id: 2, name: 'Contract Review & Approval', description: 'Review workflows, approval chains', slug: 'review-approval', featureSlug: 'contract-management' },
        { id: 3, name: 'Contract Storage & Organization', description: 'Centralized contract repository', slug: 'storage-organization', featureSlug: 'contract-management' },
        { id: 4, name: 'Contract Lifecycle Tracking', description: 'Track contract stages, milestones', slug: 'lifecycle-tracking', featureSlug: 'contract-management' },
        { id: 5, name: 'Contract Obligation Management', description: 'Track obligations, deliverables', slug: 'obligation-management', featureSlug: 'contract-management' },
        { id: 6, name: 'Renewal & Expiration Tracking', description: 'Monitor renewals, expirations', slug: 'renewal-expiration', featureSlug: 'contract-management' },
        { id: 7, name: 'Contract Analytics', description: 'Contract value, performance metrics', slug: 'contract-analytics', featureSlug: 'contract-management' },
        { id: 8, name: 'Clause Library', description: 'Reusable contract clauses, terms', slug: 'clause-library', featureSlug: 'contract-management' }
    ],
    'ediscovery': [
        { id: 1, name: 'Data Collection', description: 'Collect electronic evidence, ESI', slug: 'data-collection', featureSlug: 'ediscovery' },
        { id: 2, name: 'Document Review Platform', description: 'Review documents, coding, tagging', slug: 'review-platform', featureSlug: 'ediscovery' },
        { id: 3, name: 'Legal Hold Management', description: 'Issue holds, track compliance', slug: 'legal-hold', featureSlug: 'ediscovery' },
        { id: 4, name: 'Production Management', description: 'Produce documents, Bates numbering', slug: 'production-management', featureSlug: 'ediscovery' },
        { id: 5, name: 'Privilege Review', description: 'Identify privileged documents', slug: 'privilege-review', featureSlug: 'ediscovery' },
        { id: 6, name: 'Evidence Organization', description: 'Tag, categorize evidence', slug: 'evidence-organization', featureSlug: 'ediscovery' },
        { id: 7, name: 'Analytics & TAR', description: 'Technology-assisted review, analytics', slug: 'analytics-tar', featureSlug: 'ediscovery' },
        { id: 8, name: 'eDiscovery Reporting', description: 'Discovery metrics, cost tracking', slug: 'ediscovery-reporting', featureSlug: 'ediscovery' }
    ],
    'compliance': [
        { id: 1, name: 'Ethics Compliance', description: 'Track ethics requirements, CLE', slug: 'ethics-compliance', featureSlug: 'compliance' },
        { id: 2, name: 'Regulatory Compliance', description: 'Monitor regulatory requirements', slug: 'regulatory-compliance', featureSlug: 'compliance' },
        { id: 3, name: 'Risk Assessment', description: 'Identify and assess risks', slug: 'risk-assessment', featureSlug: 'compliance' },
        { id: 4, name: 'Audit Trail & Logging', description: 'Complete audit logs, tracking', slug: 'audit-trail', featureSlug: 'compliance' },
        { id: 5, name: 'Policy Management', description: 'Firm policies, procedures', slug: 'policy-management', featureSlug: 'compliance' },
        { id: 6, name: 'Incident Management', description: 'Track security incidents, breaches', slug: 'incident-management', featureSlug: 'compliance' },
        { id: 7, name: 'Compliance Reporting', description: 'Generate compliance reports', slug: 'compliance-reporting', featureSlug: 'compliance' },
        { id: 8, name: 'Training & Certification', description: 'Staff training, certifications', slug: 'training-certification', featureSlug: 'compliance' }
    ],
    'reporting-analytics': [
        { id: 1, name: 'Financial Reports', description: 'Revenue, profitability, AR/AP', slug: 'financial-reports', featureSlug: 'reporting-analytics' },
        { id: 2, name: 'Performance Dashboards', description: 'KPIs, metrics, visualizations', slug: 'performance-dashboards', featureSlug: 'reporting-analytics' },
        { id: 3, name: 'Case Analytics', description: 'Case metrics, win rates, trends', slug: 'case-analytics', featureSlug: 'reporting-analytics' },
        { id: 4, name: 'Attorney Productivity', description: 'Utilization, billable hours', slug: 'attorney-productivity', featureSlug: 'reporting-analytics' },
        { id: 5, name: 'Client Analytics', description: 'Client lifetime value, retention', slug: 'client-analytics', featureSlug: 'reporting-analytics' },
        { id: 6, name: 'Custom Report Builder', description: 'Create custom reports, queries', slug: 'custom-reports', featureSlug: 'reporting-analytics' },
        { id: 7, name: 'Data Visualization', description: 'Charts, graphs, interactive visuals', slug: 'data-visualization', featureSlug: 'reporting-analytics' },
        { id: 8, name: 'Predictive Analytics', description: 'Forecasting, trend analysis', slug: 'predictive-analytics', featureSlug: 'reporting-analytics' }
    ],
    'communication': [
        { id: 1, name: 'Internal Messaging', description: 'Team chat, direct messages', slug: 'internal-messaging', featureSlug: 'communication' },
        { id: 2, name: 'Email Integration', description: 'Connect email accounts, tracking', slug: 'email-integration', featureSlug: 'communication' },
        { id: 3, name: 'Client Communication', description: 'Secure client messaging', slug: 'client-communication', featureSlug: 'communication' },
        { id: 4, name: 'Video Conferencing', description: 'Built-in video meetings', slug: 'video-conferencing', featureSlug: 'communication' },
        { id: 5, name: 'Document Sharing', description: 'Share files securely', slug: 'document-sharing', featureSlug: 'communication' },
        { id: 6, name: 'Communication Templates', description: 'Email templates, responses', slug: 'communication-templates', featureSlug: 'communication' },
        { id: 7, name: 'Notification Center', description: 'Centralized notifications, alerts', slug: 'notification-center', featureSlug: 'communication' },
        { id: 8, name: 'Communication Analytics', description: 'Response times, engagement', slug: 'communication-analytics', featureSlug: 'communication' }
    ],
    'security': [
        { id: 1, name: 'User Management', description: 'Manage users, roles, permissions', slug: 'user-management', featureSlug: 'security' },
        { id: 2, name: 'Role-Based Access Control', description: 'Define roles, permissions', slug: 'rbac', featureSlug: 'security' },
        { id: 3, name: 'Two-Factor Authentication', description: '2FA, MFA security', slug: '2fa', featureSlug: 'security' },
        { id: 4, name: 'Data Encryption', description: 'Encrypt data at rest and in transit', slug: 'data-encryption', featureSlug: 'security' },
        { id: 5, name: 'Session Management', description: 'Control sessions, timeouts', slug: 'session-management', featureSlug: 'security' },
        { id: 6, name: 'Audit Logs', description: 'Complete activity logs', slug: 'audit-logs', featureSlug: 'security' },
        { id: 7, name: 'IP Whitelisting', description: 'Restrict access by IP', slug: 'ip-whitelisting', featureSlug: 'security' },
        { id: 8, name: 'Security Reports', description: 'Security metrics, incident reports', slug: 'security-reports', featureSlug: 'security' }
    ],
    'integration': [
        { id: 1, name: 'API Management', description: 'RESTful API, documentation', slug: 'api-management', featureSlug: 'integration' },
        { id: 2, name: 'Third-Party Integrations', description: 'Connect external services', slug: 'third-party', featureSlug: 'integration' },
        { id: 3, name: 'Webhooks & Events', description: 'Real-time event notifications', slug: 'webhooks-events', featureSlug: 'integration' },
        { id: 4, name: 'Data Import/Export', description: 'Import and export data', slug: 'data-import-export', featureSlug: 'integration' },
        { id: 5, name: 'Calendar Integration', description: 'Outlook, Google Calendar sync', slug: 'calendar-integration', featureSlug: 'integration' },
        { id: 6, name: 'Accounting Integration', description: 'QuickBooks, Xero integration', slug: 'accounting-integration', featureSlug: 'integration' },
        { id: 7, name: 'Document Storage Integration', description: 'Dropbox, OneDrive, Google Drive', slug: 'storage-integration', featureSlug: 'integration' },
        { id: 8, name: 'Custom Integration Builder', description: 'Build custom integrations', slug: 'custom-integration', featureSlug: 'integration' }
    ]
};
