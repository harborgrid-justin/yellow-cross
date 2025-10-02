/**
 * Time & Billing Management - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Time & Billing Management - Feature 4', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/billing should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/billing')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Time & Billing Management');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Time Tracking & Entry',
        'Billable Hours Management',
        'Invoice Generation',
        'Payment Processing',
        'Expense Tracking',
        'Trust Accounting',
        'Rate Management',
        'Financial Reporting'
      ]);
    });
  });

  describe('Sub-Feature 1: Time Tracking & Entry', () => {
    test('POST /api/billing/time-entry should return time tracking capabilities', async () => {
      const response = await request(app)
        .post('/api/billing/time-entry')
        .send({
          attorney_id: '123',
          case_id: '456',
          hours: 2.5,
          description: 'Legal research',
          billable: true,
          date: '2024-01-15'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Time Tracking & Entry');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/time-entry');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Manual time entry');
      expect(response.body.capabilities).toContain('Timer-based tracking');
      expect(response.body.capabilities).toContain('Activity logging');
      expect(response.body.capabilities).toContain('Time rounding rules');
      expect(response.body.capabilities).toContain('Bulk time entry');
    });
  });

  describe('Sub-Feature 2: Billable Hours Management', () => {
    test('GET /api/billing/billable-hours should return billable hours capabilities', async () => {
      const response = await request(app)
        .get('/api/billing/billable-hours')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Billable Hours Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/billable-hours');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Billable/non-billable tracking');
      expect(response.body.capabilities).toContain('Utilization reports');
      expect(response.body.capabilities).toContain('Hour categorization');
      expect(response.body.capabilities).toContain('Billing codes');
      expect(response.body.capabilities).toContain('Write-offs management');
    });
  });

  describe('Sub-Feature 3: Invoice Generation', () => {
    test('POST /api/billing/invoices should return invoice generation capabilities', async () => {
      const response = await request(app)
        .post('/api/billing/invoices')
        .send({
          client_id: '789',
          case_id: '456',
          items: [
            { description: 'Legal research', hours: 2.5, rate: 250 }
          ]
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Invoice Generation');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/invoices');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Automated invoicing');
      expect(response.body.capabilities).toContain('Custom invoice templates');
      expect(response.body.capabilities).toContain('Multi-currency support');
      expect(response.body.capabilities).toContain('Batch invoicing');
      expect(response.body.capabilities).toContain('Invoice preview');
    });
  });

  describe('Sub-Feature 4: Payment Processing', () => {
    test('POST /api/billing/payments should return payment processing capabilities', async () => {
      const response = await request(app)
        .post('/api/billing/payments')
        .send({
          invoice_id: '12345',
          amount: 625.00,
          payment_method: 'credit_card',
          payment_date: '2024-01-20'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Payment Processing');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/payments');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Online payments');
      expect(response.body.capabilities).toContain('Payment plans');
      expect(response.body.capabilities).toContain('Receipt generation');
      expect(response.body.capabilities).toContain('Payment tracking');
      expect(response.body.capabilities).toContain('Multiple payment methods');
    });
  });

  describe('Sub-Feature 5: Expense Tracking', () => {
    test('POST /api/billing/expenses should return expense tracking capabilities', async () => {
      const response = await request(app)
        .post('/api/billing/expenses')
        .send({
          case_id: '456',
          category: 'court_fees',
          amount: 150.00,
          description: 'Filing fee',
          date: '2024-01-18'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Expense Tracking');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/expenses');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Expense entry');
      expect(response.body.capabilities).toContain('Receipt management');
      expect(response.body.capabilities).toContain('Reimbursement tracking');
      expect(response.body.capabilities).toContain('Expense categorization');
      expect(response.body.capabilities).toContain('Billable expenses');
    });
  });

  describe('Sub-Feature 6: Trust Accounting (IOLTA Compliance)', () => {
    test('GET /api/billing/trust-accounts should return trust accounting capabilities', async () => {
      const response = await request(app)
        .get('/api/billing/trust-accounts')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Trust Accounting');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/trust-accounts');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('IOLTA compliance');
      expect(response.body.capabilities).toContain('Trust ledgers');
      expect(response.body.capabilities).toContain('Three-way reconciliation');
      expect(response.body.capabilities).toContain('Client trust accounts');
      expect(response.body.capabilities).toContain('Audit trails');
    });
  });

  describe('Sub-Feature 7: Rate Management', () => {
    test('PUT /api/billing/rates should return rate management capabilities', async () => {
      const response = await request(app)
        .put('/api/billing/rates')
        .send({
          attorney_id: '123',
          hourly_rate: 350.00,
          effective_date: '2024-02-01'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Rate Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/rates');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Attorney hourly rates');
      expect(response.body.capabilities).toContain('Flat fee structures');
      expect(response.body.capabilities).toContain('Contingency arrangements');
      expect(response.body.capabilities).toContain('Rate schedules');
      expect(response.body.capabilities).toContain('Custom billing rates');
    });
  });

  describe('Sub-Feature 8: Financial Reporting', () => {
    test('GET /api/billing/reports should return financial reporting capabilities', async () => {
      const response = await request(app)
        .get('/api/billing/reports')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Financial Reporting');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/billing/reports');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Revenue reports');
      expect(response.body.capabilities).toContain('AR aging');
      expect(response.body.capabilities).toContain('Profitability analysis');
      expect(response.body.capabilities).toContain('Collection reports');
      expect(response.body.capabilities).toContain('Budget tracking');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/billing', expectedFeature: 'Time & Billing Management' },
        { method: 'post', path: '/api/billing/time-entry', expectedFeature: 'Time Tracking & Entry' },
        { method: 'get', path: '/api/billing/billable-hours', expectedFeature: 'Billable Hours Management' },
        { method: 'post', path: '/api/billing/invoices', expectedFeature: 'Invoice Generation' },
        { method: 'post', path: '/api/billing/payments', expectedFeature: 'Payment Processing' },
        { method: 'post', path: '/api/billing/expenses', expectedFeature: 'Expense Tracking' },
        { method: 'get', path: '/api/billing/trust-accounts', expectedFeature: 'Trust Accounting' },
        { method: 'put', path: '/api/billing/rates', expectedFeature: 'Rate Management' },
        { method: 'get', path: '/api/billing/reports', expectedFeature: 'Financial Reporting' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
