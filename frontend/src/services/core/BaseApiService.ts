/**
 * WF-COMP-XXX | BaseApiService.ts - Base API service abstract class
 * Purpose: Provides reusable CRUD patterns for all API modules
 * Dependencies: ./ApiClient, zod
 * Exports: BaseApiService class, interfaces
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { ApiClient, PaginatedResponse } from './ApiClient';
import { z, ZodSchema } from 'zod';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams extends PaginationParams {
  [key: string]: unknown;
}

export interface CrudOperations<T extends BaseEntity, TCreate, TUpdate = Partial<TCreate>> {
  getAll(filters?: FilterParams): Promise<PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

// ==========================================
// BASE API SERVICE CLASS
// ==========================================

export abstract class BaseApiService<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> implements CrudOperations<TEntity, TCreateDto, TUpdateDto> {
  protected client: ApiClient;
  protected baseEndpoint: string;
  protected createSchema?: ZodSchema<TCreateDto>;
  protected updateSchema?: ZodSchema<TUpdateDto>;

  constructor(
    client: ApiClient,
    baseEndpoint: string,
    options?: {
      createSchema?: ZodSchema<TCreateDto>;
      updateSchema?: ZodSchema<TUpdateDto>;
    }
  ) {
    this.client = client;
    this.baseEndpoint = baseEndpoint;
    this.createSchema = options?.createSchema;
    this.updateSchema = options?.updateSchema;
  }

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================

  async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    try {
      const response = await this.client.get<PaginatedResponse<TEntity>>(this.baseEndpoint, { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<TEntity> {
    try {
      const response = await this.client.get<TEntity>(`${this.baseEndpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: TCreateDto): Promise<TEntity> {
    try {
      // Validate input if schema provided
      const validatedData = this.createSchema ? this.createSchema.parse(data) : data;
      
      const response = await this.client.post<TEntity>(this.baseEndpoint, validatedData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: TUpdateDto): Promise<TEntity> {
    try {
      // Validate input if schema provided
      const validatedData = this.updateSchema ? this.updateSchema.parse(data) : data;
      
      const response = await this.client.put<TEntity>(`${this.baseEndpoint}/${id}`, validatedData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  protected handleError(error: unknown): never {
    // Transform and re-throw errors in a consistent format
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unknown error occurred');
  }

  protected buildUrl(path: string): string {
    return `${this.baseEndpoint}${path.startsWith('/') ? path : `/${path}`}`;
  }
}
