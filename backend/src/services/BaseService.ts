/**
 * Base Service Class
 * Provides common CRUD operations for all services
 */

import { Model, ModelCtor } from 'sequelize-typescript';
import { FindOptions, WhereOptions } from 'sequelize';

export class BaseService<T extends Model> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data as any);
    } catch (error) {
      throw new Error(`Error creating ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Find a record by ID
   */
  async findById(id: string, options?: FindOptions): Promise<T | null> {
    try {
      return await this.model.findByPk(id, options);
    } catch (error) {
      throw new Error(`Error finding ${this.model.name} by ID: ${error.message}`);
    }
  }

  /**
   * Find all records with optional filtering
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    try {
      return await this.model.findAll(options);
    } catch (error) {
      throw new Error(`Error finding all ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Find one record with filtering
   */
  async findOne(options: FindOptions): Promise<T | null> {
    try {
      return await this.model.findOne(options);
    } catch (error) {
      throw new Error(`Error finding ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Update a record by ID
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const record = await this.findById(id);
      if (!record) {
        return null;
      }
      await record.update(data as any);
      return record;
    } catch (error) {
      throw new Error(`Error updating ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      const record = await this.findById(id);
      if (!record) {
        return false;
      }
      await record.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Count records with optional filtering
   */
  async count(options?: { where?: WhereOptions }): Promise<number> {
    try {
      return await this.model.count(options);
    } catch (error) {
      throw new Error(`Error counting ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Check if a record exists by ID
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.model.count({ where: { id } as any });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking existence of ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Bulk create records
   */
  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    try {
      return await this.model.bulkCreate(data as any[]);
    } catch (error) {
      throw new Error(`Error bulk creating ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Find and count all with pagination
   */
  async findAndCountAll(options?: FindOptions): Promise<{ rows: T[]; count: number }> {
    try {
      return await this.model.findAndCountAll(options);
    } catch (error) {
      throw new Error(`Error finding and counting ${this.model.name}: ${error.message}`);
    }
  }
}

export default BaseService;
