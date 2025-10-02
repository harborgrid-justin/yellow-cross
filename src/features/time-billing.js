/**
 * Feature 4: Time & Billing Management
 * 8 Sub-Features: Time Tracking & Entry, Billable Hours, Invoice Generation,
 * Payment Processing, Expense Tracking, Trust Accounting, Rate Management, Financial Reporting
 */

const express = require('express');
const router = express.Router();

// Sub-Feature 1: Time Tracking & Entry
router.post('/time-entry', (req, res) => {
  res.json({
    feature: 'Time Tracking & Entry',
    description: 'Manual and automatic time tracking',
    endpoint: '/api/billing/time-entry',
    capabilities: [
      'Manual time entry',
      'Timer-based tracking',
      'Activity logging',
      'Time rounding rules',
      'Bulk time entry'
    ]
  });
});

// Sub-Feature 2: Billable Hours Management
router.get('/billable-hours', (req, res) => {
  res.json({
    feature: 'Billable Hours Management',
    description: 'Track billable vs non-billable hours',
    endpoint: '/api/billing/billable-hours',
    capabilities: [
      'Billable/non-billable tracking',
      'Utilization reports',
      'Hour categorization',
      'Billing codes',
      'Write-offs management'
    ]
  });
});

// Sub-Feature 3: Invoice Generation
router.post('/invoices', (req, res) => {
  res.json({
    feature: 'Invoice Generation',
    description: 'Create professional invoices and statements',
    endpoint: '/api/billing/invoices',
    capabilities: [
      'Automated invoicing',
      'Custom invoice templates',
      'Multi-currency support',
      'Batch invoicing',
      'Invoice preview'
    ]
  });
});

// Sub-Feature 4: Payment Processing
router.post('/payments', (req, res) => {
  res.json({
    feature: 'Payment Processing',
    description: 'Accept payments, payment plans, and receipts',
    endpoint: '/api/billing/payments',
    capabilities: [
      'Online payments',
      'Payment plans',
      'Receipt generation',
      'Payment tracking',
      'Multiple payment methods'
    ]
  });
});

// Sub-Feature 5: Expense Tracking
router.post('/expenses', (req, res) => {
  res.json({
    feature: 'Expense Tracking',
    description: 'Track case-related expenses and reimbursements',
    endpoint: '/api/billing/expenses',
    capabilities: [
      'Expense entry',
      'Receipt management',
      'Reimbursement tracking',
      'Expense categorization',
      'Billable expenses'
    ]
  });
});

// Sub-Feature 6: Trust Accounting
router.get('/trust-accounts', (req, res) => {
  res.json({
    feature: 'Trust Accounting',
    description: 'IOLTA compliance and trust account management',
    endpoint: '/api/billing/trust-accounts',
    capabilities: [
      'IOLTA compliance',
      'Trust ledgers',
      'Three-way reconciliation',
      'Client trust accounts',
      'Audit trails'
    ]
  });
});

// Sub-Feature 7: Rate Management
router.put('/rates', (req, res) => {
  res.json({
    feature: 'Rate Management',
    description: 'Hourly rates, flat fees, and contingency fees',
    endpoint: '/api/billing/rates',
    capabilities: [
      'Attorney hourly rates',
      'Flat fee structures',
      'Contingency arrangements',
      'Rate schedules',
      'Custom billing rates'
    ]
  });
});

// Sub-Feature 8: Financial Reporting
router.get('/reports', (req, res) => {
  res.json({
    feature: 'Financial Reporting',
    description: 'Revenue reports, accounts receivable, profitability',
    endpoint: '/api/billing/reports',
    capabilities: [
      'Revenue reports',
      'AR aging',
      'Profitability analysis',
      'Collection reports',
      'Budget tracking'
    ]
  });
});

// Billing overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Time & Billing Management',
    subFeatures: [
      'Time Tracking & Entry',
      'Billable Hours Management',
      'Invoice Generation',
      'Payment Processing',
      'Expense Tracking',
      'Trust Accounting',
      'Rate Management',
      'Financial Reporting'
    ]
  });
});

module.exports = router;
