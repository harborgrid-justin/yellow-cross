# Time & Billing Management - Usage Guide

## Quick Start Guide

This guide provides practical examples and step-by-step instructions for using the Time & Billing Management system.

---

## Table of Contents

1. [Time Tracking & Entry](#time-tracking--entry)
2. [Billable Hours Management](#billable-hours-management)
3. [Invoice Generation](#invoice-generation)
4. [Payment Processing](#payment-processing)
5. [Expense Tracking](#expense-tracking)
6. [Trust Accounting](#trust-accounting)
7. [Rate Management](#rate-management)
8. [Financial Reporting](#financial-reporting)

---

## Time Tracking & Entry

### Creating a Simple Time Entry

```bash
curl -X POST http://localhost:3000/api/billing/time-entry \
  -H "Content-Type: application/json" \
  -d '{
    "attorneyName": "Jane Smith",
    "caseNumber": "CASE-2024-12345",
    "clientName": "Acme Corporation",
    "date": "2024-01-15",
    "hours": 2,
    "minutes": 30,
    "description": "Reviewed contract documents and drafted memorandum",
    "taskType": "Document Review",
    "billable": true,
    "billingRate": 250,
    "createdBy": "jane.smith"
  }'
```

### Creating Time Entry with Rounding

```bash
curl -X POST http://localhost:3000/api/billing/time-entry \
  -H "Content-Type: application/json" \
  -d '{
    "attorneyName": "John Doe",
    "caseNumber": "CASE-2024-12346",
    "clientName": "Widget Inc",
    "date": "2024-01-15",
    "hours": 0,
    "minutes": 23,
    "description": "Phone consultation with client",
    "taskType": "Phone Call",
    "billable": true,
    "billingRate": 300,
    "roundingRule": "6 Minutes",
    "createdBy": "john.doe"
  }'
```
**Result**: 23 minutes will be rounded up to 24 minutes (4 billing increments of 6 minutes)

### Bulk Time Entry

```bash
curl -X POST http://localhost:3000/api/billing/time-entry/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [
      {
        "attorneyName": "Jane Smith",
        "caseNumber": "CASE-2024-12345",
        "date": "2024-01-15",
        "hours": 1,
        "description": "Legal research",
        "taskType": "Legal Research",
        "billable": true,
        "billingRate": 250,
        "createdBy": "jane.smith"
      },
      {
        "attorneyName": "Jane Smith",
        "caseNumber": "CASE-2024-12345",
        "date": "2024-01-15",
        "hours": 2,
        "description": "Document drafting",
        "taskType": "Document Drafting",
        "billable": true,
        "billingRate": 250,
        "createdBy": "jane.smith"
      }
    ],
    "applyRounding": true,
    "roundingRule": "6 Minutes",
    "createdBy": "jane.smith"
  }'
```

### Retrieving Time Entries

```bash
# Get all time entries
curl http://localhost:3000/api/billing/time-entry

# Filter by attorney
curl http://localhost:3000/api/billing/time-entry?attorneyName=Jane%20Smith

# Filter by date range
curl "http://localhost:3000/api/billing/time-entry?startDate=2024-01-01&endDate=2024-01-31"

# Filter billable entries only
curl http://localhost:3000/api/billing/time-entry?billable=true

# Paginated results
curl "http://localhost:3000/api/billing/time-entry?page=1&limit=10"
```

### Updating a Time Entry

```bash
curl -X PUT http://localhost:3000/api/billing/time-entry/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "hours": 3,
    "minutes": 0,
    "description": "Updated description with additional details",
    "lastModifiedBy": "jane.smith"
  }'
```

---

## Billable Hours Management

### Getting Billable Hours Summary

```bash
# Basic summary
curl "http://localhost:3000/api/billing/billable-hours?startDate=2024-01-01&endDate=2024-01-31"

# Group by attorney
curl "http://localhost:3000/api/billing/billable-hours?startDate=2024-01-01&endDate=2024-01-31&groupBy=attorney"

# Group by client
curl "http://localhost:3000/api/billing/billable-hours?startDate=2024-01-01&endDate=2024-01-31&groupBy=client"

# Filter by attorney
curl "http://localhost:3000/api/billing/billable-hours?startDate=2024-01-01&endDate=2024-01-31&attorneyId=507f1f77bcf86cd799439011"

# Only billable hours
curl "http://localhost:3000/api/billing/billable-hours?startDate=2024-01-01&endDate=2024-01-31&billable=true"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBillableMinutes": 14400,
      "totalNonBillableMinutes": 3600,
      "totalBillableAmount": 60000,
      "totalEntries": 120,
      "billableEntries": 100,
      "billableHours": 240,
      "nonBillableHours": 60,
      "utilizationRate": 80
    },
    "breakdown": [
      {
        "_id": "Jane Smith",
        "billableMinutes": 9600,
        "nonBillableMinutes": 2400,
        "billableAmount": 40000,
        "entryCount": 80,
        "billableHours": 160,
        "nonBillableHours": 40
      }
    ]
  }
}
```

---

## Invoice Generation

### Creating an Invoice

```bash
curl -X POST http://localhost:3000/api/billing/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "507f1f77bcf86cd799439011",
    "clientName": "Acme Corporation",
    "clientEmail": "billing@acme.com",
    "billingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "caseNumber": "CASE-2024-12345",
    "invoiceDate": "2024-01-31",
    "dueDate": "2024-02-28",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-31",
    "timeEntryIds": [
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013"
    ],
    "expenseIds": [
      "507f1f77bcf86cd799439014"
    ],
    "discountPercent": 5,
    "taxPercent": 8.5,
    "paymentTerms": "Net 30",
    "template": "Detailed",
    "customMessage": "Thank you for your business. Please remit payment within 30 days.",
    "notes": "Invoice for legal services rendered in January 2024",
    "createdBy": "admin"
  }'
```

### Retrieving Invoices

```bash
# Get all invoices
curl http://localhost:3000/api/billing/invoices

# Filter by client
curl "http://localhost:3000/api/billing/invoices?clientId=507f1f77bcf86cd799439011"

# Filter by status
curl "http://localhost:3000/api/billing/invoices?status=Overdue"

# Filter by date range
curl "http://localhost:3000/api/billing/invoices?startDate=2024-01-01&endDate=2024-01-31"

# Get specific invoice
curl http://localhost:3000/api/billing/invoices/507f1f77bcf86cd799439015
```

### Sending an Invoice

```bash
curl -X POST http://localhost:3000/api/billing/invoices/507f1f77bcf86cd799439015/send \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "method": "Email"
  }'
```

---

## Payment Processing

### Recording a Payment

```bash
curl -X POST http://localhost:3000/api/billing/payments \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "507f1f77bcf86cd799439015",
    "clientId": "507f1f77bcf86cd799439011",
    "clientName": "Acme Corporation",
    "paymentDate": "2024-02-15",
    "amount": 5000,
    "currency": "USD",
    "paymentMethod": "Credit Card",
    "cardType": "Visa",
    "cardLast4": "4242",
    "transactionId": "ch_1234567890",
    "gateway": "Stripe",
    "referenceNumber": "PAY-REF-12345",
    "description": "Payment for invoice INV-2024-12345",
    "notes": "Processed via Stripe",
    "createdBy": "admin"
  }'
```

### Recording a Check Payment

```bash
curl -X POST http://localhost:3000/api/billing/payments \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "507f1f77bcf86cd799439015",
    "clientId": "507f1f77bcf86cd799439011",
    "clientName": "Acme Corporation",
    "amount": 3000,
    "paymentMethod": "Check",
    "checkNumber": "1234",
    "bankName": "First National Bank",
    "referenceNumber": "Check #1234",
    "description": "Partial payment by check",
    "createdBy": "admin"
  }'
```

### Retrieving Payments

```bash
# Get all payments
curl http://localhost:3000/api/billing/payments

# Filter by client
curl "http://localhost:3000/api/billing/payments?clientId=507f1f77bcf86cd799439011"

# Filter by invoice
curl "http://localhost:3000/api/billing/payments?invoiceId=507f1f77bcf86cd799439015"

# Filter by status
curl "http://localhost:3000/api/billing/payments?status=Completed"

# Filter by date range
curl "http://localhost:3000/api/billing/payments?startDate=2024-01-01&endDate=2024-01-31"
```

---

## Expense Tracking

### Creating an Expense

```bash
curl -X POST http://localhost:3000/api/billing/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": "507f1f77bcf86cd799439016",
    "caseNumber": "CASE-2024-12345",
    "clientId": "507f1f77bcf86cd799439011",
    "clientName": "Acme Corporation",
    "date": "2024-01-15",
    "description": "Court filing fee for motion to dismiss",
    "category": "Court Fees",
    "amount": 350,
    "currency": "USD",
    "billable": true,
    "markup": 0,
    "paidBy": "john.doe",
    "reimbursable": true,
    "paymentMethod": "Firm Account",
    "vendor": "County Clerk",
    "receiptUrl": "https://example.com/receipts/12345.pdf",
    "receiptFilename": "filing-fee-receipt.pdf",
    "notes": "Motion to dismiss in civil litigation",
    "createdBy": "john.doe"
  }'
```

### Creating a Mileage Expense

```bash
curl -X POST http://localhost:3000/api/billing/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "caseNumber": "CASE-2024-12345",
    "clientName": "Acme Corporation",
    "date": "2024-01-15",
    "description": "Travel to courthouse for hearing",
    "category": "Travel",
    "distance": 45,
    "distanceUnit": "miles",
    "mileageRate": 0.67,
    "billable": true,
    "paidBy": "jane.smith",
    "reimbursable": true,
    "paymentMethod": "Personal",
    "notes": "Roundtrip to federal courthouse",
    "createdBy": "jane.smith"
  }'
```
**Result**: Amount automatically calculated as 45 × $0.67 = $30.15

### Retrieving Expenses

```bash
# Get all expenses
curl http://localhost:3000/api/billing/expenses

# Filter by case
curl "http://localhost:3000/api/billing/expenses?caseId=507f1f77bcf86cd799439016"

# Filter by category
curl "http://localhost:3000/api/billing/expenses?category=Travel"

# Filter billable expenses
curl "http://localhost:3000/api/billing/expenses?billable=true"

# Get expense summary
curl http://localhost:3000/api/billing/expenses/summary

# Get expense summary by case
curl "http://localhost:3000/api/billing/expenses/summary?caseId=507f1f77bcf86cd799439016"
```

---

## Trust Accounting

### Creating a Trust Account

```bash
curl -X POST http://localhost:3000/api/billing/trust-accounts \
  -H "Content-Type: application/json" \
  -d '{
    "accountName": "Acme Corporation Client Trust Account",
    "clientId": "507f1f77bcf86cd799439011",
    "clientName": "Acme Corporation",
    "bankName": "First National Bank",
    "bankAccountNumber": "1234567890",
    "bankRoutingNumber": "021000021",
    "bankAddress": {
      "street": "100 Bank Plaza",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002"
    },
    "accountType": "Client Trust",
    "minimumBalance": 1000,
    "notes": "Retainer trust account for litigation matter",
    "createdBy": "admin"
  }'
```

### Recording a Deposit

```bash
curl -X POST http://localhost:3000/api/billing/trust-accounts/507f1f77bcf86cd799439017/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Deposit",
    "amount": 10000,
    "description": "Initial retainer deposit",
    "reference": "Check #5678",
    "checkNumber": "5678",
    "performedBy": "admin"
  }'
```

### Recording a Withdrawal

```bash
curl -X POST http://localhost:3000/api/billing/trust-accounts/507f1f77bcf86cd799439017/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Withdrawal",
    "amount": 2500,
    "description": "Payment of legal fees per invoice INV-2024-12345",
    "reference": "INV-2024-12345",
    "relatedInvoiceId": "507f1f77bcf86cd799439015",
    "performedBy": "admin"
  }'
```

### Reconciling a Trust Account

```bash
curl -X POST http://localhost:3000/api/billing/trust-accounts/507f1f77bcf86cd799439017/reconcile \
  -H "Content-Type: application/json" \
  -d '{
    "bankBalance": 7500.00,
    "notes": "January 2024 bank reconciliation - all transactions match",
    "reconciledBy": "admin"
  }'
```

### Getting Trust Accounts

```bash
# Get all trust accounts
curl http://localhost:3000/api/billing/trust-accounts

# Filter by client
curl "http://localhost:3000/api/billing/trust-accounts?clientId=507f1f77bcf86cd799439011"

# Filter by account type
curl "http://localhost:3000/api/billing/trust-accounts?accountType=IOLTA"

# Get IOLTA summary
curl http://localhost:3000/api/billing/trust-accounts/iolta/summary
```

---

## Rate Management

### Creating an Hourly Rate

```bash
curl -X POST http://localhost:3000/api/billing/rates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Senior Partner Hourly Rate",
    "description": "Standard hourly rate for senior partners",
    "rateType": "Hourly",
    "hourlyRate": 500,
    "currency": "USD",
    "attorneyId": "507f1f77bcf86cd799439018",
    "attorneyName": "Jane Smith",
    "practiceArea": "Litigation",
    "billingIncrement": 6,
    "roundingRule": "Up",
    "effectiveDate": "2024-01-01",
    "createdBy": "admin"
  }'
```

### Creating a Flat Fee Rate

```bash
curl -X POST http://localhost:3000/api/billing/rates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Simple Contract Review Flat Fee",
    "description": "Flat fee for reviewing standard commercial contracts",
    "rateType": "Flat Fee",
    "flatFeeAmount": 2500,
    "flatFeeIncludes": "Initial review, redline comments, and one revision",
    "flatFeeExcludes": "Extensive negotiations or multiple revisions",
    "practiceArea": "Corporate Law",
    "requiresRetainer": true,
    "retainerAmount": 2500,
    "retainerType": "Flat Fee",
    "effectiveDate": "2024-01-01",
    "createdBy": "admin"
  }'
```

### Creating a Contingency Fee Rate

```bash
curl -X POST http://localhost:3000/api/billing/rates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal Injury Contingency",
    "description": "Tiered contingency fee for personal injury cases",
    "rateType": "Contingency",
    "contingencyPercent": 33,
    "practiceArea": "Personal Injury",
    "effectiveDate": "2024-01-01",
    "notes": "33% of settlement or judgment amount",
    "createdBy": "admin"
  }'
```

### Retrieving Rates

```bash
# Get all rates
curl http://localhost:3000/api/billing/rates

# Filter by attorney
curl "http://localhost:3000/api/billing/rates?attorneyId=507f1f77bcf86cd799439018"

# Filter by rate type
curl "http://localhost:3000/api/billing/rates?rateType=Hourly"

# Filter by practice area
curl "http://localhost:3000/api/billing/rates?practiceArea=Litigation"

# Get active rates only
curl "http://localhost:3000/api/billing/rates?status=Active"
```

---

## Financial Reporting

### Revenue Report

```bash
# Monthly revenue report
curl "http://localhost:3000/api/billing/reports?reportType=Revenue&startDate=2024-01-01&endDate=2024-12-31&groupBy=month"

# Daily revenue report
curl "http://localhost:3000/api/billing/reports?reportType=Revenue&startDate=2024-01-01&endDate=2024-01-31&groupBy=day"

# Revenue by attorney
curl "http://localhost:3000/api/billing/reports?reportType=Revenue&startDate=2024-01-01&endDate=2024-01-31&attorneyId=507f1f77bcf86cd799439018"
```

### AR Aging Report

```bash
# Overall AR aging
curl "http://localhost:3000/api/billing/reports?reportType=AR%20Aging&startDate=2024-01-01&endDate=2024-01-31"

# AR aging by client
curl "http://localhost:3000/api/billing/reports?reportType=AR%20Aging&startDate=2024-01-01&endDate=2024-01-31&clientId=507f1f77bcf86cd799439011"
```

**Response Example:**
```json
{
  "success": true,
  "reportType": "AR Aging",
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "data": {
    "totalOutstanding": 150000,
    "current": 50000,
    "days30": 40000,
    "days60": 35000,
    "days90plus": 25000,
    "invoiceCount": 45
  }
}
```

### Time Summary Report

```bash
# Time summary by attorney
curl "http://localhost:3000/api/billing/reports?reportType=Time%20Summary&startDate=2024-01-01&endDate=2024-01-31&attorneyId=507f1f77bcf86cd799439018"

# Time summary by case
curl "http://localhost:3000/api/billing/reports?reportType=Time%20Summary&startDate=2024-01-01&endDate=2024-01-31&caseId=507f1f77bcf86cd799439016"
```

### Expense Summary Report

```bash
# Overall expense summary
curl "http://localhost:3000/api/billing/reports?reportType=Expense%20Summary&startDate=2024-01-01&endDate=2024-01-31"

# Expense summary by case
curl "http://localhost:3000/api/billing/reports?reportType=Expense%20Summary&startDate=2024-01-01&endDate=2024-01-31&caseId=507f1f77bcf86cd799439016"
```

---

## Common Workflows

### Complete Billing Workflow

**Step 1: Create time entries throughout the month**
```bash
# Multiple time entries by different attorneys
```

**Step 2: Review and approve time entries**
```bash
# Manager reviews entries and approves them
```

**Step 3: Generate invoice at end of billing period**
```bash
curl -X POST http://localhost:3000/api/billing/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Acme Corporation",
    "dueDate": "2024-02-28",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-31",
    "timeEntryIds": ["...approved time entry IDs..."],
    "expenseIds": ["...approved expense IDs..."],
    "createdBy": "admin"
  }'
```

**Step 4: Send invoice to client**
```bash
curl -X POST http://localhost:3000/api/billing/invoices/[INVOICE_ID]/send \
  -H "Content-Type: application/json" \
  -d '{ "username": "admin", "method": "Email" }'
```

**Step 5: Record payment when received**
```bash
curl -X POST http://localhost:3000/api/billing/payments \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "[INVOICE_ID]",
    "clientName": "Acme Corporation",
    "amount": 5000,
    "paymentMethod": "Credit Card",
    "createdBy": "admin"
  }'
```

**Step 6: Generate financial reports**
```bash
curl "http://localhost:3000/api/billing/reports?reportType=Revenue&startDate=2024-01-01&endDate=2024-01-31"
```

---

## Tips & Best Practices

### Time Entry Tips:
1. Enter time daily for accuracy
2. Use detailed descriptions
3. Apply appropriate task types
4. Mark non-billable time correctly
5. Use rounding rules consistently

### Invoicing Tips:
1. Invoice regularly (monthly or per milestone)
2. Include detailed line items
3. Apply discounts transparently
4. Set clear payment terms
5. Send invoices promptly

### Payment Tips:
1. Record payments immediately
2. Reconcile regularly
3. Follow up on overdue invoices
4. Maintain payment documentation
5. Send receipts promptly

### Trust Account Tips:
1. Reconcile monthly (minimum)
2. Maintain detailed transaction records
3. Perform three-way reconciliation
4. Monitor minimum balances
5. Keep client communications current

### Rate Management Tips:
1. Review rates annually
2. Document rate changes
3. Communicate rate changes to clients
4. Use appropriate rate types
5. Track rate effectiveness

---

## Error Handling

### Common Validation Errors:

**Invalid hours:**
```json
{
  "success": false,
  "message": "Failed to create time entry",
  "error": "\"hours\" must be less than or equal to 24"
}
```

**Missing required fields:**
```json
{
  "success": false,
  "message": "Failed to create invoice",
  "error": "\"clientName\" is required"
}
```

**Invalid amount:**
```json
{
  "success": false,
  "message": "Failed to process payment",
  "error": "\"amount\" must be greater than or equal to 0"
}
```

---

## Testing the API

### Using the Provided Test Suite:

```bash
# Run all tests
npm test

# Run only billing tests
npm test -- tests/time-billing.test.js

# Run with verbose output
npm test -- --verbose
```

### Manual Testing:

```bash
# Check system health
curl http://localhost:3000/health

# Check billing feature overview
curl http://localhost:3000/api/billing

# Verify database connection
curl http://localhost:3000/api/billing | jq .dbConnected
```

---

## Support & Resources

- **API Documentation**: See `API_REFERENCE.md`
- **Business Logic**: See `TIME_BILLING_BUSINESS_LOGIC.md`
- **Test Examples**: See `tests/time-billing.test.js`
- **Model Definitions**: See `src/models/` directory
- **Validation Schemas**: See `src/validators/billingValidators.js`

---

## Conclusion

This usage guide provides practical examples for all 8 sub-features of the Time & Billing Management system. Each example can be adapted to your specific needs and integrated into your workflows. For more detailed technical documentation, refer to the Business Logic documentation and API Reference.
