import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiInfo() {
    return {
      name: 'Yellow Cross',
      version: '2.0.0',
      description: 'Enterprise Law Firm Practice Management Platform - NestJS',
      framework: 'NestJS',
      totalFeatures: 60,
      features: [
        'Case Management System',
        'Client Relationship Management (CRM)',
        'Document Management System',
        'Time & Billing Management',
        'Calendar & Scheduling System',
        'Task & Workflow Management',
        'Legal Research & Knowledge Base',
        'Court & Docket Management',
        'Contract Management',
        'eDiscovery & Evidence Management',
        'Compliance & Risk Management',
        'Reporting & Analytics',
        'Communication & Collaboration',
        'Security & Access Control',
        'Integration & API Management',
        'Litigation Management',
        'Mediation & ADR',
        'Intellectual Property Management',
        'Real Estate Transactions',
        'Corporate Governance',
        'Mergers & Acquisitions',
        'Employment Law',
        'Immigration Law',
        'Family Law',
        'Criminal Defense',
        'Bankruptcy Management',
        'Estate Planning',
        'Tax Law',
        'Personal Injury',
        'Class Action Management',
        'Appellate Practice',
        'Environmental Law',
        'Healthcare Law',
        'Insurance Defense',
        'Securities Law',
        'Financial Services',
        'Energy & Utilities',
        'Telecommunications',
        'Aviation Law',
        'Maritime Law',
        'Construction Law',
        'Franchise Law',
        'Sports & Entertainment',
        'Technology Transactions',
        'Data Privacy & GDPR',
        'Cybersecurity Legal',
        'Government Contracts',
        'Non-Profit Law',
        'Education Law',
        'Labor Relations',
        'International Trade',
        'Antitrust & Competition',
        'White Collar Crime',
        'Civil Rights',
        'Municipal Law',
        'Veterans Affairs',
        'Social Security',
        'Consumer Protection',
        'Landlord-Tenant Law',
        'Pro Bono Management',
      ],
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
