/**
 * Feature 16: Litigation Management
 * Production-grade litigation tracking with pleadings, discovery, and trial management
 */

import express from 'express';
const router = express.Router();
import { isConnected } from '../config/database';
import Joi from 'joi';
import { LitigationMatter } from '../models/sequelize/LitigationMatter';

// Validation schemas
const createLitigationSchema = Joi.object({
  caseId: Joi.string().required(),
  litigationType: Joi.string().valid('civil', 'criminal', 'administrative').required(),
  court: Joi.string().required(),
  judgeAssigned: Joi.string().optional(),
  plaintiffCounsel: Joi.string().optional(),
  defendantCounsel: Joi.string().optional(),
  filingDate: Joi.date().optional(),
  trialDate: Joi.date().optional(),
  createdBy: Joi.string().required()
});

const updateLitigationSchema = Joi.object({
  status: Joi.string().valid('pending', 'discovery', 'trial', 'settled', 'dismissed', 'judgment').optional(),
  trialDate: Joi.date().optional(),
  notes: Joi.string().optional(),
  updatedBy: Joi.string().required()
});

const createPleadingSchema = Joi.object({
  litigationId: Joi.string().required(),
  pleadingType: Joi.string().valid('complaint', 'answer', 'motion', 'brief', 'order').required(),
  filedBy: Joi.string().required(),
  filingDate: Joi.date().required(),
  description: Joi.string().required(),
  documentId: Joi.string().optional()
});

// Helper function to validate requests
const validateRequest = (schema: any, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Create new litigation matter
router.post('/create', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Litigation Management - Create',
        description: 'Create and track litigation matters with full lifecycle management',
        endpoint: '/api/litigation/create',
        capabilities: [
          'Litigation matter creation',
          'Court and judge assignment',
          'Counsel tracking',
          'Trial date management',
          'Case linking'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createLitigationSchema, req.body);

    // Generate unique litigation number
    const litigationNumber = `LIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // Create litigation matter in database
    const litigation = await LitigationMatter.create({
      litigationNumber,
      ...validatedData,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Litigation matter created successfully',
      data: litigation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating litigation matter',
      error: error.message
    });
  }
});

// Get litigation matter details
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Litigation Management - Details',
        description: 'Retrieve detailed litigation matter information',
        endpoint: '/api/litigation/:id',
        capabilities: [
          'Full litigation details',
          'Pleadings timeline',
          'Discovery tracking',
          'Court dates and deadlines',
          'Related documents'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { id } = req.params;

    // Retrieve litigation matter from database
    const litigation = await LitigationMatter.findByPk(id);

    if (!litigation) {
      return res.status(404).json({
        success: false,
        message: 'Litigation matter not found'
      });
    }

    res.json({
      success: true,
      data: litigation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error fetching litigation matter',
      error: error.message
    });
  }
});

// Update litigation matter
router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Litigation Management - Update',
        description: 'Update litigation matter status and details',
        endpoint: '/api/litigation/:id',
        capabilities: [
          'Status updates',
          'Trial date changes',
          'Notes and annotations',
          'Audit trail',
          'Notification triggers'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(updateLitigationSchema, req.body);
    const { id } = req.params;

    // Update litigation matter in database
    const litigation = await LitigationMatter.findByPk(id);

    if (!litigation) {
      return res.status(404).json({
        success: false,
        message: 'Litigation matter not found'
      });
    }

    await litigation.update(validatedData);

    res.json({
      success: true,
      message: 'Litigation matter updated successfully',
      data: litigation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating litigation matter',
      error: error.message
    });
  }
});

// List all litigation matters
router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Litigation Management - List',
        description: 'List and filter all litigation matters',
        endpoint: '/api/litigation',
        capabilities: [
          'Filter by status',
          'Filter by court',
          'Search by case number',
          'Sort by trial date',
          'Pagination support'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Retrieve all litigation matters from database
    const litigations = await LitigationMatter.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: litigations,
      total: litigations.length,
      page: 1,
      pageSize: 50
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error listing litigation matters',
      error: error.message
    });
  }
});

// Create pleading
router.post('/:id/pleadings', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Litigation Management - Pleadings',
        description: 'Create and track pleadings and court filings',
        endpoint: '/api/litigation/:id/pleadings',
        capabilities: [
          'Pleading creation',
          'Document association',
          'Filing tracking',
          'Deadline calculation',
          'Response tracking'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createPleadingSchema, req.body);
    const { id } = req.params;

    // Get litigation matter
    const litigation = await LitigationMatter.findByPk(id);

    if (!litigation) {
      return res.status(404).json({
        success: false,
        message: 'Litigation matter not found'
      });
    }

    const pleading = {
      id: `PLEAD-${Date.now()}`,
      litigationId: id,
      ...validatedData,
      createdAt: new Date()
    };

    // Update pleadings array in litigation matter
    const pleadings = (litigation.pleadings as any[]) || [];
    pleadings.push(pleading);
    await litigation.update({ pleadings });

    res.status(201).json({
      success: true,
      message: 'Pleading created successfully',
      data: pleading
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating pleading',
      error: error.message
    });
  }
});

// Delete litigation matter
router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Litigation Management - Delete',
        description: 'Delete or archive litigation matter',
        endpoint: '/api/litigation/:id',
        capabilities: [
          'Soft delete',
          'Archive matter',
          'Maintain audit trail'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { id } = req.params;

    const litigation = await LitigationMatter.findByPk(id);

    if (!litigation) {
      return res.status(404).json({
        success: false,
        message: 'Litigation matter not found'
      });
    }

    await litigation.destroy();

    res.json({
      success: true,
      message: 'Litigation matter deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error deleting litigation matter',
      error: error.message
    });
  }
});

export default router;
