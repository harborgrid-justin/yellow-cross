import { Feature, SubFeature } from '../types';

export const featuresData: Feature[] = [
    // Core Features 1-15
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
    },
    // NEW Features 16-30 - Practice Areas
    {
        name: 'Litigation Management',
        icon: 'fa-balance-scale',
        endpoint: '/api/litigation',
        category: 'practice-areas',
        description: 'Comprehensive litigation tracking with pleadings, discovery, and trial management',
        subFeatureCount: 6,
        slug: 'litigation-management'
    },
    {
        name: 'Mediation & ADR',
        icon: 'fa-handshake',
        endpoint: '/api/mediation',
        category: 'practice-areas',
        description: 'Alternative dispute resolution and mediation case management',
        subFeatureCount: 6,
        slug: 'mediation-adr'
    },
    {
        name: 'Intellectual Property',
        icon: 'fa-lightbulb',
        endpoint: '/api/ip',
        category: 'practice-areas',
        description: 'Patent, trademark, and copyright management',
        subFeatureCount: 6,
        slug: 'intellectual-property'
    },
    {
        name: 'Real Estate Transactions',
        icon: 'fa-home',
        endpoint: '/api/real-estate',
        category: 'practice-areas',
        description: 'Real estate transactions, closings, and title work',
        subFeatureCount: 6,
        slug: 'real-estate-transactions'
    },
    {
        name: 'Corporate Governance',
        icon: 'fa-building',
        endpoint: '/api/corporate',
        category: 'practice-areas',
        description: 'Corporate governance, compliance, and board management',
        subFeatureCount: 6,
        slug: 'corporate-governance'
    },
    {
        name: 'Mergers & Acquisitions',
        icon: 'fa-chart-line',
        endpoint: '/api/ma',
        category: 'practice-areas',
        description: 'M&A deals, due diligence, and integration management',
        subFeatureCount: 6,
        slug: 'mergers-acquisitions'
    },
    {
        name: 'Employment Law',
        icon: 'fa-user-tie',
        endpoint: '/api/employment',
        category: 'practice-areas',
        description: 'Employment disputes, contracts, and workplace investigations',
        subFeatureCount: 6,
        slug: 'employment-law'
    },
    {
        name: 'Immigration Law',
        icon: 'fa-passport',
        endpoint: '/api/immigration',
        category: 'practice-areas',
        description: 'Immigration cases, visa applications, and citizenship matters',
        subFeatureCount: 6,
        slug: 'immigration-law'
    },
    {
        name: 'Family Law',
        icon: 'fa-heart',
        endpoint: '/api/family',
        category: 'practice-areas',
        description: 'Divorce, custody, adoption, and family legal matters',
        subFeatureCount: 6,
        slug: 'family-law'
    },
    {
        name: 'Criminal Defense',
        icon: 'fa-gavel',
        endpoint: '/api/criminal',
        category: 'practice-areas',
        description: 'Criminal defense case management and trial preparation',
        subFeatureCount: 6,
        slug: 'criminal-defense'
    },
    {
        name: 'Bankruptcy Management',
        icon: 'fa-money-bill-wave',
        endpoint: '/api/bankruptcy',
        category: 'practice-areas',
        description: 'Bankruptcy filings, creditor management, and reorganization',
        subFeatureCount: 6,
        slug: 'bankruptcy-management'
    },
    {
        name: 'Estate Planning',
        icon: 'fa-file-signature',
        endpoint: '/api/estate',
        category: 'practice-areas',
        description: 'Wills, trusts, probate, and estate administration',
        subFeatureCount: 6,
        slug: 'estate-planning'
    },
    {
        name: 'Tax Law',
        icon: 'fa-calculator',
        endpoint: '/api/tax',
        category: 'practice-areas',
        description: 'Tax planning, disputes, and compliance',
        subFeatureCount: 6,
        slug: 'tax-law'
    },
    {
        name: 'Personal Injury',
        icon: 'fa-ambulance',
        endpoint: '/api/personal-injury',
        category: 'practice-areas',
        description: 'Personal injury claims, settlements, and litigation',
        subFeatureCount: 6,
        slug: 'personal-injury'
    },
    {
        name: 'Class Action',
        icon: 'fa-users-cog',
        endpoint: '/api/class-action',
        category: 'practice-areas',
        description: 'Class action lawsuits and mass tort management',
        subFeatureCount: 6,
        slug: 'class-action'
    },
    // Features 31-45 - Specialized Practice Areas
    {
        name: 'Securities Law',
        icon: 'fa-chart-pie',
        endpoint: '/api/securities',
        category: 'specialized',
        description: 'Securities law, SEC compliance, and investor protection',
        subFeatureCount: 5,
        slug: 'securities-law'
    },
    {
        name: 'Healthcare Law',
        icon: 'fa-hospital',
        endpoint: '/api/healthcare',
        category: 'specialized',
        description: 'Healthcare compliance, HIPAA, and medical malpractice',
        subFeatureCount: 5,
        slug: 'healthcare-law'
    },
    {
        name: 'Environmental Law',
        icon: 'fa-leaf',
        endpoint: '/api/environmental',
        category: 'specialized',
        description: 'Environmental compliance and regulatory matters',
        subFeatureCount: 5,
        slug: 'environmental-law'
    },
    {
        name: 'Insurance Defense',
        icon: 'fa-shield-alt',
        endpoint: '/api/insurance',
        category: 'specialized',
        description: 'Insurance defense and coverage litigation',
        subFeatureCount: 5,
        slug: 'insurance-defense'
    },
    {
        name: 'Appellate Practice',
        icon: 'fa-balance-scale-right',
        endpoint: '/api/appellate',
        category: 'specialized',
        description: 'Appellate briefs, oral arguments, and appeals',
        subFeatureCount: 5,
        slug: 'appellate-practice'
    },
    {
        name: 'Financial Services',
        icon: 'fa-university',
        endpoint: '/api/financial',
        category: 'specialized',
        description: 'Banking, finance, and regulatory compliance',
        subFeatureCount: 5,
        slug: 'financial-services'
    },
    {
        name: 'Energy & Utilities',
        icon: 'fa-bolt',
        endpoint: '/api/energy',
        category: 'specialized',
        description: 'Energy sector legal matters and regulations',
        subFeatureCount: 5,
        slug: 'energy-utilities'
    },
    {
        name: 'Telecommunications',
        icon: 'fa-broadcast-tower',
        endpoint: '/api/telecom',
        category: 'specialized',
        description: 'Telecom regulatory matters and compliance',
        subFeatureCount: 5,
        slug: 'telecommunications'
    },
    {
        name: 'Aviation Law',
        icon: 'fa-plane',
        endpoint: '/api/aviation',
        category: 'specialized',
        description: 'Aviation regulations and incident investigations',
        subFeatureCount: 5,
        slug: 'aviation-law'
    },
    {
        name: 'Maritime Law',
        icon: 'fa-anchor',
        endpoint: '/api/maritime',
        category: 'specialized',
        description: 'Admiralty and maritime legal matters',
        subFeatureCount: 5,
        slug: 'maritime-law'
    },
    {
        name: 'Construction Law',
        icon: 'fa-hard-hat',
        endpoint: '/api/construction',
        category: 'specialized',
        description: 'Construction disputes and contract management',
        subFeatureCount: 5,
        slug: 'construction-law'
    },
    {
        name: 'Franchise Law',
        icon: 'fa-store',
        endpoint: '/api/franchise',
        category: 'specialized',
        description: 'Franchise agreements and compliance',
        subFeatureCount: 5,
        slug: 'franchise-law'
    },
    {
        name: 'Sports & Entertainment',
        icon: 'fa-trophy',
        endpoint: '/api/sports',
        category: 'specialized',
        description: 'Sports contracts and entertainment law',
        subFeatureCount: 5,
        slug: 'sports-entertainment'
    },
    {
        name: 'Technology Transactions',
        icon: 'fa-laptop-code',
        endpoint: '/api/technology',
        category: 'specialized',
        description: 'Software licensing and tech transactions',
        subFeatureCount: 5,
        slug: 'technology-transactions'
    },
    {
        name: 'Data Privacy & GDPR',
        icon: 'fa-user-shield',
        endpoint: '/api/privacy',
        category: 'specialized',
        description: 'Data privacy compliance and GDPR matters',
        subFeatureCount: 5,
        slug: 'data-privacy'
    },
    // Features 46-60 - Compliance & Public Service
    {
        name: 'Cybersecurity Legal',
        icon: 'fa-lock',
        endpoint: '/api/cybersecurity',
        category: 'compliance',
        description: 'Cybersecurity incidents and breach response',
        subFeatureCount: 4,
        slug: 'cybersecurity-legal'
    },
    {
        name: 'Government Contracts',
        icon: 'fa-landmark',
        endpoint: '/api/government',
        category: 'compliance',
        description: 'Government contract management and compliance',
        subFeatureCount: 4,
        slug: 'government-contracts'
    },
    {
        name: 'Non-Profit Law',
        icon: 'fa-hands-helping',
        endpoint: '/api/nonprofit',
        category: 'compliance',
        description: 'Non-profit legal matters and 501(c)(3) compliance',
        subFeatureCount: 4,
        slug: 'non-profit-law'
    },
    {
        name: 'Education Law',
        icon: 'fa-graduation-cap',
        endpoint: '/api/education',
        category: 'compliance',
        description: 'Education law compliance and student matters',
        subFeatureCount: 4,
        slug: 'education-law'
    },
    {
        name: 'Labor Relations',
        icon: 'fa-handshake',
        endpoint: '/api/labor',
        category: 'compliance',
        description: 'Labor relations and collective bargaining',
        subFeatureCount: 4,
        slug: 'labor-relations'
    },
    {
        name: 'International Trade',
        icon: 'fa-globe',
        endpoint: '/api/trade',
        category: 'compliance',
        description: 'International trade compliance and customs',
        subFeatureCount: 4,
        slug: 'international-trade'
    },
    {
        name: 'Antitrust & Competition',
        icon: 'fa-balance-scale',
        endpoint: '/api/antitrust',
        category: 'compliance',
        description: 'Antitrust investigations and compliance',
        subFeatureCount: 4,
        slug: 'antitrust-competition'
    },
    {
        name: 'White Collar Crime',
        icon: 'fa-user-secret',
        endpoint: '/api/white-collar',
        category: 'criminal',
        description: 'White collar crime defense and investigations',
        subFeatureCount: 4,
        slug: 'white-collar-crime'
    },
    {
        name: 'Civil Rights',
        icon: 'fa-fist-raised',
        endpoint: '/api/civil-rights',
        category: 'public-service',
        description: 'Civil rights cases and discrimination matters',
        subFeatureCount: 4,
        slug: 'civil-rights'
    },
    {
        name: 'Municipal Law',
        icon: 'fa-city',
        endpoint: '/api/municipal',
        category: 'public-service',
        description: 'Municipal government legal matters',
        subFeatureCount: 4,
        slug: 'municipal-law'
    },
    {
        name: 'Veterans Affairs',
        icon: 'fa-medal',
        endpoint: '/api/veterans',
        category: 'public-service',
        description: 'Veterans benefits and legal assistance',
        subFeatureCount: 4,
        slug: 'veterans-affairs'
    },
    {
        name: 'Social Security',
        icon: 'fa-id-card',
        endpoint: '/api/social-security',
        category: 'public-service',
        description: 'Social security disability claims',
        subFeatureCount: 4,
        slug: 'social-security'
    },
    {
        name: 'Consumer Protection',
        icon: 'fa-shopping-cart',
        endpoint: '/api/consumer',
        category: 'public-service',
        description: 'Consumer protection and fraud cases',
        subFeatureCount: 4,
        slug: 'consumer-protection'
    },
    {
        name: 'Landlord-Tenant',
        icon: 'fa-key',
        endpoint: '/api/landlord-tenant',
        category: 'public-service',
        description: 'Landlord-tenant disputes and housing law',
        subFeatureCount: 4,
        slug: 'landlord-tenant'
    },
    {
        name: 'Pro Bono Management',
        icon: 'fa-heart',
        endpoint: '/api/probono',
        category: 'public-service',
        description: 'Pro bono legal services tracking and management',
        subFeatureCount: 4,
        slug: 'pro-bono'
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
    ],
    // NEW FEATURES 16-60 SUB-FEATURES
    'litigation-management': [
        { id: 1, name: 'Pleadings Management', description: 'Track complaints, answers, motions', slug: 'pleadings', featureSlug: 'litigation-management' },
        { id: 2, name: 'Discovery Management', description: 'Document requests, interrogatories, depositions', slug: 'discovery', featureSlug: 'litigation-management' },
        { id: 3, name: 'Trial Preparation', description: 'Witness prep, exhibits, trial notebooks', slug: 'trial-prep', featureSlug: 'litigation-management' },
        { id: 4, name: 'Settlement Negotiations', description: 'Track settlement offers and negotiations', slug: 'settlement', featureSlug: 'litigation-management' },
        { id: 5, name: 'Expert Witnesses', description: 'Expert witness management and coordination', slug: 'experts', featureSlug: 'litigation-management' },
        { id: 6, name: 'Litigation Timeline', description: 'Visual litigation timeline and milestones', slug: 'timeline', featureSlug: 'litigation-management' }
    ],
    'mediation-adr': [
        { id: 1, name: 'Mediation Scheduling', description: 'Schedule mediation sessions', slug: 'scheduling', featureSlug: 'mediation-adr' },
        { id: 2, name: 'Mediator Management', description: 'Track mediators and availability', slug: 'mediators', featureSlug: 'mediation-adr' },
        { id: 3, name: 'ADR Case Management', description: 'Alternative dispute resolution cases', slug: 'adr-cases', featureSlug: 'mediation-adr' },
        { id: 4, name: 'Settlement Documentation', description: 'Settlement agreements and terms', slug: 'settlement-docs', featureSlug: 'mediation-adr' },
        { id: 5, name: 'Arbitration Tracking', description: 'Arbitration proceedings and awards', slug: 'arbitration', featureSlug: 'mediation-adr' },
        { id: 6, name: 'Negotiation History', description: 'Track negotiation progress', slug: 'negotiation', featureSlug: 'mediation-adr' }
    ],
    'intellectual-property': [
        { id: 1, name: 'Patent Management', description: 'Patent applications and portfolio', slug: 'patents', featureSlug: 'intellectual-property' },
        { id: 2, name: 'Trademark Management', description: 'Trademark registration and monitoring', slug: 'trademarks', featureSlug: 'intellectual-property' },
        { id: 3, name: 'Copyright Management', description: 'Copyright registration and licensing', slug: 'copyrights', featureSlug: 'intellectual-property' },
        { id: 4, name: 'IP Portfolio Tracking', description: 'Overall IP portfolio management', slug: 'portfolio', featureSlug: 'intellectual-property' },
        { id: 5, name: 'Licensing Agreements', description: 'IP licensing and royalty tracking', slug: 'licensing', featureSlug: 'intellectual-property' },
        { id: 6, name: 'IP Litigation', description: 'Infringement cases and enforcement', slug: 'litigation', featureSlug: 'intellectual-property' }
    ],
    'real-estate-transactions': [
        { id: 1, name: 'Transaction Management', description: 'Real estate transaction tracking', slug: 'transactions', featureSlug: 'real-estate-transactions' },
        { id: 2, name: 'Title Work', description: 'Title searches and insurance', slug: 'title', featureSlug: 'real-estate-transactions' },
        { id: 3, name: 'Closing Management', description: 'Closing checklists and coordination', slug: 'closing', featureSlug: 'real-estate-transactions' },
        { id: 4, name: 'Due Diligence', description: 'Property due diligence tracking', slug: 'due-diligence', featureSlug: 'real-estate-transactions' },
        { id: 5, name: 'Lease Management', description: 'Commercial and residential leases', slug: 'leases', featureSlug: 'real-estate-transactions' },
        { id: 6, name: 'Zoning & Permits', description: 'Zoning compliance and permit tracking', slug: 'zoning', featureSlug: 'real-estate-transactions' }
    ],
    'corporate-governance': [
        { id: 1, name: 'Board Management', description: 'Board meetings and resolutions', slug: 'board', featureSlug: 'corporate-governance' },
        { id: 2, name: 'Corporate Records', description: 'Minute books and corporate records', slug: 'records', featureSlug: 'corporate-governance' },
        { id: 3, name: 'Compliance Tracking', description: 'Corporate compliance obligations', slug: 'compliance', featureSlug: 'corporate-governance' },
        { id: 4, name: 'Shareholder Management', description: 'Shareholder records and meetings', slug: 'shareholders', featureSlug: 'corporate-governance' },
        { id: 5, name: 'Corporate Formation', description: 'Entity formation and structure', slug: 'formation', featureSlug: 'corporate-governance' },
        { id: 6, name: 'Annual Filings', description: 'Annual report and filing tracking', slug: 'filings', featureSlug: 'corporate-governance' }
    ],
    'mergers-acquisitions': [
        { id: 1, name: 'Deal Management', description: 'M&A deal pipeline and tracking', slug: 'deals', featureSlug: 'mergers-acquisitions' },
        { id: 2, name: 'Due Diligence', description: 'Comprehensive due diligence checklists', slug: 'due-diligence', featureSlug: 'mergers-acquisitions' },
        { id: 3, name: 'Valuation Tracking', description: 'Business valuation and analysis', slug: 'valuation', featureSlug: 'mergers-acquisitions' },
        { id: 4, name: 'Integration Planning', description: 'Post-merger integration management', slug: 'integration', featureSlug: 'mergers-acquisitions' },
        { id: 5, name: 'Transaction Documents', description: 'Purchase agreements and contracts', slug: 'documents', featureSlug: 'mergers-acquisitions' },
        { id: 6, name: 'Regulatory Approvals', description: 'Track required approvals and filings', slug: 'regulatory', featureSlug: 'mergers-acquisitions' }
    ],
    'employment-law': [
        { id: 1, name: 'Employment Contracts', description: 'Employment agreements and terms', slug: 'contracts', featureSlug: 'employment-law' },
        { id: 2, name: 'Workplace Investigations', description: 'Harassment and misconduct investigations', slug: 'investigations', featureSlug: 'employment-law' },
        { id: 3, name: 'Discrimination Cases', description: 'EEOC charges and discrimination claims', slug: 'discrimination', featureSlug: 'employment-law' },
        { id: 4, name: 'Termination Management', description: 'Employee terminations and severance', slug: 'termination', featureSlug: 'employment-law' },
        { id: 5, name: 'Wage & Hour', description: 'Wage and hour compliance tracking', slug: 'wage-hour', featureSlug: 'employment-law' },
        { id: 6, name: 'Policy Development', description: 'Employee handbook and policies', slug: 'policies', featureSlug: 'employment-law' }
    ],
    'immigration-law': [
        { id: 1, name: 'Visa Applications', description: 'Work visas and application tracking', slug: 'visas', featureSlug: 'immigration-law' },
        { id: 2, name: 'Green Card Processing', description: 'Permanent residency applications', slug: 'green-cards', featureSlug: 'immigration-law' },
        { id: 3, name: 'Citizenship Cases', description: 'Naturalization and citizenship', slug: 'citizenship', featureSlug: 'immigration-law' },
        { id: 4, name: 'Deportation Defense', description: 'Removal proceedings and appeals', slug: 'deportation', featureSlug: 'immigration-law' },
        { id: 5, name: 'Family Petitions', description: 'Family-based immigration petitions', slug: 'family', featureSlug: 'immigration-law' },
        { id: 6, name: 'Document Management', description: 'Immigration document tracking', slug: 'documents', featureSlug: 'immigration-law' }
    ],
    'family-law': [
        { id: 1, name: 'Divorce Cases', description: 'Divorce proceedings and settlements', slug: 'divorce', featureSlug: 'family-law' },
        { id: 2, name: 'Child Custody', description: 'Custody arrangements and modifications', slug: 'custody', featureSlug: 'family-law' },
        { id: 3, name: 'Child Support', description: 'Child support calculations and enforcement', slug: 'child-support', featureSlug: 'family-law' },
        { id: 4, name: 'Adoption Cases', description: 'Adoption proceedings and finalization', slug: 'adoption', featureSlug: 'family-law' },
        { id: 5, name: 'Spousal Support', description: 'Alimony and spousal maintenance', slug: 'spousal-support', featureSlug: 'family-law' },
        { id: 6, name: 'Prenuptial Agreements', description: 'Prenuptial and postnuptial agreements', slug: 'prenuptial', featureSlug: 'family-law' }
    ],
    'criminal-defense': [
        { id: 1, name: 'Case Investigation', description: 'Defense investigation and evidence', slug: 'investigation', featureSlug: 'criminal-defense' },
        { id: 2, name: 'Bail & Bond', description: 'Bail hearings and bond management', slug: 'bail', featureSlug: 'criminal-defense' },
        { id: 3, name: 'Plea Negotiations', description: 'Plea bargaining and agreements', slug: 'plea', featureSlug: 'criminal-defense' },
        { id: 4, name: 'Trial Defense', description: 'Criminal trial preparation and defense', slug: 'trial', featureSlug: 'criminal-defense' },
        { id: 5, name: 'Appeals', description: 'Criminal appeals and post-conviction', slug: 'appeals', featureSlug: 'criminal-defense' },
        { id: 6, name: 'Sentencing', description: 'Sentencing preparation and mitigation', slug: 'sentencing', featureSlug: 'criminal-defense' }
    ],
    'bankruptcy-management': [
        { id: 1, name: 'Chapter 7 Cases', description: 'Chapter 7 liquidation cases', slug: 'chapter-7', featureSlug: 'bankruptcy-management' },
        { id: 2, name: 'Chapter 13 Cases', description: 'Chapter 13 reorganization cases', slug: 'chapter-13', featureSlug: 'bankruptcy-management' },
        { id: 3, name: 'Creditor Management', description: 'Creditor claims and objections', slug: 'creditors', featureSlug: 'bankruptcy-management' },
        { id: 4, name: 'Asset Management', description: 'Asset schedules and exemptions', slug: 'assets', featureSlug: 'bankruptcy-management' },
        { id: 5, name: '341 Meetings', description: 'Meeting of creditors scheduling', slug: '341-meetings', featureSlug: 'bankruptcy-management' },
        { id: 6, name: 'Discharge Tracking', description: 'Discharge orders and compliance', slug: 'discharge', featureSlug: 'bankruptcy-management' }
    ],
    'estate-planning': [
        { id: 1, name: 'Will Preparation', description: 'Last will and testament drafting', slug: 'wills', featureSlug: 'estate-planning' },
        { id: 2, name: 'Trust Management', description: 'Living trusts and trust administration', slug: 'trusts', featureSlug: 'estate-planning' },
        { id: 3, name: 'Probate Cases', description: 'Probate proceedings and administration', slug: 'probate', featureSlug: 'estate-planning' },
        { id: 4, name: 'Estate Administration', description: 'Estate settlement and distribution', slug: 'administration', featureSlug: 'estate-planning' },
        { id: 5, name: 'Powers of Attorney', description: 'POA and healthcare directives', slug: 'poa', featureSlug: 'estate-planning' },
        { id: 6, name: 'Estate Tax Planning', description: 'Tax planning and estate optimization', slug: 'tax-planning', featureSlug: 'estate-planning' }
    ],
    'tax-law': [
        { id: 1, name: 'Tax Planning', description: 'Individual and business tax planning', slug: 'planning', featureSlug: 'tax-law' },
        { id: 2, name: 'Tax Audits', description: 'IRS audit representation', slug: 'audits', featureSlug: 'tax-law' },
        { id: 3, name: 'Tax Disputes', description: 'Tax court and dispute resolution', slug: 'disputes', featureSlug: 'tax-law' },
        { id: 4, name: 'Tax Compliance', description: 'Tax filing and compliance tracking', slug: 'compliance', featureSlug: 'tax-law' },
        { id: 5, name: 'International Tax', description: 'Cross-border tax matters', slug: 'international', featureSlug: 'tax-law' },
        { id: 6, name: 'Tax Credits', description: 'Tax credit and incentive programs', slug: 'credits', featureSlug: 'tax-law' }
    ],
    'personal-injury': [
        { id: 1, name: 'Claim Management', description: 'Personal injury claim tracking', slug: 'claims', featureSlug: 'personal-injury' },
        { id: 2, name: 'Medical Records', description: 'Medical record collection and review', slug: 'medical-records', featureSlug: 'personal-injury' },
        { id: 3, name: 'Settlement Negotiations', description: 'Insurance settlement negotiations', slug: 'settlements', featureSlug: 'personal-injury' },
        { id: 4, name: 'Liability Analysis', description: 'Fault determination and liability', slug: 'liability', featureSlug: 'personal-injury' },
        { id: 5, name: 'Damages Calculation', description: 'Calculate damages and compensation', slug: 'damages', featureSlug: 'personal-injury' },
        { id: 6, name: 'Expert Coordination', description: 'Medical and accident experts', slug: 'experts', featureSlug: 'personal-injury' }
    ],
    'class-action': [
        { id: 1, name: 'Class Certification', description: 'Class certification motions', slug: 'certification', featureSlug: 'class-action' },
        { id: 2, name: 'Class Member Management', description: 'Track class members and notices', slug: 'members', featureSlug: 'class-action' },
        { id: 3, name: 'Settlement Administration', description: 'Settlement distribution and claims', slug: 'settlement', featureSlug: 'class-action' },
        { id: 4, name: 'Notice Programs', description: 'Class notice campaigns', slug: 'notices', featureSlug: 'class-action' },
        { id: 5, name: 'Opt-Out Management', description: 'Track opt-outs and objections', slug: 'opt-out', featureSlug: 'class-action' },
        { id: 6, name: 'Claims Processing', description: 'Process and validate claims', slug: 'claims', featureSlug: 'class-action' }
    ],
    'securities-law': [
        { id: 1, name: 'SEC Compliance', description: 'Securities and Exchange Commission filings', slug: 'sec', featureSlug: 'securities-law' },
        { id: 2, name: 'Securities Offerings', description: 'IPO and securities offering management', slug: 'offerings', featureSlug: 'securities-law' },
        { id: 3, name: 'Investor Relations', description: 'Shareholder communications', slug: 'investor-relations', featureSlug: 'securities-law' },
        { id: 4, name: 'Securities Litigation', description: 'Securities fraud and litigation', slug: 'litigation', featureSlug: 'securities-law' },
        { id: 5, name: 'Disclosure Management', description: 'Public company disclosures', slug: 'disclosure', featureSlug: 'securities-law' }
    ],
    'healthcare-law': [
        { id: 1, name: 'HIPAA Compliance', description: 'Healthcare privacy compliance', slug: 'hipaa', featureSlug: 'healthcare-law' },
        { id: 2, name: 'Medical Malpractice', description: 'Medical malpractice defense', slug: 'malpractice', featureSlug: 'healthcare-law' },
        { id: 3, name: 'Healthcare Licensing', description: 'Provider licensing and credentialing', slug: 'licensing', featureSlug: 'healthcare-law' },
        { id: 4, name: 'Healthcare Transactions', description: 'Practice acquisitions and mergers', slug: 'transactions', featureSlug: 'healthcare-law' },
        { id: 5, name: 'Regulatory Compliance', description: 'Healthcare regulatory matters', slug: 'regulatory', featureSlug: 'healthcare-law' }
    ],
    'environmental-law': [
        { id: 1, name: 'Environmental Permits', description: 'Environmental permit applications', slug: 'permits', featureSlug: 'environmental-law' },
        { id: 2, name: 'EPA Compliance', description: 'EPA regulatory compliance', slug: 'epa', featureSlug: 'environmental-law' },
        { id: 3, name: 'Environmental Litigation', description: 'Environmental enforcement cases', slug: 'litigation', featureSlug: 'environmental-law' },
        { id: 4, name: 'Contamination Cases', description: 'Site remediation and cleanup', slug: 'contamination', featureSlug: 'environmental-law' },
        { id: 5, name: 'Sustainability Planning', description: 'Environmental sustainability programs', slug: 'sustainability', featureSlug: 'environmental-law' }
    ],
    'insurance-defense': [
        { id: 1, name: 'Claims Defense', description: 'Insurance claim defense management', slug: 'defense', featureSlug: 'insurance-defense' },
        { id: 2, name: 'Coverage Analysis', description: 'Policy coverage review and analysis', slug: 'coverage', featureSlug: 'insurance-defense' },
        { id: 3, name: 'Bad Faith Defense', description: 'Bad faith litigation defense', slug: 'bad-faith', featureSlug: 'insurance-defense' },
        { id: 4, name: 'Subrogation', description: 'Subrogation claim management', slug: 'subrogation', featureSlug: 'insurance-defense' },
        { id: 5, name: 'Reserve Management', description: 'Claims reserve tracking', slug: 'reserves', featureSlug: 'insurance-defense' }
    ],
    'appellate-practice': [
        { id: 1, name: 'Appeals Management', description: 'Appellate case tracking', slug: 'appeals', featureSlug: 'appellate-practice' },
        { id: 2, name: 'Brief Preparation', description: 'Appellate brief writing and review', slug: 'briefs', featureSlug: 'appellate-practice' },
        { id: 3, name: 'Record on Appeal', description: 'Appellate record preparation', slug: 'record', featureSlug: 'appellate-practice' },
        { id: 4, name: 'Oral Arguments', description: 'Oral argument preparation', slug: 'oral-arguments', featureSlug: 'appellate-practice' },
        { id: 5, name: 'Mandate Tracking', description: 'Track appellate mandates', slug: 'mandate', featureSlug: 'appellate-practice' }
    ],
    'financial-services': [
        { id: 1, name: 'Banking Compliance', description: 'Banking regulatory compliance', slug: 'banking', featureSlug: 'financial-services' },
        { id: 2, name: 'Consumer Finance', description: 'Consumer lending matters', slug: 'consumer-finance', featureSlug: 'financial-services' },
        { id: 3, name: 'Financial Disputes', description: 'Financial services litigation', slug: 'disputes', featureSlug: 'financial-services' },
        { id: 4, name: 'Regulatory Examinations', description: 'Bank examinations and audits', slug: 'examinations', featureSlug: 'financial-services' },
        { id: 5, name: 'Fintech Matters', description: 'Financial technology legal issues', slug: 'fintech', featureSlug: 'financial-services' }
    ],
    'energy-utilities': [
        { id: 1, name: 'Energy Regulation', description: 'Energy regulatory compliance', slug: 'regulation', featureSlug: 'energy-utilities' },
        { id: 2, name: 'Utility Contracts', description: 'Power purchase agreements', slug: 'contracts', featureSlug: 'energy-utilities' },
        { id: 3, name: 'Renewable Energy', description: 'Solar, wind, and renewable projects', slug: 'renewable', featureSlug: 'energy-utilities' },
        { id: 4, name: 'Rate Cases', description: 'Utility rate proceedings', slug: 'rates', featureSlug: 'energy-utilities' },
        { id: 5, name: 'Energy Transactions', description: 'Energy asset transactions', slug: 'transactions', featureSlug: 'energy-utilities' }
    ],
    'telecommunications': [
        { id: 1, name: 'FCC Compliance', description: 'FCC regulatory compliance', slug: 'fcc', featureSlug: 'telecommunications' },
        { id: 2, name: 'Spectrum Management', description: 'Spectrum licensing and rights', slug: 'spectrum', featureSlug: 'telecommunications' },
        { id: 3, name: 'Telecom Transactions', description: 'Telecom M&A and investments', slug: 'transactions', featureSlug: 'telecommunications' },
        { id: 4, name: 'Network Agreements', description: 'Network sharing and interconnection', slug: 'network', featureSlug: 'telecommunications' },
        { id: 5, name: 'Privacy Compliance', description: 'Telecom privacy requirements', slug: 'privacy', featureSlug: 'telecommunications' }
    ],
    'aviation-law': [
        { id: 1, name: 'FAA Compliance', description: 'Federal Aviation Administration matters', slug: 'faa', featureSlug: 'aviation-law' },
        { id: 2, name: 'Aircraft Transactions', description: 'Aircraft purchase and leasing', slug: 'transactions', featureSlug: 'aviation-law' },
        { id: 3, name: 'Accident Investigation', description: 'Aviation accident cases', slug: 'accidents', featureSlug: 'aviation-law' },
        { id: 4, name: 'Aviation Litigation', description: 'Aviation-related litigation', slug: 'litigation', featureSlug: 'aviation-law' },
        { id: 5, name: 'Pilot Licensing', description: 'Pilot certification matters', slug: 'licensing', featureSlug: 'aviation-law' }
    ],
    'maritime-law': [
        { id: 1, name: 'Admiralty Cases', description: 'Admiralty and maritime litigation', slug: 'admiralty', featureSlug: 'maritime-law' },
        { id: 2, name: 'Vessel Documentation', description: 'Ship registration and documentation', slug: 'documentation', featureSlug: 'maritime-law' },
        { id: 3, name: 'Maritime Accidents', description: 'Maritime injury and accident cases', slug: 'accidents', featureSlug: 'maritime-law' },
        { id: 4, name: 'Charter Agreements', description: 'Vessel charter and agreements', slug: 'charter', featureSlug: 'maritime-law' },
        { id: 5, name: 'Jones Act Cases', description: 'Jones Act maritime claims', slug: 'jones-act', featureSlug: 'maritime-law' }
    ],
    'construction-law': [
        { id: 1, name: 'Construction Contracts', description: 'Construction contract drafting', slug: 'contracts', featureSlug: 'construction-law' },
        { id: 2, name: 'Construction Disputes', description: 'Construction defect litigation', slug: 'disputes', featureSlug: 'construction-law' },
        { id: 3, name: 'Mechanic Liens', description: 'Mechanic lien claims', slug: 'liens', featureSlug: 'construction-law' },
        { id: 4, name: 'Payment Disputes', description: 'Payment and billing disputes', slug: 'payment', featureSlug: 'construction-law' },
        { id: 5, name: 'Safety Compliance', description: 'Construction safety and OSHA', slug: 'safety', featureSlug: 'construction-law' }
    ],
    'franchise-law': [
        { id: 1, name: 'Franchise Agreements', description: 'Franchise contract negotiation', slug: 'agreements', featureSlug: 'franchise-law' },
        { id: 2, name: 'FDD Preparation', description: 'Franchise disclosure documents', slug: 'fdd', featureSlug: 'franchise-law' },
        { id: 3, name: 'Franchise Compliance', description: 'Franchise regulatory compliance', slug: 'compliance', featureSlug: 'franchise-law' },
        { id: 4, name: 'Franchise Disputes', description: 'Franchisor-franchisee disputes', slug: 'disputes', featureSlug: 'franchise-law' },
        { id: 5, name: 'Territory Management', description: 'Franchise territory rights', slug: 'territory', featureSlug: 'franchise-law' }
    ],
    'sports-entertainment': [
        { id: 1, name: 'Athlete Contracts', description: 'Sports contract negotiation', slug: 'contracts', featureSlug: 'sports-entertainment' },
        { id: 2, name: 'Entertainment Deals', description: 'Entertainment industry contracts', slug: 'entertainment', featureSlug: 'sports-entertainment' },
        { id: 3, name: 'Licensing & Endorsements', description: 'Licensing and endorsement deals', slug: 'licensing', featureSlug: 'sports-entertainment' },
        { id: 4, name: 'Sports Litigation', description: 'Sports-related disputes', slug: 'litigation', featureSlug: 'sports-entertainment' },
        { id: 5, name: 'Agent Representation', description: 'Sports agent matters', slug: 'agents', featureSlug: 'sports-entertainment' }
    ],
    'technology-transactions': [
        { id: 1, name: 'Software Licensing', description: 'Software license agreements', slug: 'licensing', featureSlug: 'technology-transactions' },
        { id: 2, name: 'SaaS Agreements', description: 'SaaS contracts and terms', slug: 'saas', featureSlug: 'technology-transactions' },
        { id: 3, name: 'Technology Transfers', description: 'Technology transfer agreements', slug: 'transfers', featureSlug: 'technology-transactions' },
        { id: 4, name: 'Cloud Computing', description: 'Cloud service agreements', slug: 'cloud', featureSlug: 'technology-transactions' },
        { id: 5, name: 'IT Procurement', description: 'Technology procurement contracts', slug: 'procurement', featureSlug: 'technology-transactions' }
    ],
    'data-privacy': [
        { id: 1, name: 'GDPR Compliance', description: 'European data protection compliance', slug: 'gdpr', featureSlug: 'data-privacy' },
        { id: 2, name: 'CCPA Compliance', description: 'California privacy law compliance', slug: 'ccpa', featureSlug: 'data-privacy' },
        { id: 3, name: 'Privacy Policies', description: 'Privacy policy development', slug: 'policies', featureSlug: 'data-privacy' },
        { id: 4, name: 'Data Breach Response', description: 'Data breach notification and response', slug: 'breach', featureSlug: 'data-privacy' },
        { id: 5, name: 'Privacy Audits', description: 'Privacy program assessments', slug: 'audits', featureSlug: 'data-privacy' }
    ],
    'cybersecurity-legal': [
        { id: 1, name: 'Incident Response', description: 'Cybersecurity incident management', slug: 'incident', featureSlug: 'cybersecurity-legal' },
        { id: 2, name: 'Security Compliance', description: 'Cybersecurity regulatory compliance', slug: 'compliance', featureSlug: 'cybersecurity-legal' },
        { id: 3, name: 'Cyber Insurance', description: 'Cyber insurance claims', slug: 'insurance', featureSlug: 'cybersecurity-legal' },
        { id: 4, name: 'Ransomware Cases', description: 'Ransomware attack response', slug: 'ransomware', featureSlug: 'cybersecurity-legal' }
    ],
    'government-contracts': [
        { id: 1, name: 'Federal Contracting', description: 'Federal government contract management', slug: 'federal', featureSlug: 'government-contracts' },
        { id: 2, name: 'State & Local Contracts', description: 'State and local government contracts', slug: 'state-local', featureSlug: 'government-contracts' },
        { id: 3, name: 'Contract Compliance', description: 'Government contract compliance', slug: 'compliance', featureSlug: 'government-contracts' },
        { id: 4, name: 'Bid Protests', description: 'Government bid protest matters', slug: 'protests', featureSlug: 'government-contracts' }
    ],
    'non-profit-law': [
        { id: 1, name: '501(c)(3) Formation', description: 'Non-profit formation and exemption', slug: 'formation', featureSlug: 'non-profit-law' },
        { id: 2, name: 'Non-Profit Compliance', description: 'Non-profit regulatory compliance', slug: 'compliance', featureSlug: 'non-profit-law' },
        { id: 3, name: 'Grant Management', description: 'Grant agreements and compliance', slug: 'grants', featureSlug: 'non-profit-law' },
        { id: 4, name: 'Board Governance', description: 'Non-profit board matters', slug: 'governance', featureSlug: 'non-profit-law' }
    ],
    'education-law': [
        { id: 1, name: 'Student Matters', description: 'Student discipline and rights', slug: 'students', featureSlug: 'education-law' },
        { id: 2, name: 'Title IX Compliance', description: 'Title IX investigations and compliance', slug: 'title-ix', featureSlug: 'education-law' },
        { id: 3, name: 'Special Education', description: 'IEP and special education matters', slug: 'special-ed', featureSlug: 'education-law' },
        { id: 4, name: 'Education Employment', description: 'Faculty and staff employment matters', slug: 'employment', featureSlug: 'education-law' }
    ],
    'labor-relations': [
        { id: 1, name: 'Collective Bargaining', description: 'Union contract negotiations', slug: 'bargaining', featureSlug: 'labor-relations' },
        { id: 2, name: 'Union Elections', description: 'Union representation elections', slug: 'elections', featureSlug: 'labor-relations' },
        { id: 3, name: 'Grievances & Arbitration', description: 'Union grievance procedures', slug: 'grievances', featureSlug: 'labor-relations' },
        { id: 4, name: 'Labor Disputes', description: 'Strikes and labor disputes', slug: 'disputes', featureSlug: 'labor-relations' }
    ],
    'international-trade': [
        { id: 1, name: 'Import/Export Compliance', description: 'Trade compliance management', slug: 'compliance', featureSlug: 'international-trade' },
        { id: 2, name: 'Customs Matters', description: 'Customs classification and duties', slug: 'customs', featureSlug: 'international-trade' },
        { id: 3, name: 'Trade Sanctions', description: 'Export controls and sanctions', slug: 'sanctions', featureSlug: 'international-trade' },
        { id: 4, name: 'Trade Disputes', description: 'International trade litigation', slug: 'disputes', featureSlug: 'international-trade' }
    ],
    'antitrust-competition': [
        { id: 1, name: 'Antitrust Investigations', description: 'DOJ and FTC investigations', slug: 'investigations', featureSlug: 'antitrust-competition' },
        { id: 2, name: 'Merger Review', description: 'Antitrust merger clearance', slug: 'mergers', featureSlug: 'antitrust-competition' },
        { id: 3, name: 'Competition Compliance', description: 'Antitrust compliance programs', slug: 'compliance', featureSlug: 'antitrust-competition' },
        { id: 4, name: 'Antitrust Litigation', description: 'Antitrust litigation defense', slug: 'litigation', featureSlug: 'antitrust-competition' }
    ],
    'white-collar-crime': [
        { id: 1, name: 'Fraud Defense', description: 'Fraud and financial crime defense', slug: 'fraud', featureSlug: 'white-collar-crime' },
        { id: 2, name: 'Securities Fraud', description: 'Securities fraud defense', slug: 'securities', featureSlug: 'white-collar-crime' },
        { id: 3, name: 'Internal Investigations', description: 'Corporate internal investigations', slug: 'investigations', featureSlug: 'white-collar-crime' },
        { id: 4, name: 'Regulatory Defense', description: 'Regulatory enforcement defense', slug: 'regulatory', featureSlug: 'white-collar-crime' }
    ],
    'civil-rights': [
        { id: 1, name: 'Discrimination Cases', description: 'Employment discrimination matters', slug: 'discrimination', featureSlug: 'civil-rights' },
        { id: 2, name: 'Police Misconduct', description: 'Section 1983 civil rights claims', slug: 'police', featureSlug: 'civil-rights' },
        { id: 3, name: 'Voting Rights', description: 'Voting rights and election matters', slug: 'voting', featureSlug: 'civil-rights' },
        { id: 4, name: 'Civil Liberties', description: 'Constitutional rights litigation', slug: 'liberties', featureSlug: 'civil-rights' }
    ],
    'municipal-law': [
        { id: 1, name: 'Municipal Governance', description: 'City and county legal matters', slug: 'governance', featureSlug: 'municipal-law' },
        { id: 2, name: 'Land Use & Zoning', description: 'Municipal land use matters', slug: 'zoning', featureSlug: 'municipal-law' },
        { id: 3, name: 'Public Finance', description: 'Municipal bonds and financing', slug: 'finance', featureSlug: 'municipal-law' },
        { id: 4, name: 'Municipal Litigation', description: 'Municipal liability defense', slug: 'litigation', featureSlug: 'municipal-law' }
    ],
    'veterans-affairs': [
        { id: 1, name: 'VA Benefits Claims', description: 'Veterans benefits applications', slug: 'benefits', featureSlug: 'veterans-affairs' },
        { id: 2, name: 'Disability Claims', description: 'VA disability compensation', slug: 'disability', featureSlug: 'veterans-affairs' },
        { id: 3, name: 'Appeals & Reviews', description: 'VA appeals and board reviews', slug: 'appeals', featureSlug: 'veterans-affairs' },
        { id: 4, name: 'Military Records', description: 'Military records correction', slug: 'records', featureSlug: 'veterans-affairs' }
    ],
    'social-security': [
        { id: 1, name: 'SSDI Claims', description: 'Social Security Disability Insurance', slug: 'ssdi', featureSlug: 'social-security' },
        { id: 2, name: 'SSI Claims', description: 'Supplemental Security Income', slug: 'ssi', featureSlug: 'social-security' },
        { id: 3, name: 'Appeals Process', description: 'Social Security appeals', slug: 'appeals', featureSlug: 'social-security' },
        { id: 4, name: 'Medical Evidence', description: 'Medical documentation and evidence', slug: 'medical', featureSlug: 'social-security' }
    ],
    'consumer-protection': [
        { id: 1, name: 'Consumer Fraud', description: 'Consumer fraud and deception cases', slug: 'fraud', featureSlug: 'consumer-protection' },
        { id: 2, name: 'Debt Collection', description: 'FDCPA and debt collection defense', slug: 'debt', featureSlug: 'consumer-protection' },
        { id: 3, name: 'Lemon Law Cases', description: 'Vehicle lemon law claims', slug: 'lemon-law', featureSlug: 'consumer-protection' },
        { id: 4, name: 'Product Liability', description: 'Defective product cases', slug: 'product', featureSlug: 'consumer-protection' }
    ],
    'landlord-tenant': [
        { id: 1, name: 'Eviction Cases', description: 'Landlord eviction proceedings', slug: 'eviction', featureSlug: 'landlord-tenant' },
        { id: 2, name: 'Lease Disputes', description: 'Lease agreement disputes', slug: 'disputes', featureSlug: 'landlord-tenant' },
        { id: 3, name: 'Security Deposits', description: 'Security deposit matters', slug: 'deposits', featureSlug: 'landlord-tenant' },
        { id: 4, name: 'Housing Discrimination', description: 'Fair Housing Act cases', slug: 'discrimination', featureSlug: 'landlord-tenant' }
    ],
    'pro-bono': [
        { id: 1, name: 'Pro Bono Case Management', description: 'Track pro bono matters', slug: 'cases', featureSlug: 'pro-bono' },
        { id: 2, name: 'Pro Bono Hours', description: 'Track pro bono time and reporting', slug: 'hours', featureSlug: 'pro-bono' },
        { id: 3, name: 'Volunteer Coordination', description: 'Coordinate pro bono volunteers', slug: 'volunteers', featureSlug: 'pro-bono' },
        { id: 4, name: 'Pro Bono Reporting', description: 'Pro bono annual reporting', slug: 'reporting', featureSlug: 'pro-bono' }
    ]
};
