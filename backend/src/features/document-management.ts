/**
 * Feature 3: Document Management System
 * 8 Sub-Features: Upload & Storage, Organization & Indexing, Templates Library,
 * Version Control, Search & Retrieval, Collaboration, Security & Permissions, Automation
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

import express from 'express';
const router = express.Router();
import { Document } from '../models/sequelize/Document';
import { DocumentVersion } from '../models/sequelize/DocumentVersion';
import DocumentTemplate from '../models/DocumentTemplate';
import { isConnected } from '../config/database';
import {
  uploadDocumentSchema,
  organizeDocumentSchema,
  permissionsSchema,
  searchDocumentSchema,
  createVersionSchema,
  createTemplateSchema,
  automateDocumentSchema,
  collaborateDocumentSchema,
  batchOperationSchema
} from '../validators/documentValidators';

// Helper function to generate document number
const generateDocumentNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `DOC-${year}-${random}`;
};

// Helper function to generate template ID
const generateTemplateId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TMPL-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Document Upload & Storage
router.post('/upload', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Upload & Storage',
        description: 'Secure cloud storage with version control',
        endpoint: '/api/documents/upload',
        capabilities: [
          'Multi-file upload',
          'Cloud storage',
          'Automatic versioning',
          'File type validation',
          'Storage optimization'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(uploadDocumentSchema, req.body);

    // Generate document number
    const documentNumber = generateDocumentNumber();

    // Create new document
    const newDocument = new Document({
      ...validatedData,
      documentNumber,
      version: 1,
      isLatestVersion: true,
      status: 'Active',
      createdAt: new Date()
    });

    await newDocument.save();

    // Log access
    await newDocument.logAccess(
      null,
      validatedData.createdBy,
      'Document Uploaded',
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        document: newDocument,
        documentNumber: newDocument.documentNumber,
        documentId: newDocument.id,
        fileSizeFormatted: newDocument.fileSizeFormatted
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
});

// Sub-Feature 2: Document Organization & Indexing
router.put('/:id/organize', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Organization & Indexing',
        description: 'Folder structure, tagging, and metadata management',
        endpoint: '/api/documents/:id/organize',
        capabilities: [
          'Folder hierarchy',
          'Tag management',
          'Metadata extraction',
          'Smart indexing',
          'Bulk organization'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(organizeDocumentSchema, req.body);

    // Find document
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update organization fields
    if (validatedData.folderPath !== undefined) {
      document.folderPath = validatedData.folderPath;
    }
    if (validatedData.folderId !== undefined) {
      document.folderId = validatedData.folderId;
    }
    if (validatedData.category !== undefined) {
      document.category = validatedData.category;
    }
    if (validatedData.tags !== undefined) {
      document.tags = validatedData.tags;
    }
    if (validatedData.title !== undefined) {
      document.title = validatedData.title;
    }
    if (validatedData.description !== undefined) {
      document.description = validatedData.description;
    }
    if (validatedData.customMetadata !== undefined) {
      document.customMetadata = new Map(Object.entries(validatedData.customMetadata));
    }

    document.lastModifiedBy = validatedData.updatedBy;
    document.lastModifiedAt = new Date();

    await document.save();

    // Log access
    await document.logAccess(
      null,
      validatedData.updatedBy,
      'Document Organized',
      req.ip
    );

    res.json({
      success: true,
      message: 'Document organized successfully',
      data: {
        documentId: document.id,
        documentNumber: document.documentNumber,
        folderPath: document.folderPath,
        category: document.category,
        tags: document.tags,
        customMetadata: document.customMetadata
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to organize document',
      error: error.message
    });
  }
});

// Sub-Feature 3: Document Templates Library
router.get('/templates', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Templates Library',
        description: 'Legal templates, forms, and pleadings',
        endpoint: '/api/documents/templates',
        capabilities: [
          'Template library',
          'Custom templates',
          'Practice area templates',
          'Template versioning',
          'Template sharing'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { category, practiceArea, search, limit = 50 } = req.query;

    let templates;
    
    if (search) {
      templates = await DocumentTemplate.searchTemplates(search, {
        category,
        practiceArea
      });
    } else if (practiceArea) {
      templates = await DocumentTemplate.findByPracticeArea(practiceArea);
    } else {
      const query = { status: 'Active', isLatestVersion: true };
      if (category) query.category = category;
      
      templates = await DocumentTemplate.find(query)
        .sort({ popularity: -1, name: 1 })
        .limit(parseInt(limit));
    }

    // Get popular templates
    const popularTemplates = await DocumentTemplate.findPopular(5);

    // Get categories summary
    const categorySummary = await DocumentTemplate.aggregate([
      { $match: { status: 'Active', isLatestVersion: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        templates,
        totalTemplates: templates.length,
        popularTemplates,
        categorySummary
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve templates',
      error: error.message
    });
  }
});

// Create new template
router.post('/templates', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(createTemplateSchema, req.body);
    const templateId = generateTemplateId();

    const newTemplate = new DocumentTemplate({
      ...validatedData,
      templateId,
      status: 'Active',
      createdAt: new Date()
    });

    await newTemplate.save();

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: {
        template: newTemplate,
        templateId: newTemplate.templateId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create template',
      error: error.message
    });
  }
});

// Sub-Feature 4: Document Version Control
router.get('/:id/versions', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Version Control',
        description: 'Track revisions and compare versions',
        endpoint: '/api/documents/:id/versions',
        capabilities: [
          'Version history',
          'Version comparison',
          'Rollback capability',
          'Change tracking',
          'Version annotations'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Get all versions of this document
    const allVersions = await Document.findAll({ where: {
      documentNumber: document.documentNumber
    } }).sort({ version: -1 });

    // Get detailed version history from DocumentVersion collection
    const versionHistory = await DocumentVersion.getVersionHistory(document.id);

    res.json({
      success: true,
      data: {
        currentDocument: document,
        currentVersion: document.version,
        isLatestVersion: document.isLatestVersion,
        allVersions,
        totalVersions: allVersions.length,
        versionHistory: document.versionHistory,
        detailedVersionHistory: versionHistory
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve version history',
      error: error.message
    });
  }
});

// Create new version
router.post('/:id/versions', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(createVersionSchema, req.body);
    
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Create new version
    const newVersion = await document.createNewVersion(
      validatedData,
      validatedData.createdBy,
      validatedData.changeDescription
    );

    // Create version record in DocumentVersion collection
    const versionRecord = new DocumentVersion({
      documentId: newVersion.id,
      documentNumber: newVersion.documentNumber,
      versionNumber: newVersion.version,
      changeType: validatedData.changeType,
      changeDescription: validatedData.changeDescription,
      changeSummary: validatedData.changeSummary,
      filename: validatedData.filename,
      fileSize: validatedData.fileSize,
      fileType: validatedData.fileType,
      checksum: validatedData.checksum,
      storagePath: validatedData.storagePath,
      previousVersionId: document.id,
      isCurrent: true,
      createdBy: validatedData.createdBy
    });

    await versionRecord.save();

    res.status(201).json({
      success: true,
      message: 'New version created successfully',
      data: {
        newVersion,
        versionNumber: newVersion.version,
        versionRecord
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create new version',
      error: error.message
    });
  }
});

// Sub-Feature 5: Document Search & Retrieval
router.get('/search', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Search & Retrieval',
        description: 'Full-text search with advanced filters',
        endpoint: '/api/documents/search',
        capabilities: [
          'Full-text search',
          'Advanced filters',
          'Metadata search',
          'Quick retrieval',
          'Search history'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(searchDocumentSchema, req.query);
    const { q, page, limit, ...filters } = validatedData;

    let documents;
    
    if (q) {
      // Full-text search
      documents = await Document.searchDocuments(q, filters);
    } else {
      // Filtered search
      const query = {
        status: { $ne: 'Deleted' },
        isLatestVersion: true
      };

      if (filters.caseId) query.caseId = filters.caseId;
      if (filters.category) query.category = filters.category;
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
      if (filters.createdBy) query.createdBy = filters.createdBy;
      if (filters.fileType) query.fileType = new RegExp(filters.fileType, 'i');
      if (filters.folderPath) query.folderPath = filters.folderPath;
      if (filters.isTemplate !== undefined) query.isTemplate = filters.isTemplate;
      
      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
      }

      if (filters.minSize || filters.maxSize) {
        query.fileSize = {};
        if (filters.minSize) query.fileSize.$gte = filters.minSize;
        if (filters.maxSize) query.fileSize.$lte = filters.maxSize;
      }

      documents = await Document.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    // Get total count
    const totalCount = await Document.countDocuments({
      status: { $ne: 'Deleted' },
      isLatestVersion: true,
      ...filters
    });

    res.json({
      success: true,
      data: {
        documents,
        totalDocuments: documents.length,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to search documents',
      error: error.message
    });
  }
});

// Sub-Feature 6: Document Collaboration
router.post('/:id/collaborate', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Collaboration',
        description: 'Real-time editing, comments, and annotations',
        endpoint: '/api/documents/:id/collaborate',
        capabilities: [
          'Real-time editing',
          'Comments and annotations',
          'Collaborative review',
          'Track changes',
          'Presence indicators'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(collaborateDocumentSchema, req.body);
    
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    let result;

    switch (validatedData.action) {
      case 'lock':
        if (document.isLocked) {
          return res.status(400).json({
            success: false,
            message: 'Document is already locked',
            lockedBy: document.lockedBy
          });
        }
        document.isLocked = true;
        document.lockedBy = validatedData.username;
        document.lockedAt = new Date();
        await document.save();
        result = { locked: true, lockedBy: document.lockedBy };
        break;

      case 'unlock':
        document.isLocked = false;
        document.lockedBy = null;
        document.lockedAt = null;
        await document.save();
        result = { locked: false };
        break;

      case 'checkout':
        if (document.checkoutBy && document.checkoutBy !== validatedData.username) {
          return res.status(400).json({
            success: false,
            message: 'Document is checked out by another user',
            checkoutBy: document.checkoutBy
          });
        }
        document.checkoutBy = validatedData.username;
        document.checkoutAt = new Date();
        await document.save();
        result = { checkedOut: true, checkoutBy: document.checkoutBy };
        break;

      case 'checkin':
        document.checkoutBy = null;
        document.checkoutAt = null;
        await document.save();
        result = { checkedOut: false };
        break;

      case 'comment':
      case 'review':
        // Log the collaboration action
        await document.logAccess(
          null,
          validatedData.username,
          validatedData.action === 'comment' ? 'Comment Added' : 'Document Reviewed',
          req.ip
        );
        result = { 
          action: validatedData.action,
          comment: validatedData.comment,
          by: validatedData.username,
          timestamp: new Date()
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `Collaboration action '${validatedData.action}' completed`,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to perform collaboration action',
      error: error.message
    });
  }
});

// Sub-Feature 7: Document Security & Permissions
router.put('/:id/permissions', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Security & Permissions',
        description: 'Access control, encryption, and redaction',
        endpoint: '/api/documents/:id/permissions',
        capabilities: [
          'Role-based access',
          'Encryption',
          'Redaction tools',
          'Watermarking',
          'Access audit trail'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(permissionsSchema, req.body);
    
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Grant permission using instance method
    await document.grantPermission(
      validatedData.userId,
      validatedData.username,
      validatedData.role,
      validatedData.grantedBy
    );

    // Log access
    await document.logAccess(
      validatedData.userId,
      validatedData.grantedBy,
      `Permission Granted: ${validatedData.role} to ${validatedData.username}`,
      req.ip
    );

    res.json({
      success: true,
      message: 'Permission granted successfully',
      data: {
        documentId: document.id,
        permissions: document.permissions,
        totalPermissions: document.permissions.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update permissions',
      error: error.message
    });
  }
});

// Get document permissions and security info
router.get('/:id/permissions', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: {
        documentId: document.id,
        documentNumber: document.documentNumber,
        visibility: document.visibility,
        permissions: document.permissions,
        encrypted: document.encrypted,
        watermarked: document.watermarked,
        accessLog: document.accessLog.slice(-20), // Last 20 access logs
        totalAccessLogs: document.accessLog.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve permissions',
      error: error.message
    });
  }
});

// Sub-Feature 8: Document Automation
router.post('/automate', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Document Automation',
        description: 'Auto-generate documents from templates',
        endpoint: '/api/documents/automate',
        capabilities: [
          'Template population',
          'Data merge',
          'Conditional content',
          'Batch generation',
          'Custom workflows'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(automateDocumentSchema, req.body);
    
    // Find template
    const template = await DocumentTemplate.findOne({
      templateId: validatedData.templateId,
      status: 'Active'
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Validate required variables
    const missingVariables = template.variables
      .filter(v => v.required && !validatedData.variableValues[v.name])
      .map(v => v.name);

    if (missingVariables.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required template variables',
        missingVariables
      });
    }

    // Populate template content with variable values
    let populatedContent = template.content;
    for (const [varName, varValue] of Object.entries(validatedData.variableValues)) {
      const regex = new RegExp(`\\{\\{${varName}\\}\\}`, 'g');
      populatedContent = populatedContent.replace(regex, varValue);
    }

    // Increment template usage
    await template.incrementUsage();

    let generatedDocument = null;

    // If saveAsDocument is true, save the generated document
    if (validatedData.saveAsDocument) {
      const documentNumber = generateDocumentNumber();
      
      generatedDocument = new Document({
        documentNumber,
        filename: `${validatedData.documentTitle || template.title}-${Date.now()}.${validatedData.outputFormat.toLowerCase()}`,
        title: validatedData.documentTitle || template.title,
        description: `Generated from template: ${template.name}`,
        fileType: validatedData.outputFormat,
        fileSize: Buffer.byteLength(populatedContent, 'utf8'),
        mimeType: getMimeType(validatedData.outputFormat),
        extractedText: populatedContent,
        category: template.category === 'Contract' ? 'Contracts' : 'Other',
        tags: [...(template.tags || []), 'auto-generated'],
        folderPath: validatedData.folderPath,
        caseId: validatedData.caseId,
        caseNumber: validatedData.caseNumber,
        clientId: validatedData.clientId,
        isTemplate: false,
        visibility: 'Team Only',
        status: 'Active',
        createdBy: validatedData.createdBy
      });

      await generatedDocument.save();
    }

    res.status(201).json({
      success: true,
      message: 'Document generated successfully',
      data: {
        template: {
          templateId: template.templateId,
          name: template.name,
          usageCount: template.usageCount
        },
        generatedContent: populatedContent,
        outputFormat: validatedData.outputFormat,
        generatedDocument: generatedDocument ? {
          documentId: generatedDocument.id,
          documentNumber: generatedDocument.documentNumber,
          filename: generatedDocument.filename
        } : null
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to generate document',
      error: error.message
    });
  }
});

// Helper function for MIME types
function getMimeType(format) {
  const mimeTypes = {
    'PDF': 'application/pdf',
    'DOCX': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'TXT': 'text/plain',
    'HTML': 'text/html',
    'RTF': 'application/rtf'
  };
  return mimeTypes[format] || 'application/octet-stream';
}

// Get single document
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Log access
    await document.logAccess(
      null,
      req.query.user || 'anonymous',
      'Document Viewed',
      req.ip
    );

    res.json({
      success: true,
      data: {
        document,
        fileSizeFormatted: document.fileSizeFormatted,
        daysSinceCreation: document.daysSinceCreation
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve document',
      error: error.message
    });
  }
});

// List all documents with pagination
router.get('/', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
        feature: 'Document Management System',
        subFeatures: [
          'Document Upload & Storage',
          'Document Organization & Indexing',
          'Document Templates Library',
          'Document Version Control',
          'Document Search & Retrieval',
          'Document Collaboration',
          'Document Security & Permissions',
          'Document Automation'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || 'Active';

    const query = { 
      status,
      isLatestVersion: true
    };

    if (req.query.caseId) {
      query.caseId = req.query.caseId;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Document.countDocuments(query);

    // Get statistics
    const stats = await Document.aggregate([
      { $match: { status: 'Active', isLatestVersion: true } },
      {
        $group: {
          _id: null,
          totalDocuments: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
          avgSize: { $avg: '$fileSize' }
        }
      }
    ]);

    const categoryCounts = await Document.aggregate([
      { $match: { status: 'Active', isLatestVersion: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page * limit < totalCount
        },
        statistics: stats[0] || { totalDocuments: 0, totalSize: 0, avgSize: 0 },
        categoryCounts
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve documents',
      error: error.message
    });
  }
});

// Delete document (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document.status = 'Deleted';
    document.deletedBy = req.body.deletedBy || 'system';
    document.deletedAt = new Date();
    await document.save();

    res.json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        documentId: document.id,
        documentNumber: document.documentNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
});

// Batch operations on documents
router.post('/batch', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Batch Operations', message: 'Database not connected' });
    }

    const { error, value: validatedData } = batchOperationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { documentIds, operation, targetFolderPath, tags, category, performedBy } = validatedData;
    const results = { successful: [], failed: [] };

    for (const docId of documentIds) {
      try {
        const document = await Document.findByPk(docId);
        
        if (!document) {
          results.failed.push({ docId, reason: 'Document not found' });
          continue;
        }

        switch (operation) {
          case 'move':
            document.folderPath = targetFolderPath;
            break;
          case 'copy':
            // Create a copy - not implemented fully here, would need new document
            results.failed.push({ docId, reason: 'Copy operation needs full implementation' });
            continue;
          case 'delete':
            document.status = 'Deleted';
            document.deletedBy = performedBy;
            document.deletedAt = new Date();
            break;
          case 'archive':
            document.status = 'Archived';
            document.archivedBy = performedBy;
            document.archivedAt = new Date();
            break;
          case 'tag':
            document.tags = [...new Set([...(document.tags || []), ...tags])];
            break;
          case 'categorize':
            document.category = category;
            break;
        }

        await document.save();
        results.successful.push(docId);
      } catch (err) {
        results.failed.push({ docId, reason: err.message });
      }
    }

    res.json({
      success: true,
      message: `Batch ${operation} operation completed`,
      data: results
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
