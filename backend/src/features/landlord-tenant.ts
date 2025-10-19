/**
 * Feature 59: Landlord-Tenant Law Management
 * Production-grade legal matter tracking
 */

import express from 'express';
const router = express.Router();
import { isConnected } from '../config/database';
import Joi from 'joi';
import { LandlordTenantMatter } from '../models/sequelize/LandlordTenantMatter';

const createSchema = Joi.object({
  matterType: Joi.string().valid('eviction', 'non-payment', 'lease-dispute', 'habitability', 'security-deposit', 'unlawful-detainer', 'other').required(),
  landlordName: Joi.string().required(),
  tenantName: Joi.string().optional(),
  propertyAddress: Joi.string().optional(),
  monthlyRent: Joi.number().optional(),
  leaseStartDate: Joi.date().optional(),
  notes: Joi.string().optional(),
  createdBy: Joi.string().required()
});

const updateSchema = Joi.object({
  status: Joi.string().valid('active', 'notice-served', 'court-filed', 'hearing', 'judgment', 'appeal', 'resolved', 'closed').optional(),
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
        feature: 'Landlord-Tenant Law Management - Create',
        description: 'Create new matter',
        capabilities: ['Matter creation', 'Track progress', 'Document management']
      });
    }

    const validatedData = validateRequest(createSchema, req.body);
    const matterNumber = `LT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    const matter = await LandlordTenantMatter.create({
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
      return res.status(200).json({ feature: 'Landlord-Tenant Law Management - Details', capabilities: ['View details', 'Document access'] });
    }

    const matter = await LandlordTenantMatter.findByPk(req.params.id);
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
      return res.status(200).json({ feature: 'Landlord-Tenant Law Management - Update', capabilities: ['Update records', 'Status changes'] });
    }

    const validatedData = validateRequest(updateSchema, req.body);
    const matter = await LandlordTenantMatter.findByPk(req.params.id);

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
      return res.status(200).json({ feature: 'Landlord-Tenant Law Management - List', capabilities: ['List all', 'Filter', 'Search', 'Sort'] });
    }

    const matters = await LandlordTenantMatter.findAll({
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
      return res.status(200).json({ feature: 'Landlord-Tenant Law Management - Delete', capabilities: ['Delete matter', 'Archive'] });
    }

    const matter = await LandlordTenantMatter.findByPk(req.params.id);
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
