/**
 * Feature 21: Mergers & Acquisitions Management
 */
import express from 'express';
const router = express.Router();
import { isConnected } from '../config/database';
import Joi from 'joi';
import { MergerAcquisition } from '../models/sequelize/MergerAcquisition';

const createMandASchema = Joi.object({
  dealName: Joi.string().required(),
  dealType: Joi.string().valid('merger', 'acquisition', 'divestiture').required(),
  targetCompany: Joi.string().required(),
  dealValue: Joi.number().optional(),
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
        feature: 'M&A - Create',
        capabilities: ['Deal tracking', 'Due diligence', 'Integration planning', 'Valuation management']
      });
    }
    const validatedData = validateRequest(createMandASchema, req.body);
    res.status(201).json({ success: true, data: { id: `MA-${Date.now()}`, ...validatedData, status: 'pending' } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'M&A - Details', capabilities: ['Deal details', 'Timeline', 'Documents'] });
    }
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'M&A - Update' });
    }
    const record = await MergerAcquisition.findByPk(req.params.id);
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
      return res.status(200).json({ feature: 'M&A - List', capabilities: ['All deals', 'Pipeline view'] });
    }
    const records = await MergerAcquisition.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: records, total: records.length });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ feature: 'MergerAcquisition - Delete' });
    }
    const record = await MergerAcquisition.findByPk(req.params.id);
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
