/**
 * SearchService - Advanced filtering and search functionality
 * Adapted from Baserow's search implementation for Yellow Cross
 * 
 * @module SearchService
 * @see {@link https://github.com/baserow/baserow/tree/main/backend/src/baserow/contrib/database/search}
 */

import { Op, WhereOptions } from 'sequelize';
import { Case, Client, Document, User } from '../models/sequelize';
import winston from 'winston';

/**
 * Search filter interface
 */
interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between';
  value: any;
  condition?: 'AND' | 'OR';
}

/**
 * Search options interface
 */
interface SearchOptions {
  query?: string;
  filters?: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

/**
 * Search result interface
 */
interface SearchResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * SearchService provides advanced filtering and search capabilities
 * 
 * Features:
 * - Full-text search across multiple fields
 * - Advanced filtering with multiple operators
 * - Pagination support
 * - Saved searches
 * - Cross-entity search
 */
export class SearchService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });
  }

  /**
   * Perform advanced search across cases with filters
   * 
   * @param options - Search options including query, filters, sorting, pagination
   * @param userId - ID of the user performing the search
   * @returns Search results with pagination info
   */
  async searchCases(options: SearchOptions, userId: number): Promise<SearchResult<typeof Case>> {
    const {
      query = '',
      filters = [],
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = options;

    try {
      // Build where clause
      const whereClause: WhereOptions = {};
      
      // Full-text search across multiple fields
      if (query) {
        whereClause[Op.or] = [
          { caseNumber: { [Op.iLike]: `%${query}%` } },
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { status: { [Op.iLike]: `%${query}%` } },
          { practiceArea: { [Op.iLike]: `%${query}%` } },
        ];
      }

      // Apply filters
      const filterConditions = this.buildFilterConditions(filters);
      Object.assign(whereClause, filterConditions);

      // Execute search with pagination
      const offset = (page - 1) * limit;
      const { rows, count } = await Case.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: [
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'name', 'email', 'phone'],
          },
          {
            model: User,
            as: 'assignedTo',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      this.logger.info('Case search executed', {
        userId,
        query,
        filterCount: filters.length,
        resultCount: count,
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      this.logger.error('Case search failed', { error, userId, query });
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search clients with advanced filtering
   * 
   * @param options - Search options
   * @param userId - ID of the user performing the search
   * @returns Search results with pagination
   */
  async searchClients(options: SearchOptions, userId: number): Promise<SearchResult<typeof Client>> {
    const {
      query = '',
      filters = [],
      sortBy = 'name',
      sortOrder = 'ASC',
      page = 1,
      limit = 20,
    } = options;

    try {
      const whereClause: WhereOptions = {};
      
      if (query) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { phone: { [Op.iLike]: `%${query}%` } },
          { company: { [Op.iLike]: `%${query}%` } },
        ];
      }

      const filterConditions = this.buildFilterConditions(filters);
      Object.assign(whereClause, filterConditions);

      const offset = (page - 1) * limit;
      const { rows, count } = await Client.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      this.logger.info('Client search executed', { userId, query, resultCount: count });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      this.logger.error('Client search failed', { error, userId });
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search documents with advanced filtering
   * 
   * @param options - Search options
   * @param userId - ID of the user performing the search
   * @returns Search results with pagination
   */
  async searchDocuments(options: SearchOptions, userId: number): Promise<SearchResult<typeof Document>> {
    const {
      query = '',
      filters = [],
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = options;

    try {
      const whereClause: WhereOptions = {};
      
      if (query) {
        whereClause[Op.or] = [
          { fileName: { [Op.iLike]: `%${query}%` } },
          { category: { [Op.iLike]: `%${query}%` } },
          { tags: { [Op.iLike]: `%${query}%` } },
        ];
      }

      const filterConditions = this.buildFilterConditions(filters);
      Object.assign(whereClause, filterConditions);

      const offset = (page - 1) * limit;
      const { rows, count } = await Document.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: [
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseNumber', 'title'],
          },
          {
            model: User,
            as: 'uploadedBy',
            attributes: ['id', 'username'],
          },
        ],
      });

      this.logger.info('Document search executed', { userId, query, resultCount: count });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      this.logger.error('Document search failed', { error, userId });
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build filter conditions from search filters
   * 
   * @param filters - Array of search filters
   * @returns Sequelize where conditions
   */
  private buildFilterConditions(filters: SearchFilter[]): WhereOptions {
    const conditions: any = {};
    const andConditions: any[] = [];
    const orConditions: any[] = [];

    filters.forEach((filter) => {
      const operator = this.mapOperator(filter.operator);
      const condition = { [filter.field]: { [operator]: filter.value } };

      if (filter.condition === 'OR') {
        orConditions.push(condition);
      } else {
        andConditions.push(condition);
      }
    });

    if (andConditions.length > 0) {
      Object.assign(conditions, ...andConditions);
    }

    if (orConditions.length > 0) {
      if (conditions[Op.or]) {
        conditions[Op.or] = [...conditions[Op.or], ...orConditions];
      } else {
        conditions[Op.or] = orConditions;
      }
    }

    return conditions;
  }

  /**
   * Map filter operator to Sequelize operator
   * 
   * @param operator - Filter operator string
   * @returns Sequelize operator symbol
   */
  private mapOperator(operator: string): symbol {
    const operatorMap: { [key: string]: symbol } = {
      equals: Op.eq,
      contains: Op.iLike,
      startsWith: Op.startsWith,
      endsWith: Op.endsWith,
      gt: Op.gt,
      lt: Op.lt,
      gte: Op.gte,
      lte: Op.lte,
      between: Op.between,
    };
    return operatorMap[operator] || Op.eq;
  }

  /**
   * Get search suggestions based on partial query
   * 
   * @param query - Partial search query
   * @param type - Type of entity to search (case, client, document)
   * @param limit - Maximum number of suggestions
   * @returns Array of suggestions
   */
  async getSuggestions(query: string, type: 'case' | 'client' | 'document', limit: number = 5): Promise<any[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      let results: any[] = [];

      switch (type) {
        case 'case':
          results = await Case.findAll({
            where: {
              [Op.or]: [
                { caseNumber: { [Op.iLike]: `%${query}%` } },
                { title: { [Op.iLike]: `%${query}%` } },
              ],
            },
            attributes: ['id', 'caseNumber', 'title'],
            limit,
          });
          break;

        case 'client':
          results = await Client.findAll({
            where: {
              [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } },
                { email: { [Op.iLike]: `%${query}%` } },
              ],
            },
            attributes: ['id', 'name', 'email'],
            limit,
          });
          break;

        case 'document':
          results = await Document.findAll({
            where: {
              fileName: { [Op.iLike]: `%${query}%` },
            },
            attributes: ['id', 'fileName', 'category'],
            limit,
          });
          break;
      }

      return results;
    } catch (error) {
      this.logger.error('Failed to get suggestions', { error, query, type });
      return [];
    }
  }
}

export default new SearchService();
