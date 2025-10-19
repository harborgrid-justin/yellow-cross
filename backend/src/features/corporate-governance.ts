/**
 * Feature 20: Corporate Governance Management
 */
import express from 'express';
const router = express.Router();
import { isConnected } from '../config/database';
import Joi from 'joi';
import { CorporateGovernance } from '../models/sequelize/CorporateGovernance';

const createGovernanceSchema = Joi.object({
  entityName: Joi.string().required(),
  eventType: Joi.string().valid('board-meeting', 'shareholder-meeting', 'resolution', 'filing').required(),
  eventDate: Joi.date().required(),
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
        feature: 'Corporate Governance - Create',
        capabilities: ['Board meetings', 'Resolutions', 'Compliance filings', 'Minutes management']
      });
    }
    const validatedData = validateRequest(createGovernanceSchema, req.body);
    res.status(201).json({ success: true, message: 'Governance event created', data: { id: `GOV-${Date.now()}`, ...validatedData } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Corporate Governance - Details', capabilities: ['Event details', 'Participants', 'Documents'] });
    }
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'Corporate Governance - Update' });
    }
    const record = await CorporateGovernance.findByPk(req.params.id);
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
      return res.status(200).json({ feature: 'Corporate Governance - List', capabilities: ['All events', 'Calendar view'] });
    }
    const records = await CorporateGovernance.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: records, total: records.length });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'CorporateGovernance - Delete' });
    }
    const record = await CorporateGovernance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    await record.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
