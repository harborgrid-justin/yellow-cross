/**
 * Base Service Class
 * Provides common CRUD operations for all services with improved error handling
 */

import { Model, ModelCtor } from 'sequelize-typescript';
import { FindOptions, WhereOptions, Transaction, CreationAttributes } from 'sequelize';
import { DatabaseError, NotFoundError } from '../errors/CustomErrors';

export class BaseService<T extends Model> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  /**
   * Create a new record
   * @param data - Record data
   * @param transaction - Optional transaction for atomic operations
   */
  async create(data: Partial<T>, transaction?: Transaction): Promise<T> {
    try {
      return await this.model.create(data as CreationAttributes<T>, { transaction });
    } catch (error: any) {
      throw new DatabaseError(`Failed to create ${this.model.name}`, error);
    }
  }

  /**
   * Find a record by ID
   * @param id - Record ID
   * @param options - Query options
   */
  async findById(id: string, options?: FindOptions): Promise<T | null> {
    try {
      return await this.model.findByPk(id, options);
    } catch (error: any) {
      throw new DatabaseError(`Failed to find ${this.model.name} by ID`, error);
    }
  }

  /**
   * Find a record by ID or throw NotFoundError
   * @param id - Record ID
   * @param options - Query options
   */
  async findByIdOrFail(id: string, options?: FindOptions): Promise<T> {
    const record = await this.findById(id, options);
    if (!record) {
      throw new NotFoundError(this.model.name, id);
    }
    return record;
  }

  /**
   * Find all records with optional filtering
   * @param options - Query options
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    try {
      return await this.model.findAll(options);
    } catch (error: any) {
      throw new DatabaseError(`Failed to find ${this.model.name} records`, error);
    }
  }

  /**
   * Find one record with filtering
   * @param options - Query options
   */
  async findOne(options: FindOptions): Promise<T | null> {
    try {
      return await this.model.findOne(options);
    } catch (error: any) {
      throw new DatabaseError(`Failed to find ${this.model.name}`, error);
    }
  }

  /**
   * Update a record by ID
   * @param id - Record ID
   * @param data - Update data
   * @param transaction - Optional transaction
   */
  async update(id: string, data: Partial<T>, transaction?: Transaction): Promise<T | null> {
    try {
      const record = await this.findById(id, { transaction });
      if (!record) {
        return null;
      }
      await record.update(data as any, { transaction });
      return record;
    } catch (error: any) {
      throw new DatabaseError(`Failed to update ${this.model.name}`, error);
    }
  }

  /**
   * Update a record by ID or throw NotFoundError
   * @param id - Record ID
   * @param data - Update data
   * @param transaction - Optional transaction
   */
  async updateOrFail(id: string, data: Partial<T>, transaction?: Transaction): Promise<T> {
    const record = await this.update(id, data, transaction);
    if (!record) {
      throw new NotFoundError(this.model.name, id);
    }
    return record;
  }

  /**
   * Delete a record by ID (hard delete)
   * @param id - Record ID
   * @param transaction - Optional transaction
   */
  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    try {
      const record = await this.findById(id, { transaction });
      if (!record) {
        return false;
      }
      await record.destroy({ transaction });
      return true;
    } catch (error: any) {
      throw new DatabaseError(`Failed to delete ${this.model.name}`, error);
    }
  }

  /**
   * Count records with optional filtering
   * @param options - Count options
   */
  async count(options?: { where?: WhereOptions }): Promise<number> {
    try {
      return await this.model.count(options);
    } catch (error: any) {
      throw new DatabaseError(`Failed to count ${this.model.name} records`, error);
    }
  }

  /**
   * Check if a record exists by ID
   * @param id - Record ID
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.model.count({ where: { id } as any });
      return count > 0;
    } catch (error: any) {
      throw new DatabaseError(`Failed to check ${this.model.name} existence`, error);
    }
  }

  /**
   * Bulk create records
   * @param data - Array of record data
   * @param transaction - Optional transaction
   */
  async bulkCreate(data: Partial<T>[], transaction?: Transaction): Promise<T[]> {
    try {
      return await this.model.bulkCreate(data as CreationAttributes<T>[], { transaction });
    } catch (error: any) {
      throw new DatabaseError(`Failed to bulk create ${this.model.name} records`, error);
    }
  }

  /**
   * Find and count all with pagination support
   * @param options - Query options with limit and offset
   */
  async findAndCountAll(options?: FindOptions): Promise<{ rows: T[]; count: number }> {
    try {
      return await this.model.findAndCountAll(options);
    } catch (error: any) {
      throw new DatabaseError(`Failed to find and count ${this.model.name} records`, error);
    }
  }

  /**
   * Paginate results
   * @param page - Page number (1-indexed)
   * @param limit - Records per page
   * @param options - Additional query options
   */
  async paginate(
    page: number = 1,
    limit: number = 10,
    options?: FindOptions
  ): Promise<{ rows: T[]; count: number; page: number; limit: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    const result = await this.findAndCountAll({
      ...options,
      limit,
      offset
    });
    
    return {
      rows: result.rows,
      count: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit)
    };
  }
}

export default BaseService;
