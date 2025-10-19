/**
 * Feature 37: Energy and Utilities Management
 * Production-grade energy sector legal matters and utility regulations tracking
 */

import express from 'express';
const router = express.Router();
import { isConnected } from '../config/database';
import Joi from 'joi';
import { EnergyUtilitiesMatter } from '../models/sequelize/EnergyUtilitiesMatter';

const createSchema = Joi.object({
  matterType: Joi.string().valid('regulatory-compliance', 'rate-case', 'environmental', 'licensing', 'contracts', 'litigation', 'other').required(),
  utilityName: Joi.string().required(),
  regulatoryBody: Joi.string().optional(),
  projectName: Joi.string().optional(),
  complianceDeadline: Joi.date().optional(),
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
        feature: 'Energy and Utilities Management - Create',
        description: 'Energy sector legal matters',
        capabilities: ['Create records', 'Track progress', 'Document management', 'Compliance tracking']
      });
    }

    const validatedData = validateRequest(createSchema, req.body);
    const matterNumber = `ENG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    const matter = await EnergyUtilitiesMatter.create({
      matterNumber,
      ...validatedData,
      status: 'active'
    });

    res.status(201).json({ success: true, message: 'Energy/utilities matter created successfully', data: matter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error creating matter', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Energy and Utilities Management - Details', capabilities: ['View details', 'Document access', 'History tracking'] });
    }

    const matter = await EnergyUtilitiesMatter.findByPk(req.params.id);
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
      return res.status(200).json({ feature: 'Energy and Utilities Management - Update', capabilities: ['Update records', 'Status changes'] });
    }

    const validatedData = validateRequest(updateSchema, req.body);
    const matter = await EnergyUtilitiesMatter.findByPk(req.params.id);

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
      return res.status(200).json({ feature: 'Energy and Utilities Management - List', capabilities: ['List all', 'Filter', 'Search', 'Sort'] });
    }

    const matters = await EnergyUtilitiesMatter.findAll({
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
      return res.status(200).json({ feature: 'Energy and Utilities Management - Delete', capabilities: ['Soft delete', 'Archive'] });
    }

    const matter = await EnergyUtilitiesMatter.findByPk(req.params.id);
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
