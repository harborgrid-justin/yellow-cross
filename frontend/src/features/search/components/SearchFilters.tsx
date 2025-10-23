/**
 * SearchFilters Component
 * Provides UI for building complex search filters
 */

import React from 'react';
import type { SearchFilter } from '../types';
import './SearchFilters.css';

interface SearchFiltersProps {
  filters: SearchFilter[];
  entityType: 'case' | 'client' | 'document';
  onFilterAdd: () => void;
  onFilterUpdate: (index: number, filter: SearchFilter) => void;
  onFilterRemove: (index: number) => void;
}

const FIELD_OPTIONS = {
  case: [
    { value: 'caseNumber', label: 'Case Number' },
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'practiceArea', label: 'Practice Area' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
  ],
  client: [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'company', label: 'Company' },
    { value: 'status', label: 'Status' },
    { value: 'createdAt', label: 'Created Date' },
  ],
  document: [
    { value: 'fileName', label: 'File Name' },
    { value: 'category', label: 'Category' },
    { value: 'tags', label: 'Tags' },
    { value: 'fileSize', label: 'File Size' },
    { value: 'createdAt', label: 'Upload Date' },
  ],
};

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
  { value: 'gt', label: 'Greater Than' },
  { value: 'lt', label: 'Less Than' },
  { value: 'gte', label: 'Greater Than or Equal' },
  { value: 'lte', label: 'Less Than or Equal' },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  entityType,
  onFilterAdd,
  onFilterUpdate,
  onFilterRemove,
}) => {
  const fieldOptions = FIELD_OPTIONS[entityType] || FIELD_OPTIONS.case;

  return (
    <div className="search-filters-panel">
      <div className="filters-header">
        <h4>Advanced Filters</h4>
        <button className="add-filter-btn" onClick={onFilterAdd}>
          + Add Filter
        </button>
      </div>

      {filters.length === 0 && (
        <div className="no-filters-message">
          No filters applied. Click "Add Filter" to start filtering results.
        </div>
      )}

      <div className="filters-list">
        {filters.map((filter, index) => (
          <div key={index} className="filter-row">
            <div className="filter-field">
              <label>Field</label>
              <select
                value={filter.field}
                onChange={(e) =>
                  onFilterUpdate(index, { ...filter, field: e.target.value })
                }
                className="filter-select"
              >
                {fieldOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-operator">
              <label>Operator</label>
              <select
                value={filter.operator}
                onChange={(e) =>
                  onFilterUpdate(index, {
                    ...filter,
                    operator: e.target.value as SearchFilter['operator'],
                  })
                }
                className="filter-select"
              >
                {OPERATOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-value">
              <label>Value</label>
              <input
                type="text"
                value={filter.value}
                onChange={(e) =>
                  onFilterUpdate(index, { ...filter, value: e.target.value })
                }
                className="filter-input"
                placeholder="Enter value"
              />
            </div>

            <div className="filter-actions">
              <button
                className="remove-filter-btn"
                onClick={() => onFilterRemove(index)}
                title="Remove filter"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {filters.length > 0 && (
        <div className="filters-summary">
          <span className="filters-count">
            {filters.length} filter{filters.length !== 1 ? 's' : ''} active
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
