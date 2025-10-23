/**
 * AdvancedSearch Component
 * Provides comprehensive search interface with filters, saved searches, and suggestions
 * 
 * Adapted from Baserow's search implementation for Yellow Cross
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from './SearchFilters';
import { SavedSearches } from './SavedSearches';
import { SearchSuggestions } from './SearchSuggestions';
import { useSearchQueries } from '../hooks/useSearchQueries';
import { useSearchMutations } from '../hooks/useSearchMutations';
import type { SearchFilter, SearchOptions } from '../types';
import './AdvancedSearch.css';

interface AdvancedSearchProps {
  entityType: 'case' | 'client' | 'document';
  onResultsUpdate?: (results: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  entityType,
  onResultsUpdate,
  placeholder = 'Search...',
  autoFocus = false,
}) => {
  // State management
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Hooks
  const { 
    searchResults, 
    suggestions, 
    savedSearches,
    isLoading,
    error 
  } = useSearchQueries({
    entityType,
    query,
    filters,
    sortBy,
    sortOrder,
    page,
    limit: 20,
  });

  const {
    performSearch,
    saveSearch,
    deleteSearch,
  } = useSearchMutations(entityType);

  // Debounced search
  useEffect(() => {
    if (query.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  // Update parent component with results
  useEffect(() => {
    if (onResultsUpdate && searchResults) {
      onResultsUpdate(searchResults.data);
    }
  }, [searchResults, onResultsUpdate]);

  // Handlers
  const handleSearch = useCallback(() => {
    const searchOptions: SearchOptions = {
      query,
      filters,
      sortBy,
      sortOrder,
      page,
      limit: 20,
    };
    performSearch(searchOptions);
    setShowSuggestions(false);
  }, [query, filters, sortBy, sortOrder, page, performSearch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterAdd = () => {
    setFilters([...filters, {
      field: 'status',
      operator: 'equals',
      value: '',
    }]);
  };

  const handleFilterUpdate = (index: number, filter: SearchFilter) => {
    const updated = [...filters];
    updated[index] = filter;
    setFilters(updated);
  };

  const handleFilterRemove = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSaveSearch = async () => {
    const name = prompt('Enter a name for this search:');
    if (name) {
      await saveSearch({
        name,
        criteria: { query, filters, sortBy, sortOrder },
        type: entityType,
      });
    }
  };

  const handleLoadSavedSearch = (savedSearch: any) => {
    const criteria = JSON.parse(savedSearch.criteria);
    setQuery(criteria.query || '');
    setFilters(criteria.filters || []);
    setSortBy(criteria.sortBy || 'createdAt');
    setSortOrder(criteria.sortOrder || 'DESC');
    setShowSavedSearches(false);
    
    // Trigger search
    setTimeout(() => handleSearch(), 100);
  };

  const handleClearFilters = () => {
    setQuery('');
    setFilters([]);
    setPage(1);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.name || suggestion.title || suggestion.caseNumber || '');
    setShowSuggestions(false);
    handleSearch();
  };

  return (
    <div className="advanced-search">
      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            autoFocus={autoFocus}
          />
          {query && (
            <button
              className="clear-query-btn"
              onClick={() => setQuery('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="search-actions">
          <button
            className="search-btn primary"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>

          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
          >
            <span className="filter-icon">⚙</span>
            Filters {filters.length > 0 && `(${filters.length})`}
          </button>

          <button
            className="saved-searches-btn"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            title="Saved searches"
          >
            <span className="bookmark-icon">★</span>
          </button>

          {(query || filters.length > 0) && (
            <button
              className="save-search-btn"
              onClick={handleSaveSearch}
              title="Save this search"
            >
              Save Search
            </button>
          )}

          {(query || filters.length > 0) && (
            <button
              className="clear-all-btn"
              onClick={handleClearFilters}
              title="Clear all"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionClick}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      {/* Saved Searches Panel */}
      {showSavedSearches && (
        <SavedSearches
          searches={savedSearches || []}
          onLoad={handleLoadSavedSearch}
          onDelete={deleteSearch}
          onClose={() => setShowSavedSearches(false)}
        />
      )}

      {/* Filters Panel */}
      {showFilters && (
        <SearchFilters
          filters={filters}
          entityType={entityType}
          onFilterAdd={handleFilterAdd}
          onFilterUpdate={handleFilterUpdate}
          onFilterRemove={handleFilterRemove}
        />
      )}

      {/* Results Info */}
      {searchResults && (
        <div className="search-results-info">
          <span className="results-count">
            Found {searchResults.pagination.total} results
          </span>
          {searchResults.pagination.totalPages > 1 && (
            <div className="pagination-info">
              Page {searchResults.pagination.page} of {searchResults.pagination.totalPages}
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="search-error">
          <span className="error-icon">⚠</span>
          {error}
        </div>
      )}

      {/* Pagination Controls */}
      {searchResults && searchResults.pagination.totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span className="page-indicator">
            {page} / {searchResults.pagination.totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPage(Math.min(searchResults.pagination.totalPages, page + 1))}
            disabled={page === searchResults.pagination.totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
