/**
 * Search Feature Module
 * Exports all search-related components, hooks, and types
 */

export { default as AdvancedSearch } from './components/AdvancedSearch';
export { default as SearchFilters } from './components/SearchFilters';
export { default as SavedSearches } from './components/SavedSearches';
export { default as SearchSuggestions } from './components/SearchSuggestions';

export { useSearchQueries } from './hooks/useSearchQueries';
export { useSearchMutations } from './hooks/useSearchMutations';

export type {
  SearchFilter,
  SearchOptions,
  SearchResult,
  SavedSearch,
  SaveSearchPayload,
} from './types';
