/**
 * Feature 7: Legal Research & Knowledge Base
 * 8 Sub-Features: Legal Research Integration, Internal Knowledge Base, Case Law Database,
 * Legal Memoranda Library, Research Citation Management, Practice Area Resources, Legal Updates, Research Collaboration
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const ResearchIntegration = require('../models/ResearchIntegration');
const KnowledgeBase = require('../models/KnowledgeBase');
const CaseLaw = require('../models/CaseLaw');
const LegalMemorandum = require('../models/LegalMemorandum');
const Citation = require('../models/Citation');
const PracticeAreaResource = require('../models/PracticeAreaResource');
const LegalUpdate = require('../models/LegalUpdate');
const ResearchProject = require('../models/ResearchProject');
const { isConnected } = require('../config/database');
const {
  createIntegrationSchema,
  createKnowledgeBaseSchema,
  createCaseLawSchema,
  createMemorandumSchema,
  createCitationSchema,
  createResourceSchema,
  createUpdateSchema,
  createProjectSchema,
  searchSchema,
  addTeamMemberSchema,
  addResearchItemSchema,
  addAnnotationSchema,
  addCommentSchema
} = require('../validators/researchValidators');

// Helper function to generate IDs
const generateId = (prefix) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Legal Research Integration
router.get('/integrations', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Legal Research Integration',
        description: 'Connect to Westlaw, LexisNexis',
        endpoint: '/api/research/integrations',
        capabilities: [
          'Westlaw integration',
          'LexisNexis connection',
          'Case law search',
          'Statute research',
          'Direct access links'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get all active integrations
    const integrations = await ResearchIntegration.find({ isActive: true })
      .sort({ 'usageStats.lastUsed': -1 });

    res.json({
      success: true,
      data: {
        integrations: integrations,
        totalIntegrations: integrations.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching integrations',
      error: error.message
    });
  }
});

// Create new research integration
router.post('/integrations', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Legal Research Integration',
        description: 'Connect to Westlaw, LexisNexis',
        endpoint: '/api/research/integrations',
        capabilities: [
          'Westlaw integration',
          'LexisNexis connection',
          'Case law search',
          'Statute research',
          'Direct access links'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createIntegrationSchema, req.body);

    // Generate integration ID
    const integrationId = generateId('INT');

    // Create new integration
    const newIntegration = new ResearchIntegration({
      ...validatedData,
      integrationId,
      isActive: true,
      usageStats: {
        totalSearches: 0,
        monthlySearches: 0
      }
    });

    await newIntegration.save();

    res.status(201).json({
      success: true,
      message: 'Research integration created successfully',
      data: {
        integration: newIntegration
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating integration',
      error: error.message
    });
  }
});

// Sub-Feature 2: Internal Knowledge Base
router.get('/knowledge-base', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Internal Knowledge Base',
        description: 'Store firm knowledge and best practices',
        endpoint: '/api/research/knowledge-base',
        capabilities: [
          'Knowledge articles',
          'Best practices',
          'Firm precedents',
          'Search functionality',
          'Version control'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get query parameters for filtering
    const { practiceArea, category, status = 'Published', page = 1, limit = 20 } = req.query;

    // Build query
    const query = { isLatestVersion: true };
    if (practiceArea) query.practiceArea = practiceArea;
    if (category) query.category = category;
    if (status) query.status = status;

    // Get articles with pagination
    const skip = (page - 1) * limit;
    const articles = await KnowledgeBase.find(query)
      .sort({ viewCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalArticles = await KnowledgeBase.countDocuments(query);

    res.json({
      success: true,
      data: {
        articles: articles,
        totalArticles: totalArticles,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalArticles / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching knowledge base articles',
      error: error.message
    });
  }
});

// Create new knowledge base article
router.post('/knowledge-base', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Internal Knowledge Base',
        description: 'Store firm knowledge and best practices',
        endpoint: '/api/research/knowledge-base',
        capabilities: [
          'Knowledge articles',
          'Best practices',
          'Firm precedents',
          'Search functionality',
          'Version control'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createKnowledgeBaseSchema, req.body);

    // Generate article ID
    const articleId = generateId('KB');

    // Create new article
    const newArticle = new KnowledgeBase({
      ...validatedData,
      articleId,
      version: 1,
      isLatestVersion: true,
      viewCount: 0,
      helpfulCount: 0
    });

    await newArticle.save();

    res.status(201).json({
      success: true,
      message: 'Knowledge base article created successfully',
      data: {
        article: newArticle
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating article',
      error: error.message
    });
  }
});

// Sub-Feature 3: Case Law Database
router.get('/case-law', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Law Database',
        description: 'Search precedents and relevant cases',
        endpoint: '/api/research/case-law',
        capabilities: [
          'Precedent search',
          'Citation lookup',
          'Shepardizing',
          'Case summaries',
          'Relevant cases'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get query parameters for filtering
    const { 
      jurisdiction, 
      citation, 
      keywords, 
      practiceArea, 
      precedentValue,
      currentValidity = 'Good Law',
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    const query = {};
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (citation) query.citation = new RegExp(citation, 'i');
    if (practiceArea) query.practiceArea = practiceArea;
    if (precedentValue) query.precedentValue = precedentValue;
    if (currentValidity) query.currentValidity = currentValidity;

    // If keywords, use text search
    let cases;
    if (keywords) {
      cases = await CaseLaw.searchCaseLaw(keywords, query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    } else {
      cases = await CaseLaw.find(query)
        .sort({ decisionDate: -1, relevanceScore: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    const totalCases = await CaseLaw.countDocuments(query);

    res.json({
      success: true,
      data: {
        cases: cases,
        totalCases: totalCases,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCases / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error searching case law',
      error: error.message
    });
  }
});

// Add new case law entry
router.post('/case-law', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Law Database',
        description: 'Search precedents and relevant cases',
        endpoint: '/api/research/case-law',
        capabilities: [
          'Precedent search',
          'Citation lookup',
          'Shepardizing',
          'Case summaries',
          'Relevant cases'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createCaseLawSchema, req.body);

    // Generate case ID
    const caseId = generateId('CL');

    // Create new case law entry
    const newCaseLaw = new CaseLaw({
      ...validatedData,
      caseId,
      currentValidity: 'Good Law',
      relevanceScore: 0,
      usageCount: 0
    });

    await newCaseLaw.save();

    res.status(201).json({
      success: true,
      message: 'Case law entry created successfully',
      data: {
        caseLaw: newCaseLaw
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating case law entry',
      error: error.message
    });
  }
});

// Sub-Feature 4: Legal Memoranda Library
router.get('/memoranda', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Legal Memoranda Library',
        description: 'Store and retrieve legal memos',
        endpoint: '/api/research/memoranda',
        capabilities: [
          'Memo storage',
          'Search and retrieval',
          'Topic categorization',
          'Memo templates',
          'Access control'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get query parameters for filtering
    const { 
      practiceArea, 
      memoType, 
      author,
      status = 'Final',
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    const query = { isLatestVersion: true };
    if (practiceArea) query.practiceArea = practiceArea;
    if (memoType) query.memoType = memoType;
    if (author) query.author = author;
    if (status) query.status = { $in: status.split(',') };

    // Get memos with pagination
    const skip = (page - 1) * limit;
    const memos = await LegalMemorandum.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalMemos = await LegalMemorandum.countDocuments(query);

    res.json({
      success: true,
      data: {
        memos: memos,
        totalMemos: totalMemos,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalMemos / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching memoranda',
      error: error.message
    });
  }
});

// Create new legal memorandum
router.post('/memoranda', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Legal Memoranda Library',
        description: 'Store and retrieve legal memos',
        endpoint: '/api/research/memoranda',
        capabilities: [
          'Memo storage',
          'Search and retrieval',
          'Topic categorization',
          'Memo templates',
          'Access control'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createMemorandumSchema, req.body);

    // Generate memo ID
    const memoId = generateId('MEMO');

    // Create new memorandum
    const newMemo = new LegalMemorandum({
      ...validatedData,
      memoId,
      version: 1,
      isLatestVersion: true,
      viewCount: 0,
      citationCount: 0,
      draftDate: new Date()
    });

    await newMemo.save();

    res.status(201).json({
      success: true,
      message: 'Legal memorandum created successfully',
      data: {
        memo: newMemo
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating memorandum',
      error: error.message
    });
  }
});

// Sub-Feature 5: Research Citation Management
router.get('/citations', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Research Citation Management',
        description: 'Organize citations and references',
        endpoint: '/api/research/citations',
        capabilities: [
          'Citation tracking',
          'Bluebook formatting',
          'Reference library',
          'Citation validation',
          'Export citations'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get query parameters for filtering
    const { 
      citationType, 
      practiceArea, 
      jurisdiction,
      year,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    const query = {};
    if (citationType) query.citationType = citationType;
    if (practiceArea) query.practiceArea = practiceArea;
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (year) query.year = parseInt(year);

    // Get citations with pagination
    const skip = (page - 1) * limit;
    const citations = await Citation.find(query)
      .sort({ usageCount: -1, year: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCitations = await Citation.countDocuments(query);

    res.json({
      success: true,
      data: {
        citations: citations,
        totalCitations: totalCitations,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCitations / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching citations',
      error: error.message
    });
  }
});

// Create new citation
router.post('/citations', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Research Citation Management',
        description: 'Organize citations and references',
        endpoint: '/api/research/citations',
        capabilities: [
          'Citation tracking',
          'Bluebook formatting',
          'Reference library',
          'Citation validation',
          'Export citations'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createCitationSchema, req.body);

    // Generate citation ID
    const citationId = generateId('CIT');

    // Create new citation
    const newCitation = new Citation({
      ...validatedData,
      citationId,
      isValidated: false,
      usageCount: 0
    });

    // Generate Bluebook formatting
    newCitation.generateBluebook();

    await newCitation.save();

    res.status(201).json({
      success: true,
      message: 'Citation created successfully',
      data: {
        citation: newCitation
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating citation',
      error: error.message
    });
  }
});

// Sub-Feature 6: Practice Area Resources
router.get('/practice-areas/:area', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Practice Area Resources',
        description: 'Specialized resources by practice area',
        endpoint: '/api/research/practice-areas/:area',
        capabilities: [
          'Practice area libraries',
          'Specialized forms',
          'Industry resources',
          'Expert directories',
          'Custom collections'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const practiceArea = req.params.area;
    const { resourceType, jurisdiction, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { 
      practiceArea, 
      status: 'Published', 
      isLatestVersion: true 
    };
    if (resourceType) query.resourceType = resourceType;
    if (jurisdiction) query.jurisdiction = jurisdiction;

    // Get resources with pagination
    const skip = (page - 1) * limit;
    const resources = await PracticeAreaResource.find(query)
      .sort({ viewCount: -1, 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalResources = await PracticeAreaResource.countDocuments(query);

    // Get resource type breakdown
    const resourcesByType = await PracticeAreaResource.aggregate([
      { $match: { practiceArea, status: 'Published', isLatestVersion: true } },
      { $group: { _id: '$resourceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        practiceArea: practiceArea,
        resources: resources,
        totalResources: totalResources,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalResources / limit),
        resourcesByType: resourcesByType
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching practice area resources',
      error: error.message
    });
  }
});

// Create new practice area resource
router.post('/practice-areas', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Practice Area Resources',
        description: 'Specialized resources by practice area',
        endpoint: '/api/research/practice-areas',
        capabilities: [
          'Practice area libraries',
          'Specialized forms',
          'Industry resources',
          'Expert directories',
          'Custom collections'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createResourceSchema, req.body);

    // Generate resource ID
    const resourceId = generateId('RES');

    // Create new resource
    const newResource = new PracticeAreaResource({
      ...validatedData,
      resourceId,
      version: 1,
      isLatestVersion: true,
      viewCount: 0,
      downloadCount: 0,
      rating: {
        average: 0,
        count: 0
      }
    });

    await newResource.save();

    res.status(201).json({
      success: true,
      message: 'Practice area resource created successfully',
      data: {
        resource: newResource
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating resource',
      error: error.message
    });
  }
});

// Sub-Feature 7: Legal Updates & Alerts
router.get('/updates', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Legal Updates & Alerts',
        description: 'Track changes in law and regulations',
        endpoint: '/api/research/updates',
        capabilities: [
          'Legislative updates',
          'Regulatory changes',
          'Case law alerts',
          'Custom alerts',
          'Newsletter digests'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get query parameters for filtering
    const { 
      updateType, 
      practiceArea, 
      jurisdiction,
      impactLevel,
      urgency,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    const query = { status: 'Published' };
    if (updateType) query.updateType = updateType;
    if (practiceArea) query.practiceArea = practiceArea;
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (impactLevel) query.impactLevel = impactLevel;
    if (urgency) query.urgency = urgency;

    // Get updates with pagination
    const skip = (page - 1) * limit;
    const updates = await LegalUpdate.find(query)
      .sort({ publishedDate: -1, urgency: 1, impactLevel: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUpdates = await LegalUpdate.countDocuments(query);

    // Get urgent updates count
    const urgentCount = await LegalUpdate.countDocuments({
      status: 'Published',
      urgency: { $in: ['Immediate', 'High'] },
      impactLevel: { $in: ['Critical', 'High'] }
    });

    res.json({
      success: true,
      data: {
        updates: updates,
        totalUpdates: totalUpdates,
        urgentUpdates: urgentCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUpdates / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching updates',
      error: error.message
    });
  }
});

// Create new legal update
router.post('/updates', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Legal Updates & Alerts',
        description: 'Track changes in law and regulations',
        endpoint: '/api/research/updates',
        capabilities: [
          'Legislative updates',
          'Regulatory changes',
          'Case law alerts',
          'Custom alerts',
          'Newsletter digests'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createUpdateSchema, req.body);

    // Generate update ID
    const updateId = generateId('UPD');

    // Create new update
    const newUpdate = new LegalUpdate({
      ...validatedData,
      updateId,
      viewCount: 0,
      shareCount: 0,
      alertSent: false
    });

    await newUpdate.save();

    res.status(201).json({
      success: true,
      message: 'Legal update created successfully',
      data: {
        update: newUpdate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating update',
      error: error.message
    });
  }
});

// Sub-Feature 8: Research Collaboration
router.get('/collaborate', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Research Collaboration',
        description: 'Share research and annotate findings',
        endpoint: '/api/research/collaborate',
        capabilities: [
          'Research sharing',
          'Collaborative annotations',
          'Comments and notes',
          'Research projects',
          'Team workspaces'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get query parameters for filtering
    const { 
      userId,
      practiceArea, 
      projectType,
      status = 'Active',
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (practiceArea) query.practiceArea = practiceArea;
    if (projectType) query.projectType = projectType;

    // If userId provided, find projects where user is owner or team member
    if (userId) {
      query = {
        ...query,
        $or: [
          { owner: userId },
          { 'team.userId': userId }
        ]
      };
    }

    // Get projects with pagination
    const skip = (page - 1) * limit;
    const projects = await ResearchProject.find(query)
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalProjects = await ResearchProject.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects: projects,
        totalProjects: totalProjects,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalProjects / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching research projects',
      error: error.message
    });
  }
});

// Create new research collaboration project
router.post('/collaborate', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Research Collaboration',
        description: 'Share research and annotate findings',
        endpoint: '/api/research/collaborate',
        capabilities: [
          'Research sharing',
          'Collaborative annotations',
          'Comments and notes',
          'Research projects',
          'Team workspaces'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createProjectSchema, req.body);

    // Generate project ID
    const projectId = generateId('PROJ');

    // Create new project
    const newProject = new ResearchProject({
      ...validatedData,
      projectId,
      researchItems: [],
      workspaces: [],
      team: [],
      activityLog: [],
      lastActivity: new Date(),
      totalItems: 0,
      totalAnnotations: 0,
      totalComments: 0,
      startDate: new Date()
    });

    // Log creation activity
    newProject.logActivity('Created', validatedData.createdBy, 'Project created');

    await newProject.save();

    res.status(201).json({
      success: true,
      message: 'Research project created successfully',
      data: {
        project: newProject
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating research project',
      error: error.message
    });
  }
});

// Add team member to project
router.post('/collaborate/:projectId/team', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected - showing capabilities only'
      });
    }

    const projectId = req.params.projectId;

    // Validate input
    const validatedData = validateRequest(addTeamMemberSchema, req.body);

    // Find project
    const project = await ResearchProject.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Add team member
    project.addTeamMember(validatedData.userId, validatedData.name, validatedData.role);
    await project.save();

    res.json({
      success: true,
      message: 'Team member added successfully',
      data: {
        project: project
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding team member',
      error: error.message
    });
  }
});

// Add research item to project
router.post('/collaborate/:projectId/items', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected - showing capabilities only'
      });
    }

    const projectId = req.params.projectId;

    // Validate input
    const validatedData = validateRequest(addResearchItemSchema, req.body);

    // Find project
    const project = await ResearchProject.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Add research item
    const itemId = project.addResearchItem(
      validatedData.itemType,
      validatedData.title,
      validatedData.content,
      validatedData.addedBy,
      validatedData.reference
    );
    
    await project.save();

    res.json({
      success: true,
      message: 'Research item added successfully',
      data: {
        itemId: itemId,
        project: project
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding research item',
      error: error.message
    });
  }
});

// Add annotation to research item
router.post('/collaborate/:projectId/annotate', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected - showing capabilities only'
      });
    }

    const projectId = req.params.projectId;

    // Validate input
    const validatedData = validateRequest(addAnnotationSchema, req.body);

    // Find project
    const project = await ResearchProject.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Add annotation
    project.addAnnotation(
      validatedData.itemId,
      validatedData.userId,
      validatedData.username,
      validatedData.text,
      validatedData.highlightedText
    );
    
    await project.save();

    res.json({
      success: true,
      message: 'Annotation added successfully',
      data: {
        project: project
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding annotation',
      error: error.message
    });
  }
});

// Add comment to research item
router.post('/collaborate/:projectId/comment', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected - showing capabilities only'
      });
    }

    const projectId = req.params.projectId;

    // Validate input
    const validatedData = validateRequest(addCommentSchema, req.body);

    // Find project
    const project = await ResearchProject.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Add comment
    project.addComment(
      validatedData.itemId,
      validatedData.userId,
      validatedData.username,
      validatedData.text
    );
    
    await project.save();

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: {
        project: project
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

// Research overview
router.get('/', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Legal Research & Knowledge Base',
        subFeatures: [
          'Legal Research Integration',
          'Internal Knowledge Base',
          'Case Law Database',
          'Legal Memoranda Library',
          'Research Citation Management',
          'Practice Area Resources',
          'Legal Updates & Alerts',
          'Research Collaboration'
        ],
        message: 'Database not connected - showing system capabilities only'
      });
    }

    // Get statistics from each sub-feature
    const integrationCount = await ResearchIntegration.countDocuments({ isActive: true });
    const knowledgeBaseCount = await KnowledgeBase.countDocuments({ status: 'Published', isLatestVersion: true });
    const caseLawCount = await CaseLaw.countDocuments({ currentValidity: 'Good Law' });
    const memoCount = await LegalMemorandum.countDocuments({ status: { $in: ['Approved', 'Final'] }, isLatestVersion: true });
    const citationCount = await Citation.countDocuments({ isValidated: true });
    const resourceCount = await PracticeAreaResource.countDocuments({ status: 'Published', isLatestVersion: true });
    const updateCount = await LegalUpdate.countDocuments({ status: 'Published' });
    const projectCount = await ResearchProject.countDocuments({ status: { $in: ['Active', 'In Progress'] } });

    res.json({
      success: true,
      feature: 'Legal Research & Knowledge Base',
      subFeatures: [
        'Legal Research Integration',
        'Internal Knowledge Base',
        'Case Law Database',
        'Legal Memoranda Library',
        'Research Citation Management',
        'Practice Area Resources',
        'Legal Updates & Alerts',
        'Research Collaboration'
      ],
      statistics: {
        activeIntegrations: integrationCount,
        publishedArticles: knowledgeBaseCount,
        caseLawEntries: caseLawCount,
        legalMemos: memoCount,
        citations: citationCount,
        practiceAreaResources: resourceCount,
        legalUpdates: updateCount,
        activeProjects: projectCount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching research system overview',
      error: error.message
    });
  }
});

module.exports = router;
