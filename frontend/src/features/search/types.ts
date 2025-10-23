/**
 * TypeScript type definitions for search feature
 */

export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between';
  value: any;
  condition?: 'AND' | 'OR';
}

export interface SearchOptions {
  query?: string;
  filters?: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SavedSearch {
  id: number;
  name: string;
  description?: string;
  criteria: string;
  type: string;
  isShared: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  useCount: number;
}

export interface SaveSearchPayload {
  name: string;
  description?: string;
  criteria: SearchOptions;
  type: string;
  isShared?: boolean;
}
