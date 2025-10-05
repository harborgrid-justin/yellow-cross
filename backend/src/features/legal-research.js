/**
 * Feature 7: Legal Research & Knowledge Base
 * 8 Sub-Features: Legal Research Integration, Internal Knowledge Base, Case Law Database,
 * Legal Memoranda Library, Research Citation Management, Practice Area Resources, Legal Updates, Research Collaboration
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const ResearchItem = require('../models/ResearchItem');
const { isConnected } = require('../config/database');
const {
  createResearchItemSchema,
  searchResearchSchema,
  addBookmarkSchema,
  shareResearchSchema
} = require('../validators/researchValidators');

// Helper function to generate research number
const generateResearchNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RES-${year}-${random}`;
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
      return res.json({
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

    // Get integration statistics
    const totalItems = await ResearchItem.countDocuments({ status: 'Active' });
    const externalSources = await ResearchItem.aggregate([
      { $unwind: '$externalLinks' },
      { $group: { _id: '$externalLinks.source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent research items with external links
    const recentIntegrated = await ResearchItem.find({
      'externalLinks.0': { $exists: true },
      status: 'Active'
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('researchNumber title itemType externalLinks practiceArea');

    res.json({
      success: true,
      data: {
        totalResearchItems: totalItems,
        externalSources: externalSources.map(s => ({
          source: s._id,
          count: s.count
        })),
        recentIntegrated,
        integrations: {
          westlaw: {
            available: true,
            description: 'Access comprehensive legal research database'
          },
          lexisNexis: {
            available: true,
            description: 'Legal research and business information'
          },
          googleScholar: {
            available: true,
            description: 'Free case law and legal opinions'
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 2: Internal Knowledge Base
router.get('/knowledge-base', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { practiceArea, type, limit = 50 } = req.query;

    // Build query for internal knowledge items
    const query = { status: 'Active' };
    
    // Filter to knowledge base types
    const knowledgeTypes = ['Legal Memo', 'Practice Guide', 'Form', 'Article'];
    if (type && knowledgeTypes.includes(type)) {
      query.itemType = type;
    } else {
      query.itemType = { $in: knowledgeTypes };
    }

    if (practiceArea) {
      query.practiceArea = practiceArea;
    }

    // Get knowledge base items
    const items = await ResearchItem.find(query)
      .sort({ accessCount: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('researchNumber title summary itemType practiceArea topics tags accessCount createdAt');

    // Get statistics by practice area
    const statsByArea = await ResearchItem.aggregate([
      { $match: { itemType: { $in: knowledgeTypes }, status: 'Active' } },
      { $group: { _id: '$practiceArea', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get most popular items
    const popular = await ResearchItem.find({
      itemType: { $in: knowledgeTypes },
      status: 'Active'
    })
      .sort({ accessCount: -1 })
      .limit(10)
      .select('researchNumber title itemType practiceArea accessCount');

    res.json({
      success: true,
      data: {
        items,
        count: items.length,
        statistics: {
          byPracticeArea: statsByArea.map(s => ({
            practiceArea: s._id,
            count: s.count
          })),
          mostPopular: popular
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Case Law Database
router.get('/case-law', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { jurisdiction, court, relevance, precedentialValue, limit = 50 } = req.query;

    // Build query for case law
    const query = { 
      itemType: 'Case Law',
      status: 'Active'
    };

    if (jurisdiction) {
      query.jurisdiction = jurisdiction;
    }
    if (court) {
      query.court = court;
    }
    if (relevance) {
      query.relevance = relevance;
    }
    if (precedentialValue) {
      query.precedentialValue = precedentialValue;
    }

    // Get case law items
    const caseLaw = await ResearchItem.find(query)
      .sort({ decisionDate: -1, relevance: 1 })
      .limit(parseInt(limit))
      .select('researchNumber title citation jurisdiction court decisionDate caseDetails relevance precedentialValue topics');

    // Get statistics
    const stats = {
      total: await ResearchItem.countDocuments({ itemType: 'Case Law', status: 'Active' }),
      byJurisdiction: await ResearchItem.aggregate([
        { $match: { itemType: 'Case Law', status: 'Active' } },
        { $group: { _id: '$jurisdiction', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      byRelevance: await ResearchItem.aggregate([
        { $match: { itemType: 'Case Law', status: 'Active' } },
        { $group: { _id: '$relevance', count: { $sum: 1 } } }
      ])
    };

    res.json({
      success: true,
      data: {
        caseLaw,
        count: caseLaw.length,
        statistics: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: Legal Memoranda Library
router.post('/memoranda', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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
    const validatedData = validateRequest(createResearchItemSchema, req.body);

    // Ensure it's a Legal Memo type
    validatedData.itemType = 'Legal Memo';

    // Generate research number
    const researchNumber = generateResearchNumber();

    // Create new research item
    const memo = new ResearchItem({
      ...validatedData,
      researchNumber
    });

    await memo.save();

    res.status(201).json({
      success: true,
      message: 'Legal memorandum created successfully',
      data: {
        memo,
        researchNumber: memo.researchNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all memoranda
router.get('/memoranda', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({
        feature: 'Legal Memoranda Library',
        message: 'Database not connected'
      });
    }

    const { practiceArea, topic, limit = 50 } = req.query;

    const query = {
      itemType: 'Legal Memo',
      status: 'Active'
    };

    if (practiceArea) {
      query.practiceArea = practiceArea;
    }
    if (topic) {
      query.topics = topic;
    }

    const memos = await ResearchItem.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('researchNumber title summary practiceArea topics createdBy createdAt');

    res.json({
      success: true,
      data: {
        memos,
        count: memos.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Research Citation Management
router.post('/citations', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { researchId, citationType: _citationType } = req.body;

    if (!researchId) {
      return res.status(400).json({
        success: false,
        error: 'Research ID is required'
      });
    }

    // Find the research item
    const item = await ResearchItem.findById(researchId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Research item not found'
      });
    }

    // Generate citation in different formats
    const citations = {
      bluebook: item.citation?.full || `${item.title}, ${item.researchNumber}`,
      shortForm: item.citation?.shortForm || item.researchNumber,
      apa: `${item.title}. Retrieved from ${item.researchNumber}`,
      mla: `"${item.title}." ${item.researchNumber}`,
      chicago: `${item.title}. ${item.researchNumber}.`
    };

    res.json({
      success: true,
      data: {
        researchNumber: item.researchNumber,
        title: item.title,
        citations,
        citedBy: item.citedBy || [],
        cites: item.cites || []
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Export citations
router.get('/citations/export', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Citation Export', message: 'Database not connected' });
    }

    const { format = 'json', practiceArea } = req.query;

    const query = { status: 'Active' };
    if (practiceArea) {
      query.practiceArea = practiceArea;
    }

    const items = await ResearchItem.find(query)
      .select('researchNumber title citation itemType practiceArea')
      .sort({ title: 1 });

    const citations = items.map(item => ({
      researchNumber: item.researchNumber,
      title: item.title,
      citation: item.citation?.full || item.researchNumber,
      type: item.itemType,
      practiceArea: item.practiceArea
    }));

    if (format === 'csv') {
      const csv = [
        'Research Number,Title,Citation,Type,Practice Area',
        ...citations.map(c => `"${c.researchNumber}","${c.title}","${c.citation}","${c.type}","${c.practiceArea}"`)
      ].join('\n');

      res.header('Content-Type', 'text/csv');
      res.attachment('citations.csv');
      return res.send(csv);
    }

    res.json({
      success: true,
      data: { citations }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Practice Area Resources
router.get('/practice-areas/:area', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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
    const { type } = req.query;

    // Build query
    const query = {
      practiceArea,
      status: 'Active'
    };

    if (type) {
      query.itemType = type;
    }

    // Get resources for this practice area
    const resources = await ResearchItem.find(query)
      .sort({ relevance: 1, accessCount: -1, createdAt: -1 })
      .limit(100)
      .select('researchNumber title itemType summary topics tags relevance accessCount');

    // Get statistics by type
    const statsByType = await ResearchItem.aggregate([
      { $match: { practiceArea, status: 'Active' } },
      { $group: { _id: '$itemType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get most popular resources
    const popular = await ResearchItem.find({ practiceArea, status: 'Active' })
      .sort({ accessCount: -1 })
      .limit(10)
      .select('researchNumber title itemType accessCount');

    // Get common topics
    const commonTopics = await ResearchItem.aggregate([
      { $match: { practiceArea, status: 'Active' } },
      { $unwind: '$topics' },
      { $group: { _id: '$topics', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: {
        practiceArea,
        resources,
        count: resources.length,
        statistics: {
          byType: statsByType.map(s => ({ type: s._id, count: s.count })),
          popular,
          commonTopics: commonTopics.map(t => ({ topic: t._id, count: t.count }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all practice areas
router.get('/practice-areas', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Practice Areas', message: 'Database not connected' });
    }

    const practiceAreas = await ResearchItem.aggregate([
      { $match: { status: 'Active' } },
      { $group: { 
        _id: '$practiceArea', 
        count: { $sum: 1 },
        types: { $addToSet: '$itemType' }
      }},
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        practiceAreas: practiceAreas.map(p => ({
          name: p._id,
          resourceCount: p.count,
          types: p.types
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 7: Legal Updates & Alerts
router.get('/updates', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { practiceArea, itemType, days = 30 } = req.query;

    // Get recent updates (items created or modified in last N days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const query = {
      status: 'Active',
      $or: [
        { createdAt: { $gte: cutoffDate } },
        { updatedAt: { $gte: cutoffDate } }
      ]
    };

    if (practiceArea) {
      query.practiceArea = practiceArea;
    }
    if (itemType) {
      query.itemType = itemType;
    }

    // Get recent updates
    const updates = await ResearchItem.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(100)
      .select('researchNumber title itemType practiceArea summary decisionDate createdAt updatedAt');

    // Get counts by type
    const updatesByType = await ResearchItem.aggregate([
      { $match: query },
      { $group: { _id: '$itemType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get counts by practice area
    const updatesByArea = await ResearchItem.aggregate([
      { $match: query },
      { $group: { _id: '$practiceArea', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        updates,
        count: updates.length,
        period: `Last ${days} days`,
        statistics: {
          byType: updatesByType.map(u => ({ type: u._id, count: u.count })),
          byPracticeArea: updatesByArea.map(u => ({ practiceArea: u._id, count: u.count }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 8: Research Collaboration
router.post('/collaborate', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { researchId, action, userId, permission, notes } = req.body;

    if (!researchId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Research ID and action are required'
      });
    }

    const item = await ResearchItem.findById(researchId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Research item not found'
      });
    }

    let result;

    switch (action) {
      case 'share': {
        // Validate share data
        const shareData = validateRequest(shareResearchSchema, { userId, permission: permission || 'View' });
        
        // Add to shared list
        item.sharedWith.push({
          userId: shareData.userId,
          sharedAt: new Date(),
          permission: shareData.permission
        });
        await item.save();
        
        result = { message: 'Research shared successfully', sharedWith: item.sharedWith };
        break;
      }

      case 'bookmark': {
        // Validate bookmark data
        const bookmarkData = validateRequest(addBookmarkSchema, { userId, notes: notes || '' });
        
        // Add bookmark
        await item.addBookmark(bookmarkData.userId, bookmarkData.notes);
        
        result = { message: 'Bookmark added successfully', bookmarks: item.bookmarks };
        break;
      }

      case 'highlight':
        // Add highlight
        if (!req.body.text) {
          return res.status(400).json({
            success: false,
            error: 'Highlight text is required'
          });
        }
        
        item.highlights.push({
          text: req.body.text,
          page: req.body.page || null,
          userId,
          color: req.body.color || 'yellow',
          notes: notes || ''
        });
        await item.save();
        
        result = { message: 'Highlight added successfully', highlights: item.highlights };
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Use: share, bookmark, or highlight'
        });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get collaboration details for a research item
router.get('/collaborate/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Research Collaboration', message: 'Database not connected' });
    }

    const item = await ResearchItem.findById(req.params.id)
      .select('researchNumber title sharedWith bookmarks highlights');

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Research item not found'
      });
    }

    res.json({
      success: true,
      data: {
        researchNumber: item.researchNumber,
        title: item.title,
        sharedWith: item.sharedWith || [],
        bookmarks: item.bookmarks || [],
        highlights: item.highlights || [],
        collaborationStats: {
          sharedWithCount: (item.sharedWith || []).length,
          bookmarkCount: (item.bookmarks || []).length,
          highlightCount: (item.highlights || []).length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new research item
router.post('/create', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({
        feature: 'Create Research Item',
        message: 'Database not connected'
      });
    }

    // Validate input
    const validatedData = validateRequest(createResearchItemSchema, req.body);

    // Generate research number
    const researchNumber = generateResearchNumber();

    // Create new research item
    const item = new ResearchItem({
      ...validatedData,
      researchNumber
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Research item created successfully',
      data: {
        item,
        researchNumber: item.researchNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Search research items
router.post('/search', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({
        feature: 'Research Search',
        message: 'Database not connected'
      });
    }

    // Validate search parameters
    const validatedData = validateRequest(searchResearchSchema, req.body);

    const { query, practiceArea, itemType, jurisdiction, dateFrom, dateTo, relevance, limit } = validatedData;

    // Build search query
    const searchQuery = {
      $text: { $search: query },
      status: 'Active'
    };

    if (practiceArea) searchQuery.practiceArea = practiceArea;
    if (itemType) searchQuery.itemType = itemType;
    if (jurisdiction) searchQuery.jurisdiction = jurisdiction;
    if (relevance) searchQuery.relevance = relevance;
    
    if (dateFrom || dateTo) {
      searchQuery.decisionDate = {};
      if (dateFrom) searchQuery.decisionDate.$gte = new Date(dateFrom);
      if (dateTo) searchQuery.decisionDate.$lte = new Date(dateTo);
    }

    // Execute search
    const results = await ResearchItem.find(
      searchQuery,
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('researchNumber title summary itemType practiceArea citation jurisdiction relevance decisionDate');

    res.json({
      success: true,
      data: {
        query,
        results,
        count: results.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get research item by ID
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Get Research Item', message: 'Database not connected' });
    }

    const item = await ResearchItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Research item not found'
      });
    }

    // Record access
    await item.recordAccess();

    res.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update research item
router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Update Research Item', message: 'Database not connected' });
    }

    const item = await ResearchItem.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        lastModifiedBy: req.body.modifiedBy
      },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Research item not found'
      });
    }

    res.json({
      success: true,
      message: 'Research item updated successfully',
      data: { item }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete (archive) research item
router.delete('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Delete Research Item', message: 'Database not connected' });
    }

    const item = await ResearchItem.findByIdAndUpdate(
      req.params.id,
      { status: 'Archived' },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Research item not found'
      });
    }

    res.json({
      success: true,
      message: 'Research item archived successfully',
      data: { researchNumber: item.researchNumber }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Research overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Legal Research & Knowledge Base',
    description: 'Comprehensive legal research and knowledge management system',
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
    endpoints: {
      create: 'POST /api/research/create',
      search: 'POST /api/research/search',
      getById: 'GET /api/research/:id',
      update: 'PUT /api/research/:id',
      delete: 'DELETE /api/research/:id',
      integrations: 'GET /api/research/integrations',
      knowledgeBase: 'GET /api/research/knowledge-base',
      caseLaw: 'GET /api/research/case-law',
      memoranda: 'GET/POST /api/research/memoranda',
      citations: 'POST /api/research/citations',
      practiceAreas: 'GET /api/research/practice-areas/:area',
      updates: 'GET /api/research/updates',
      collaborate: 'POST /api/research/collaborate/:id'
    }
  });
});

module.exports = router;
