/**
 * Advanced Search Feature Routes
 * Provides comprehensive search and filtering capabilities
 * 
 * @module search
 */

import { Router, Request, Response } from 'express';
import searchService from '../services/SearchService';
import SavedSearch from '../models/sequelize/SavedSearch';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/search/cases
 * @desc    Advanced search with filters for cases
 * @access  Private
 */
router.post('/cases', authenticate, async (req: Request, res: Response) => {
  try {
    const { query, filters, sortBy, sortOrder, page, limit } = req.body;
    
    const results = await searchService.searchCases(
      {
        query,
        filters,
        sortBy,
        sortOrder,
        page,
        limit,
      },
      req.user.id
    );
    
    res.json(results);
  } catch (error) {
    console.error('Case search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   POST /api/search/clients
 * @desc    Advanced search with filters for clients
 * @access  Private
 */
router.post('/clients', authenticate, async (req: Request, res: Response) => {
  try {
    const { query, filters, sortBy, sortOrder, page, limit } = req.body;
    
    const results = await searchService.searchClients(
      {
        query,
        filters,
        sortBy,
        sortOrder,
        page,
        limit,
      },
      req.user.id
    );
    
    res.json(results);
  } catch (error) {
    console.error('Client search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   POST /api/search/documents
 * @desc    Advanced search with filters for documents
 * @access  Private
 */
router.post('/documents', authenticate, async (req: Request, res: Response) => {
  try {
    const { query, filters, sortBy, sortOrder, page, limit } = req.body;
    
    const results = await searchService.searchDocuments(
      {
        query,
        filters,
        sortBy,
        sortOrder,
        page,
        limit,
      },
      req.user.id
    );
    
    res.json(results);
  } catch (error) {
    console.error('Document search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions as user types
 * @access  Private
 */
router.get('/suggestions', authenticate, async (req: Request, res: Response) => {
  try {
    const { query, type = 'case', limit = 5 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const suggestions = await searchService.getSuggestions(
      query,
      type as 'case' | 'client' | 'document',
      parseInt(limit as string) || 5
    );
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   POST /api/search/saved
 * @desc    Save search criteria for reuse
 * @access  Private
 */
router.post('/saved', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, description, criteria, type, isShared = false } = req.body;
    
    if (!name || !criteria || !type) {
      return res.status(400).json({
        error: 'Name, criteria, and type are required',
      });
    }
    
    const savedSearch = await SavedSearch.create({
      name,
      description,
      criteria: JSON.stringify(criteria),
      type,
      isShared,
      userId: req.user.id,
    });
    
    res.status(201).json(savedSearch);
  } catch (error) {
    console.error('Save search error:', error);
    res.status(500).json({
      error: 'Failed to save search',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   GET /api/search/saved
 * @desc    Get user's saved searches
 * @access  Private
 */
router.get('/saved', authenticate, async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    
    const whereClause: any = {
      userId: req.user.id,
    };
    
    if (type) {
      whereClause.type = type;
    }
    
    const savedSearches = await SavedSearch.findAll({
      where: whereClause,
      order: [['lastUsedAt', 'DESC NULLS LAST'], ['createdAt', 'DESC']],
    });
    
    res.json(savedSearches);
  } catch (error) {
    console.error('Get saved searches error:', error);
    res.status(500).json({
      error: 'Failed to fetch saved searches',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   GET /api/search/saved/:id
 * @desc    Get a specific saved search
 * @access  Private
 */
router.get('/saved/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const savedSearch = await SavedSearch.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });
    
    if (!savedSearch) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    // Record usage
    await savedSearch.recordUsage();
    
    res.json(savedSearch);
  } catch (error) {
    console.error('Get saved search error:', error);
    res.status(500).json({
      error: 'Failed to fetch saved search',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   PUT /api/search/saved/:id
 * @desc    Update a saved search
 * @access  Private
 */
router.put('/saved/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, criteria, isShared } = req.body;
    
    const savedSearch = await SavedSearch.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });
    
    if (!savedSearch) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    // Update fields
    if (name) savedSearch.name = name;
    if (description !== undefined) savedSearch.description = description;
    if (criteria) savedSearch.criteria = JSON.stringify(criteria);
    if (isShared !== undefined) savedSearch.isShared = isShared;
    
    await savedSearch.save();
    
    res.json(savedSearch);
  } catch (error) {
    console.error('Update saved search error:', error);
    res.status(500).json({
      error: 'Failed to update saved search',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   DELETE /api/search/saved/:id
 * @desc    Delete a saved search
 * @access  Private
 */
router.delete('/saved/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const savedSearch = await SavedSearch.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });
    
    if (!savedSearch) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    await savedSearch.destroy();
    
    res.json({ message: 'Saved search deleted successfully' });
  } catch (error) {
    console.error('Delete saved search error:', error);
    res.status(500).json({
      error: 'Failed to delete saved search',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
