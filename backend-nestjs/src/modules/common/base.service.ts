/**
 * Base Service Class
 * Provides common CRUD operations for all services
 */

import { Injectable } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import { FindOptions, Transaction, CreationAttributes } from 'sequelize';

@Injectable()
export class BaseService<T extends Model> {
  constructor(protected readonly model: ModelCtor<T>) {}

  async create(data: Partial<T>, transaction?: Transaction): Promise<T> {
    return await this.model.create(data as CreationAttributes<T>, { transaction });
  }

  async findById(id: string, options?: FindOptions): Promise<T | null> {
    return await this.model.findByPk(id, options);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return await this.model.findOne(options);
  }

  async update(
    id: string,
    data: Partial<T>,
    transaction?: Transaction,
  ): Promise<T | null> {
    const record = await this.findById(id);
    if (!record) return null;
    
    await record.update(data as any, { transaction });
    return record;
  }

  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    const record = await this.findById(id);
    if (!record) return false;
    
    await record.destroy({ transaction });
    return true;
  }

  async count(options?: FindOptions): Promise<number> {
    return await this.model.count(options);
  }
}
