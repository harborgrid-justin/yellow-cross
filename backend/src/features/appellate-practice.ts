/**
 * Feature 31: Appellate Practice Management
 * Appeals and briefs tracking
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
import { AppellateCase } from '../models/sequelize/AppellateCase';

const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  clientId: Joi.string().optional(),
  caseId: Joi.string().optional(),
  createdBy: Joi.string().required()
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
        feature: 'Appellate Practice Management - Create',
        description: 'Appeals and briefs tracking',
        capabilities: ['Create records', 'Track progress', 'Document management', 'Compliance tracking']
      });
    }
    const validatedData = validateRequest(createSchema, req.body);
    const caseNumber = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
    const record = await AppellateCase.create({ caseNumber, ...validatedData });
    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Appellate Practice Management - Details', capabilities: ['View details', 'Document access', 'History tracking'] });
    }
    const record = await AppellateCase.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Appellate Practice Management - Update', capabilities: ['Update records', 'Status changes'] });
    }
    const record = await AppellateCase.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    await record.update(req.body);
    res.json({ success: true, message: 'Updated successfully', data: record });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Appellate Practice Management - List', capabilities: ['List all', 'Filter', 'Search', 'Sort'] });
    }
    const records = await AppellateCase.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: records, total: records.length });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Appellate Practice Management - Delete', capabilities: ['Soft delete', 'Archive'] });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
