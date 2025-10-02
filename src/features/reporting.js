/**
 * Feature 12: Reporting & Analytics
 * 8 Sub-Features: Case Analytics & Metrics, Financial Dashboards, Attorney Performance,
 * Client Analytics, Practice Area Analysis, Custom Report Builder, Predictive Analytics, Executive Dashboards
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const Task = require('../models/Task');
const Document = require('../models/Document');
const Report = require('../models/Report');
const { isConnected } = require('../config/database');
const {
  analyticsQuerySchema,
  financialQuerySchema,
  attorneyPerformanceQuerySchema,
  clientAnalyticsQuerySchema,
  practiceAreaQuerySchema,
  createCustomReportSchema,
  predictiveAnalyticsQuerySchema,
  executiveDashboardQuerySchema
} = require('../validators/reportValidators');

// Helper function to generate report number
const generateReportNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RPT-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Helper function to build date filter
const buildDateFilter = (dateFrom, dateTo) => {
  const filter = {};
  if (dateFrom || dateTo) {
    filter.openedDate = {};
    if (dateFrom) filter.openedDate.$gte = new Date(dateFrom);
    if (dateTo) filter.openedDate.$lte = new Date(dateTo);
  }
  return filter;
};

// Sub-Feature 1: Case Analytics & Metrics
router.get('/case-analytics', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Analytics & Metrics',
        description: 'Case volume, duration, and outcomes',
        endpoint: '/api/reports/case-analytics',
        capabilities: [
          'Case volume trends',
          'Duration analysis',
          'Outcome tracking',
          'Win/loss ratios',
          'Case type distribution'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate query parameters
    const validatedQuery = validateRequest(analyticsQuerySchema, req.query);

    // Build filters
    const filters = { archived: false };
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      filters.openedDate = {};
      if (validatedQuery.dateFrom) filters.openedDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) filters.openedDate.$lte = new Date(validatedQuery.dateTo);
    }
    if (validatedQuery.practiceArea) filters.practiceArea = validatedQuery.practiceArea;
    if (validatedQuery.attorney) filters.assignedTo = validatedQuery.attorney;
    if (validatedQuery.status) filters.status = validatedQuery.status;
    if (validatedQuery.matterType) filters.matterType = validatedQuery.matterType;

    // Get basic analytics
    const totalCases = await Case.countDocuments(filters);
    const openCases = await Case.countDocuments({ ...filters, status: 'Open' });
    const inProgressCases = await Case.countDocuments({ ...filters, status: 'In Progress' });
    const closedCases = await Case.countDocuments({ ...filters, status: 'Closed' });

    // Calculate average duration for closed cases
    const closedCasesWithDates = await Case.find({
      ...filters,
      status: 'Closed',
      closedDate: { $exists: true },
      openedDate: { $exists: true }
    }).select('openedDate closedDate');

    let avgDurationDays = 0;
    if (closedCasesWithDates.length > 0) {
      const totalDuration = closedCasesWithDates.reduce((sum, c) => {
        return sum + (c.closedDate - c.openedDate) / (1000 * 60 * 60 * 24);
      }, 0);
      avgDurationDays = Math.round(totalDuration / closedCasesWithDates.length);
    }

    // Calculate win rate (cases with positive outcomes)
    const casesWithOutcome = await Case.find({
      ...filters,
      status: 'Closed',
      outcome: { $exists: true }
    }).select('outcome');

    const wonCases = casesWithOutcome.filter(c => 
      c.outcome && ['Won', 'Favorable', 'Settled Favorably', 'Dismissed'].includes(c.outcome)
    ).length;
    const winRate = casesWithOutcome.length > 0 
      ? (wonCases / casesWithOutcome.length).toFixed(2) 
      : 0;

    // Get case distribution by type
    const casesByType = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$matterType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get case distribution by status
    const casesByStatus = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get case distribution by priority
    const casesByPriority = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get trend data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Case.aggregate([
      { 
        $match: { 
          ...filters,
          openedDate: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$openedDate' },
            month: { $month: '$openedDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Case analytics retrieved successfully',
      data: {
        summary: {
          totalCases,
          openCases,
          inProgressCases,
          closedCases,
          avgDurationDays,
          winRate: parseFloat(winRate)
        },
        distributions: {
          byType: casesByType.reduce((obj, item) => {
            obj[item._id || 'Unknown'] = item.count;
            return obj;
          }, {}),
          byStatus: casesByStatus.reduce((obj, item) => {
            obj[item._id] = item.count;
            return obj;
          }, {}),
          byPriority: casesByPriority.reduce((obj, item) => {
            obj[item._id] = item.count;
            return obj;
          }, {})
        },
        trends: {
          monthly: monthlyTrend.map(m => ({
            month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
            count: m.count
          }))
        },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 2: Financial Dashboards
router.get('/financial', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Financial Dashboards',
        description: 'Revenue, expenses, and profitability',
        endpoint: '/api/reports/financial',
        capabilities: [
          'Revenue dashboards',
          'Expense tracking',
          'Profitability analysis',
          'Cash flow reports',
          'Financial forecasting'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate query parameters
    const validatedQuery = validateRequest(financialQuerySchema, req.query);

    // Build filters
    const filters = { archived: false };
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      filters.openedDate = {};
      if (validatedQuery.dateFrom) filters.openedDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) filters.openedDate.$lte = new Date(validatedQuery.dateTo);
    }
    if (validatedQuery.practiceArea) filters.practiceArea = validatedQuery.practiceArea;
    if (validatedQuery.attorney) filters.assignedTo = validatedQuery.attorney;

    // Get cases with financial data
    const cases = await Case.find(filters).select('estimatedValue actualValue billingType practiceArea assignedTo openedDate closedDate');
    
    // Calculate financial metrics
    const totalEstimatedValue = cases.reduce((sum, c) => sum + (c.estimatedValue || 0), 0);
    const totalActualValue = cases.reduce((sum, c) => sum + (c.actualValue || 0), 0);
    const totalRevenue = totalActualValue;
    
    // Group by practice area
    const revenueByPracticeArea = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$practiceArea',
          revenue: { $sum: '$actualValue' },
          estimated: { $sum: '$estimatedValue' },
          caseCount: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Group by attorney
    const revenueByAttorney = await Case.aggregate([
      { 
        $match: { 
          ...filters,
          assignedTo: { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: '$assignedTo',
          revenue: { $sum: '$actualValue' },
          caseCount: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // Monthly revenue trend
    const monthlyRevenue = await Case.aggregate([
      { 
        $match: { 
          ...filters,
          closedDate: { $exists: true }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$closedDate' },
            month: { $month: '$closedDate' }
          },
          revenue: { $sum: '$actualValue' },
          caseCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate profitability metrics
    const profitMargin = totalEstimatedValue > 0 
      ? ((totalActualValue - totalEstimatedValue) / totalEstimatedValue * 100).toFixed(2)
      : 0;

    // Generate forecast (simple projection based on current trend)
    let forecast = null;
    if (validatedQuery.includeProjections && monthlyRevenue.length >= 3) {
      const lastThreeMonths = monthlyRevenue.slice(-3);
      const avgMonthlyRevenue = lastThreeMonths.reduce((sum, m) => sum + m.revenue, 0) / 3;
      forecast = {
        nextMonth: Math.round(avgMonthlyRevenue),
        nextQuarter: Math.round(avgMonthlyRevenue * 3),
        nextYear: Math.round(avgMonthlyRevenue * 12)
      };
    }

    res.status(200).json({
      success: true,
      message: 'Financial dashboard data retrieved successfully',
      data: {
        summary: {
          totalRevenue,
          totalEstimatedValue,
          totalActualValue,
          profitMargin: parseFloat(profitMargin),
          totalCases: cases.length
        },
        distributions: {
          byPracticeArea: revenueByPracticeArea.map(item => ({
            practiceArea: item._id || 'Unassigned',
            revenue: item.revenue || 0,
            estimated: item.estimated || 0,
            caseCount: item.caseCount
          })),
          byAttorney: revenueByAttorney.map(item => ({
            attorney: item._id,
            revenue: item.revenue || 0,
            caseCount: item.caseCount
          }))
        },
        trends: {
          monthly: monthlyRevenue.map(m => ({
            month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
            revenue: m.revenue || 0,
            caseCount: m.caseCount
          }))
        },
        forecast,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Attorney Performance Metrics
router.get('/attorney-performance', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Attorney Performance Metrics',
        description: 'Billable hours, efficiency, and outcomes',
        endpoint: '/api/reports/attorney-performance',
        capabilities: [
          'Billable hours',
          'Utilization rates',
          'Efficiency metrics',
          'Case outcomes',
          'Performance rankings'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate query parameters
    const validatedQuery = validateRequest(attorneyPerformanceQuerySchema, req.query);

    // Build filters
    const filters = { archived: false };
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      filters.openedDate = {};
      if (validatedQuery.dateFrom) filters.openedDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) filters.openedDate.$lte = new Date(validatedQuery.dateTo);
    }
    if (validatedQuery.attorney) filters.assignedTo = validatedQuery.attorney;
    if (validatedQuery.practiceArea) filters.practiceArea = validatedQuery.practiceArea;

    // Get attorney performance metrics
    const attorneyMetrics = await Case.aggregate([
      { 
        $match: { 
          ...filters,
          assignedTo: { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: '$assignedTo',
          totalCases: { $sum: 1 },
          openCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] }
          },
          inProgressCases: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          closedCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$actualValue' },
          avgCaseValue: { $avg: '$actualValue' }
        }
      },
      { $sort: { totalCases: -1 } }
    ]);

    // Get task completion metrics for attorneys
    const taskFilters = {};
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      taskFilters.createdDate = {};
      if (validatedQuery.dateFrom) taskFilters.createdDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) taskFilters.createdDate.$lte = new Date(validatedQuery.dateTo);
    }
    if (validatedQuery.attorney) taskFilters.assignedTo = validatedQuery.attorney;

    const taskMetrics = await Task.aggregate([
      { 
        $match: { 
          ...taskFilters,
          assignedTo: { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalEstimatedHours: { $sum: '$estimatedHours' },
          totalActualHours: { $sum: '$actualHours' }
        }
      }
    ]);

    // Combine metrics
    const performanceData = attorneyMetrics.map(attorney => {
      const taskData = taskMetrics.find(t => t._id === attorney._id) || {
        totalTasks: 0,
        completedTasks: 0,
        totalEstimatedHours: 0,
        totalActualHours: 0
      };

      const completionRate = taskData.totalTasks > 0 
        ? ((taskData.completedTasks / taskData.totalTasks) * 100).toFixed(2)
        : 0;

      const efficiency = taskData.totalEstimatedHours > 0 && taskData.totalActualHours > 0
        ? ((taskData.totalEstimatedHours / taskData.totalActualHours) * 100).toFixed(2)
        : 0;

      const utilizationRate = taskData.totalActualHours > 0
        ? ((taskData.totalActualHours / (160 * 1)) * 100).toFixed(2) // Assuming 160 hours per month
        : 0;

      return {
        attorney: attorney._id,
        caseMetrics: {
          totalCases: attorney.totalCases,
          openCases: attorney.openCases,
          inProgressCases: attorney.inProgressCases,
          closedCases: attorney.closedCases,
          totalRevenue: attorney.totalRevenue || 0,
          avgCaseValue: Math.round(attorney.avgCaseValue || 0)
        },
        taskMetrics: {
          totalTasks: taskData.totalTasks,
          completedTasks: taskData.completedTasks,
          completionRate: parseFloat(completionRate),
          totalEstimatedHours: taskData.totalEstimatedHours || 0,
          totalActualHours: taskData.totalActualHours || 0
        },
        performanceIndicators: {
          efficiency: parseFloat(efficiency),
          utilizationRate: parseFloat(utilizationRate)
        }
      };
    });

    // Sort by total revenue for rankings
    performanceData.sort((a, b) => b.caseMetrics.totalRevenue - a.caseMetrics.totalRevenue);

    res.status(200).json({
      success: true,
      message: 'Attorney performance metrics retrieved successfully',
      data: {
        attorneys: performanceData,
        topPerformers: performanceData.slice(0, 5),
        summary: {
          totalAttorneys: performanceData.length,
          avgCasesPerAttorney: performanceData.length > 0
            ? Math.round(performanceData.reduce((sum, a) => sum + a.caseMetrics.totalCases, 0) / performanceData.length)
            : 0,
          avgRevenuePerAttorney: performanceData.length > 0
            ? Math.round(performanceData.reduce((sum, a) => sum + a.caseMetrics.totalRevenue, 0) / performanceData.length)
            : 0
        },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: Client Analytics
router.get('/client-analytics', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Analytics',
        description: 'Client acquisition, retention, and satisfaction',
        endpoint: '/api/reports/client-analytics',
        capabilities: [
          'Acquisition metrics',
          'Retention rates',
          'Client satisfaction',
          'Client lifetime value',
          'Referral tracking'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate query parameters
    const validatedQuery = validateRequest(clientAnalyticsQuerySchema, req.query);

    // Build filters
    const filters = { archived: false };
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      filters.openedDate = {};
      if (validatedQuery.dateFrom) filters.openedDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) filters.openedDate.$lte = new Date(validatedQuery.dateTo);
    }
    if (validatedQuery.clientId) filters.clientId = validatedQuery.clientId;

    // Get client metrics
    const clientMetrics = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$clientName',
          clientId: { $first: '$clientId' },
          totalCases: { $sum: 1 },
          openCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] }
          },
          closedCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
          },
          totalValue: { $sum: '$actualValue' },
          avgCaseValue: { $avg: '$actualValue' },
          firstCase: { $min: '$openedDate' },
          lastCase: { $max: '$openedDate' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    // Calculate client lifetime value (CLV) and retention metrics
    const clientAnalytics = clientMetrics.map(client => {
      const lifetimeValue = client.totalValue || 0;
      const avgCaseValue = client.avgCaseValue || 0;
      
      // Calculate months as a client
      const monthsAsClient = client.firstCase && client.lastCase
        ? Math.max(1, Math.round((client.lastCase - client.firstCase) / (1000 * 60 * 60 * 24 * 30)))
        : 1;
      
      // Calculate retention score (based on case frequency)
      const caseFrequency = client.totalCases / monthsAsClient;
      const retentionScore = Math.min(100, Math.round(caseFrequency * 20)); // Scale to 0-100

      return {
        clientName: client._id,
        clientId: client.clientId,
        metrics: {
          totalCases: client.totalCases,
          openCases: client.openCases,
          closedCases: client.closedCases,
          lifetimeValue: Math.round(lifetimeValue),
          avgCaseValue: Math.round(avgCaseValue),
          monthsAsClient,
          caseFrequency: caseFrequency.toFixed(2)
        },
        retention: {
          retentionScore,
          status: retentionScore >= 70 ? 'High' : retentionScore >= 40 ? 'Medium' : 'Low',
          firstCaseDate: client.firstCase,
          lastCaseDate: client.lastCase
        }
      };
    });

    // Get acquisition metrics (new clients over time)
    const acquisitionTrend = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            clientName: '$clientName',
            firstCase: { $min: '$openedDate' }
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$_id.firstCase' },
            month: { $month: '$_id.firstCase' }
          },
          newClients: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate summary metrics
    const totalClients = clientAnalytics.length;
    const totalLifetimeValue = clientAnalytics.reduce((sum, c) => sum + c.metrics.lifetimeValue, 0);
    const avgLifetimeValue = totalClients > 0 ? Math.round(totalLifetimeValue / totalClients) : 0;
    
    // Segment clients
    const topClients = clientAnalytics.slice(0, 10);
    const atRiskClients = clientAnalytics.filter(c => c.retention.status === 'Low');

    res.status(200).json({
      success: true,
      message: 'Client analytics retrieved successfully',
      data: {
        summary: {
          totalClients,
          totalLifetimeValue,
          avgLifetimeValue,
          topClientsCount: topClients.length,
          atRiskClientsCount: atRiskClients.length
        },
        clients: clientAnalytics,
        segments: {
          topClients,
          atRiskClients: atRiskClients.slice(0, 10)
        },
        trends: {
          acquisition: acquisitionTrend.map(t => ({
            month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
            newClients: t.newClients
          }))
        },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Practice Area Analysis
router.get('/practice-areas', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Practice Area Analysis',
        description: 'Performance by practice area',
        endpoint: '/api/reports/practice-areas',
        capabilities: [
          'Revenue by practice area',
          'Matter distribution',
          'Profitability analysis',
          'Growth trends',
          'Capacity planning'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate query parameters
    const validatedQuery = validateRequest(practiceAreaQuerySchema, req.query);

    // Build filters
    const filters = { archived: false };
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      filters.openedDate = {};
      if (validatedQuery.dateFrom) filters.openedDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) filters.openedDate.$lte = new Date(validatedQuery.dateTo);
    }
    if (validatedQuery.practiceArea) filters.practiceArea = validatedQuery.practiceArea;

    // Get practice area metrics
    const practiceAreaMetrics = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$practiceArea',
          totalCases: { $sum: 1 },
          openCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] }
          },
          inProgressCases: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          closedCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$actualValue' },
          totalEstimated: { $sum: '$estimatedValue' },
          avgCaseValue: { $avg: '$actualValue' },
          uniqueClients: { $addToSet: '$clientName' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Calculate profitability for each practice area
    const practiceAreaAnalysis = practiceAreaMetrics.map(area => {
      const profitMargin = area.totalEstimated > 0
        ? ((area.totalRevenue - area.totalEstimated) / area.totalEstimated * 100).toFixed(2)
        : 0;

      const activeWorkload = area.openCases + area.inProgressCases;
      const completionRate = area.totalCases > 0
        ? ((area.closedCases / area.totalCases) * 100).toFixed(2)
        : 0;

      return {
        practiceArea: area._id || 'Unspecified',
        metrics: {
          totalCases: area.totalCases,
          openCases: area.openCases,
          inProgressCases: area.inProgressCases,
          closedCases: area.closedCases,
          activeWorkload,
          completionRate: parseFloat(completionRate)
        },
        financial: {
          totalRevenue: area.totalRevenue || 0,
          totalEstimated: area.totalEstimated || 0,
          avgCaseValue: Math.round(area.avgCaseValue || 0),
          profitMargin: parseFloat(profitMargin)
        },
        clientMetrics: {
          uniqueClients: area.uniqueClients.length,
          avgCasesPerClient: area.uniqueClients.length > 0
            ? (area.totalCases / area.uniqueClients.length).toFixed(2)
            : 0
        }
      };
    });

    // Get growth trends by practice area
    const growthTrends = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            practiceArea: '$practiceArea',
            year: { $year: '$openedDate' },
            month: { $month: '$openedDate' }
          },
          caseCount: { $sum: 1 },
          revenue: { $sum: '$actualValue' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate capacity metrics
    const capacityAnalysis = practiceAreaAnalysis.map(area => {
      const utilizationRate = area.metrics.totalCases > 0
        ? ((area.metrics.activeWorkload / area.metrics.totalCases) * 100).toFixed(2)
        : 0;

      let capacityStatus = 'Normal';
      if (utilizationRate > 80) capacityStatus = 'High Demand';
      else if (utilizationRate < 30) capacityStatus = 'Low Demand';

      return {
        practiceArea: area.practiceArea,
        activeWorkload: area.metrics.activeWorkload,
        utilizationRate: parseFloat(utilizationRate),
        capacityStatus,
        recommendation: capacityStatus === 'High Demand' 
          ? 'Consider adding resources' 
          : capacityStatus === 'Low Demand'
          ? 'Optimize resource allocation'
          : 'Capacity is adequate'
      };
    });

    res.status(200).json({
      success: true,
      message: 'Practice area analysis retrieved successfully',
      data: {
        summary: {
          totalPracticeAreas: practiceAreaAnalysis.length,
          totalRevenue: practiceAreaAnalysis.reduce((sum, a) => sum + a.financial.totalRevenue, 0),
          totalCases: practiceAreaAnalysis.reduce((sum, a) => sum + a.metrics.totalCases, 0)
        },
        practiceAreas: practiceAreaAnalysis,
        capacity: capacityAnalysis,
        trends: {
          growth: growthTrends.map(t => ({
            practiceArea: t._id.practiceArea || 'Unspecified',
            month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
            caseCount: t.caseCount,
            revenue: t.revenue || 0
          }))
        },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Custom Report Builder
router.post('/custom', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Custom Report Builder',
        description: 'Create custom reports and visualizations',
        endpoint: '/api/reports/custom',
        capabilities: [
          'Drag-and-drop builder',
          'Custom metrics',
          'Data visualization',
          'Report templates',
          'Scheduled reports'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createCustomReportSchema, req.body);

    // Generate report number
    const reportNumber = generateReportNumber();

    // Create new custom report
    const newReport = new Report({
      ...validatedData,
      reportNumber,
      status: 'Active'
    });

    await newReport.save();

    // If this is a report generation request (not just template creation), generate the report
    let reportData = null;
    if (!validatedData.isTemplate) {
      // Build query based on data source and filters
      let Model;
      switch (validatedData.dataSource) {
        case 'Cases':
          Model = Case;
          break;
        case 'Tasks':
          Model = Task;
          break;
        case 'Documents':
          Model = Document;
          break;
        default:
          Model = Case; // Default to Cases
      }

      // Build filters
      const filters = {};
      if (validatedData.filters) {
        if (validatedData.filters.dateFrom || validatedData.filters.dateTo) {
          filters.createdAt = {};
          if (validatedData.filters.dateFrom) filters.createdAt.$gte = new Date(validatedData.filters.dateFrom);
          if (validatedData.filters.dateTo) filters.createdAt.$lte = new Date(validatedData.filters.dateTo);
        }
        if (validatedData.filters.status && validatedData.filters.status.length > 0) {
          filters.status = { $in: validatedData.filters.status };
        }
        if (validatedData.filters.practiceArea && validatedData.filters.practiceArea.length > 0) {
          filters.practiceArea = { $in: validatedData.filters.practiceArea };
        }
        if (validatedData.filters.attorney && validatedData.filters.attorney.length > 0) {
          filters.assignedTo = { $in: validatedData.filters.attorney };
        }
      }

      // Execute aggregation if metrics are defined
      if (validatedData.metrics && validatedData.metrics.length > 0) {
        const pipeline = [{ $match: filters }];

        // Build group stage
        const groupStage = { _id: null };
        validatedData.metrics.forEach(metric => {
          switch (metric.aggregationType) {
            case 'sum':
              groupStage[metric.name] = { $sum: `$${metric.field}` };
              break;
            case 'avg':
              groupStage[metric.name] = { $avg: `$${metric.field}` };
              break;
            case 'count':
              groupStage[metric.name] = { $sum: 1 };
              break;
            case 'min':
              groupStage[metric.name] = { $min: `$${metric.field}` };
              break;
            case 'max':
              groupStage[metric.name] = { $max: `$${metric.field}` };
              break;
          }
        });

        // Add groupBy if specified
        if (validatedData.groupBy && validatedData.groupBy.length > 0) {
          groupStage._id = {};
          validatedData.groupBy.forEach(field => {
            groupStage._id[field] = `$${field}`;
          });
        }

        pipeline.push({ $group: groupStage });

        // Add sort if specified
        if (validatedData.sortBy) {
          const sortStage = {};
          sortStage[validatedData.sortBy.field] = validatedData.sortBy.order === 'asc' ? 1 : -1;
          pipeline.push({ $sort: sortStage });
        }

        reportData = await Model.aggregate(pipeline);
      } else {
        // Simple find if no aggregation
        reportData = await Model.find(filters).limit(100);
      }

      // Cache the results
      newReport.cachedData = reportData;
      await newReport.generateReport();
      await newReport.save();
    }

    res.status(201).json({
      success: true,
      message: validatedData.isTemplate 
        ? 'Report template created successfully' 
        : 'Custom report created and generated successfully',
      data: {
        report: {
          reportId: newReport._id,
          reportNumber: newReport.reportNumber,
          title: newReport.title,
          reportType: newReport.reportType,
          status: newReport.status,
          isTemplate: newReport.isTemplate
        },
        reportData: validatedData.isTemplate ? null : reportData,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get saved custom reports
router.get('/custom', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Database not connected',
        data: { reports: [] }
      });
    }

    const reports = await Report.find({ status: 'Active' })
      .select('reportNumber title reportType isTemplate lastGenerated createdBy createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: 'Custom reports retrieved successfully',
      data: {
        reports,
        count: reports.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get report templates
router.get('/custom/templates', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Database not connected',
        data: { templates: [] }
      });
    }

    const templates = await Report.findTemplates();

    res.status(200).json({
      success: true,
      message: 'Report templates retrieved successfully',
      data: {
        templates,
        count: templates.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 7: Predictive Analytics
router.get('/predictive', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Predictive Analytics',
        description: 'Forecast outcomes and resource needs',
        endpoint: '/api/reports/predictive',
        capabilities: [
          'Outcome prediction',
          'Resource forecasting',
          'Demand planning',
          'Trend analysis',
          'Risk prediction'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate query parameters
    const validatedQuery = validateRequest(predictiveAnalyticsQuerySchema, req.query);

    const predictionType = validatedQuery.predictionType;
    const forecastPeriod = validatedQuery.forecastPeriod || 90;
    const confidenceLevel = validatedQuery.confidenceLevel || 0.95;

    // Build filters
    const filters = { archived: false };
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      filters.openedDate = {};
      if (validatedQuery.dateFrom) filters.openedDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) filters.openedDate.$lte = new Date(validatedQuery.dateTo);
    }
    if (validatedQuery.practiceArea) filters.practiceArea = validatedQuery.practiceArea;

    let predictions = {};

    // Case Outcome Prediction
    if (predictionType === 'caseOutcome' || predictionType === 'trendAnalysis') {
      const historicalOutcomes = await Case.aggregate([
        { 
          $match: { 
            ...filters,
            status: 'Closed',
            outcome: { $exists: true }
          } 
        },
        {
          $group: {
            _id: '$outcome',
            count: { $sum: 1 },
            avgDuration: { 
              $avg: {
                $divide: [
                  { $subtract: ['$closedDate', '$openedDate'] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const totalCases = historicalOutcomes.reduce((sum, o) => sum + o.count, 0);
      predictions.outcomeDistribution = historicalOutcomes.map(o => ({
        outcome: o._id,
        probability: totalCases > 0 ? (o.count / totalCases).toFixed(4) : 0,
        avgDuration: Math.round(o.avgDuration || 0),
        historicalCount: o.count
      }));
    }

    // Resource Demand Forecasting
    if (predictionType === 'resourceDemand' || predictionType === 'trendAnalysis') {
      // Get historical case opening rates
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyNewCases = await Case.aggregate([
        {
          $match: {
            ...filters,
            openedDate: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$openedDate' },
              month: { $month: '$openedDate' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      if (monthlyNewCases.length >= 3) {
        const avgMonthlyNewCases = monthlyNewCases.reduce((sum, m) => sum + m.count, 0) / monthlyNewCases.length;
        const forecastMonths = Math.ceil(forecastPeriod / 30);
        
        predictions.resourceDemand = {
          avgMonthlyNewCases: Math.round(avgMonthlyNewCases),
          forecastedNewCases: Math.round(avgMonthlyNewCases * forecastMonths),
          forecastPeriodDays: forecastPeriod,
          recommendedAttorneys: Math.ceil(avgMonthlyNewCases * forecastMonths / 10), // Assuming 10 cases per attorney
          confidenceLevel: confidenceLevel
        };
      }
    }

    // Revenue Forecasting
    if (predictionType === 'revenueForecasting' || predictionType === 'trendAnalysis') {
      const revenueHistory = await Case.aggregate([
        {
          $match: {
            ...filters,
            closedDate: { $exists: true },
            actualValue: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$closedDate' },
              month: { $month: '$closedDate' }
            },
            revenue: { $sum: '$actualValue' },
            caseCount: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      if (revenueHistory.length >= 3) {
        const lastThreeMonths = revenueHistory.slice(-3);
        const avgMonthlyRevenue = lastThreeMonths.reduce((sum, m) => sum + m.revenue, 0) / 3;
        const forecastMonths = Math.ceil(forecastPeriod / 30);

        // Calculate trend (simple linear)
        const trend = revenueHistory.length >= 2
          ? ((revenueHistory[revenueHistory.length - 1].revenue - revenueHistory[0].revenue) / revenueHistory.length)
          : 0;

        predictions.revenueForecasting = {
          avgMonthlyRevenue: Math.round(avgMonthlyRevenue),
          forecastedRevenue: Math.round(avgMonthlyRevenue * forecastMonths + (trend * forecastMonths)),
          trend: trend > 0 ? 'Increasing' : trend < 0 ? 'Decreasing' : 'Stable',
          trendValue: Math.round(trend),
          forecastPeriodDays: forecastPeriod,
          confidenceLevel: confidenceLevel
        };
      }
    }

    // Risk Assessment
    if (predictionType === 'riskAssessment' || predictionType === 'trendAnalysis') {
      const overdueTaskCount = await Task.countDocuments({
        status: { $ne: 'Completed' },
        dueDate: { $lt: new Date() }
      });

      const highPriorityCases = await Case.countDocuments({
        ...filters,
        priority: { $in: ['High', 'Critical'] },
        status: { $nin: ['Closed', 'Archived'] }
      });

      const casesApproachingDeadline = await Case.countDocuments({
        ...filters,
        status: { $nin: ['Closed', 'Archived'] },
        dueDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
        }
      });

      const riskScore = Math.min(100, (overdueTaskCount * 2 + highPriorityCases * 3 + casesApproachingDeadline * 1));
      let riskLevel = 'Low';
      if (riskScore > 70) riskLevel = 'High';
      else if (riskScore > 40) riskLevel = 'Medium';

      predictions.riskAssessment = {
        riskScore,
        riskLevel,
        factors: {
          overdueTasks: overdueTaskCount,
          highPriorityCases,
          casesApproachingDeadline
        },
        recommendations: []
      };

      if (overdueTaskCount > 5) predictions.riskAssessment.recommendations.push('Address overdue tasks immediately');
      if (highPriorityCases > 10) predictions.riskAssessment.recommendations.push('Allocate additional resources to high-priority cases');
      if (casesApproachingDeadline > 5) predictions.riskAssessment.recommendations.push('Review cases with upcoming deadlines');
    }

    res.status(200).json({
      success: true,
      message: 'Predictive analytics generated successfully',
      data: {
        predictionType,
        predictions,
        parameters: {
          forecastPeriod,
          confidenceLevel,
          dateFrom: validatedQuery.dateFrom,
          dateTo: validatedQuery.dateTo
        },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 8: Executive Dashboards
router.get('/executive', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Executive Dashboards',
        description: 'High-level KPIs for management',
        endpoint: '/api/reports/executive',
        capabilities: [
          'KPI dashboards',
          'Strategic metrics',
          'Performance overview',
          'Real-time data',
          'Drill-down capabilities'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate query parameters
    const validatedQuery = validateRequest(executiveDashboardQuerySchema, req.query);

    // Build date filters
    const filters = { archived: false };
    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      filters.openedDate = {};
      if (validatedQuery.dateFrom) filters.openedDate.$gte = new Date(validatedQuery.dateFrom);
      if (validatedQuery.dateTo) filters.openedDate.$lte = new Date(validatedQuery.dateTo);
    }

    // Get comprehensive KPIs
    const [
      totalCases,
      activeCases,
      closedCases,
      totalTasks,
      completedTasks,
      totalDocuments
    ] = await Promise.all([
      Case.countDocuments(filters),
      Case.countDocuments({ ...filters, status: { $in: ['Open', 'In Progress'] } }),
      Case.countDocuments({ ...filters, status: 'Closed' }),
      Task.countDocuments({ createdDate: filters.openedDate || { $exists: true } }),
      Task.countDocuments({ 
        createdDate: filters.openedDate || { $exists: true },
        status: 'Completed' 
      }),
      Document.countDocuments({ createdAt: filters.openedDate || { $exists: true } })
    ]);

    // Financial KPIs
    const financialData = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$actualValue' },
          totalEstimated: { $sum: '$estimatedValue' },
          avgCaseValue: { $avg: '$actualValue' }
        }
      }
    ]);

    const financial = financialData[0] || {
      totalRevenue: 0,
      totalEstimated: 0,
      avgCaseValue: 0
    };

    // Performance KPIs
    const caseCompletionRate = totalCases > 0 ? ((closedCases / totalCases) * 100).toFixed(2) : 0;
    const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

    // Client KPIs
    const uniqueClients = await Case.distinct('clientName', filters);
    const clientCount = uniqueClients.length;

    // Practice Area Distribution
    const practiceAreaDist = await Case.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$practiceArea',
          count: { $sum: 1 },
          revenue: { $sum: '$actualValue' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // Team Performance
    const attorneyCount = await Case.aggregate([
      { 
        $match: { 
          ...filters,
          assignedTo: { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: '$assignedTo'
        }
      }
    ]);

    // Recent Activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await Case.aggregate([
      {
        $match: {
          ...filters,
          openedDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          newCases: { $sum: 1 },
          newRevenue: { $sum: '$actualValue' }
        }
      }
    ]);

    const activity = recentActivity[0] || { newCases: 0, newRevenue: 0 };

    // Comparison with previous period (if requested)
    let comparison = null;
    if (validatedQuery.includeComparison) {
      const previousPeriodStart = validatedQuery.dateFrom 
        ? new Date(new Date(validatedQuery.dateFrom).getTime() - (new Date(validatedQuery.dateTo || Date.now()) - new Date(validatedQuery.dateFrom)))
        : new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days ago

      const previousPeriodEnd = validatedQuery.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const prevFilters = {
        ...filters,
        openedDate: {
          $gte: previousPeriodStart,
          $lte: previousPeriodEnd
        }
      };

      const [prevTotalCases, prevClosedCases] = await Promise.all([
        Case.countDocuments(prevFilters),
        Case.countDocuments({ ...prevFilters, status: 'Closed' })
      ]);

      const prevFinancial = await Case.aggregate([
        { $match: prevFilters },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$actualValue' }
          }
        }
      ]);

      const prevRevenue = prevFinancial[0]?.totalRevenue || 0;

      comparison = {
        cases: {
          current: totalCases,
          previous: prevTotalCases,
          change: prevTotalCases > 0 
            ? (((totalCases - prevTotalCases) / prevTotalCases) * 100).toFixed(2)
            : 0,
          trend: totalCases > prevTotalCases ? 'up' : totalCases < prevTotalCases ? 'down' : 'stable'
        },
        revenue: {
          current: financial.totalRevenue,
          previous: prevRevenue,
          change: prevRevenue > 0 
            ? (((financial.totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(2)
            : 0,
          trend: financial.totalRevenue > prevRevenue ? 'up' : financial.totalRevenue < prevRevenue ? 'down' : 'stable'
        }
      };
    }

    // Build response based on detail level
    const detailLevel = validatedQuery.detailLevel || 'summary';
    
    const response = {
      success: true,
      message: 'Executive dashboard data retrieved successfully',
      data: {
        kpis: {
          cases: {
            total: totalCases,
            active: activeCases,
            closed: closedCases,
            completionRate: parseFloat(caseCompletionRate)
          },
          financial: {
            totalRevenue: financial.totalRevenue || 0,
            totalEstimated: financial.totalEstimated || 0,
            avgCaseValue: Math.round(financial.avgCaseValue || 0),
            profitMargin: financial.totalEstimated > 0
              ? (((financial.totalRevenue - financial.totalEstimated) / financial.totalEstimated) * 100).toFixed(2)
              : 0
          },
          operations: {
            totalTasks,
            completedTasks,
            taskCompletionRate: parseFloat(taskCompletionRate),
            totalDocuments
          },
          clients: {
            totalClients: clientCount,
            avgCasesPerClient: clientCount > 0 ? (totalCases / clientCount).toFixed(2) : 0
          },
          team: {
            activeAttorneys: attorneyCount.length,
            avgCasesPerAttorney: attorneyCount.length > 0 
              ? Math.round(activeCases / attorneyCount.length)
              : 0
          }
        },
        recentActivity: {
          last30Days: {
            newCases: activity.newCases,
            newRevenue: activity.newRevenue || 0
          }
        },
        generatedAt: new Date()
      }
    };

    // Add detailed information if requested
    if (detailLevel === 'detailed' || detailLevel === 'comprehensive') {
      response.data.distributions = {
        topPracticeAreas: practiceAreaDist.map(pa => ({
          practiceArea: pa._id || 'Unspecified',
          caseCount: pa.count,
          revenue: pa.revenue || 0
        }))
      };
    }

    // Add comparison if requested
    if (comparison) {
      response.data.comparison = comparison;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Reporting overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Reporting & Analytics',
    description: 'Comprehensive reporting and analytics system with 8 sub-features',
    endpoint: '/api/reports',
    subFeatures: [
      'Case Analytics & Metrics',
      'Financial Dashboards',
      'Attorney Performance Metrics',
      'Client Analytics',
      'Practice Area Analysis',
      'Custom Report Builder',
      'Predictive Analytics',
      'Executive Dashboards'
    ],
    capabilities: [
      'Real-time analytics',
      'Customizable reports',
      'Predictive insights',
      'Executive KPIs',
      'Data visualizations',
      'Scheduled reporting',
      'Historical comparisons',
      'Performance tracking'
    ]
  });
});

module.exports = router;
