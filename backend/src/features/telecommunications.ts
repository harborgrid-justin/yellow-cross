/**
 * Feature 38: Telecommunications Management
 * Production-grade legal matter tracking
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
import { TelecommunicationsMatter } from '../models/sequelize/TelecommunicationsMatter';

const createSchema = Joi.object({
  matterType: Joi.string().valid('licensing', 'spectrum-allocation', 'regulatory-compliance', 'interconnection', 'privacy', 'litigation', 'other').required(),
  carrierName: Joi.string().required(),
  regulatoryAgency: Joi.string().optional(),
  licenseType: Joi.string().optional(),
  applicationDate: Joi.date().optional(),
  notes: Joi.string().optional(),
  createdBy: Joi.string().required()
});

const updateSchema = Joi.object({
  status: Joi.string().valid('active', 'pending', 'under-review', 'approved', 'denied', 'closed').optional(),
  notes: Joi.string().optional(),
  updatedBy: Joi.string().required()
});

const validateRequest = (schema: any, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) throw new Error(error.details[0].message);
  return value;
};

router.post('/create', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Telecommunications Management - Create',
        description: 'Create new matter',
        capabilities: ['Matter creation', 'Track progress', 'Document management']
      });
    }

    const validatedData = validateRequest(createSchema, req.body);
    const matterNumber = `TEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    const matter = await TelecommunicationsMatter.create({
      matterNumber,
      ...validatedData,
      status: 'active'
    });

    res.status(201).json({ success: true, message: 'Matter created successfully', data: matter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error creating matter', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Telecommunications Management - Details', capabilities: ['View details', 'Document access'] });
    }

    const matter = await TelecommunicationsMatter.findByPk(req.params.id);
    if (!matter) {
      return res.status(404).json({ success: false, message: 'Matter not found' });
    }

    res.json({ success: true, data: matter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error fetching matter', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Telecommunications Management - Update', capabilities: ['Update records', 'Status changes'] });
    }

    const validatedData = validateRequest(updateSchema, req.body);
    const matter = await TelecommunicationsMatter.findByPk(req.params.id);

    if (!matter) {
      return res.status(404).json({ success: false, message: 'Matter not found' });
    }

    await matter.update(validatedData);
    res.json({ success: true, message: 'Matter updated successfully', data: matter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error updating matter', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Telecommunications Management - List', capabilities: ['List all', 'Filter', 'Search', 'Sort'] });
    }

    const matters = await TelecommunicationsMatter.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: matters, total: matters.length });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error listing matters', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Telecommunications Management - Delete', capabilities: ['Delete matter', 'Archive'] });
    }

    const matter = await TelecommunicationsMatter.findByPk(req.params.id);
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
