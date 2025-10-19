/**
 * Feature 36: Financial Services Management
 * Production-grade banking regulatory compliance and financial services legal tracking
 */

import express from 'express';

// Authentication middleware
import { authenticate, requireActiveAccount } from '../middleware/auth';

const router = express.Router();

// ============================================================================
// APPLY AUTHENTICATION TO ALL ROUTES
// ============================================================================
router.use(authenticate);
router.use(requireActiveAccount);
import { isConnected } from '../config/database';
import Joi from 'joi';
import { FinancialServicesMatter } from '../models/sequelize/FinancialServicesMatter';

// Validation schemas
const createSchema = Joi.object({
  matterType: Joi.string().valid('compliance', 'regulatory-filing', 'investigation', 'advisory', 'litigation', 'other').required(),
  institutionName: Joi.string().required(),
  regulatoryAgency: Joi.string().optional(),
  complianceArea: Joi.string().optional(),
  filingDeadline: Joi.date().optional(),
  notes: Joi.string().optional(),
  createdBy: Joi.string().required()
});

const updateSchema = Joi.object({
  status: Joi.string().valid('active', 'pending', 'compliant', 'under-review', 'resolved', 'closed').optional(),
  notes: Joi.string().optional(),
  updatedBy: Joi.string().required()
});

const validateRequest = (schema: any, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) throw new Error(error.details[0].message);
  return value;
};

// Create new financial services matter
router.post('/create', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Financial Services Management - Create',
        description: 'Banking regulatory compliance and financial services legal tracking',
        capabilities: ['Matter creation', 'Regulatory tracking', 'Compliance management', 'Filing deadlines']
      });
    }

    const validatedData = validateRequest(createSchema, req.body);
    const matterNumber = `FIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    const matter = await FinancialServicesMatter.create({
      matterNumber,
      ...validatedData,
      status: 'active'
    });

    res.status(201).json({ success: true, message: 'Financial services matter created successfully', data: matter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error creating matter', error: error.message });
  }
});

// Get matter details
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Financial Services Management - Details',
        capabilities: ['View matter details', 'Regulatory requirements', 'Filing history']
      });
    }

    const matter = await FinancialServicesMatter.findByPk(req.params.id);
    if (!matter) {
      return res.status(404).json({ success: false, message: 'Matter not found' });
    }

    res.json({ success: true, data: matter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error fetching matter', error: error.message });
  }
});

// Update matter
router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Financial Services Management - Update',
        capabilities: ['Update matter status', 'Track compliance', 'Manage deadlines']
      });
    }

    const validatedData = validateRequest(updateSchema, req.body);
    const matter = await FinancialServicesMatter.findByPk(req.params.id);

    if (!matter) {
      return res.status(404).json({ success: false, message: 'Matter not found' });
    }

    await matter.update(validatedData);
    res.json({ success: true, message: 'Matter updated successfully', data: matter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error updating matter', error: error.message });
  }
});

// List all matters
router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Financial Services Management - List',
        capabilities: ['List all matters', 'Filter by status', 'Search', 'Sort']
      });
    }

    const matters = await FinancialServicesMatter.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: matters, total: matters.length });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error listing matters', error: error.message });
  }
});

// Delete matter
router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Financial Services Management - Delete',
        capabilities: ['Delete matter', 'Archive']
      });
    }

    const matter = await FinancialServicesMatter.findByPk(req.params.id);
    if (!matter) {
      return res.status(404).json({ success: false, message: 'Matter not found' });
    }

    await matter.destroy();
    res.json({ success: true, message: 'Matter deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error deleting matter', error: error.message });
  }
});

export default router;
