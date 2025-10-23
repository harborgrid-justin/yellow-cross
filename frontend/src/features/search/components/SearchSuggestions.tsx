/**
 * SearchSuggestions Component
 * Displays autocomplete suggestions as user types
 */

import React from 'react';
import './SearchSuggestions.css';

interface SearchSuggestionsProps {
  suggestions: any[];
  onSelect: (suggestion: any) => void;
  onClose: () => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  onClose,
}) => {
  return (
    <div className="search-suggestions-dropdown">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="suggestion-item"
          onClick={() => onSelect(suggestion)}
        >
          <div className="suggestion-content">
            <div className="suggestion-title">
              {suggestion.name || suggestion.title || suggestion.caseNumber || suggestion.fileName}
            </div>
            {suggestion.email && (
              <div className="suggestion-subtitle">{suggestion.email}</div>
            )}
            {suggestion.category && (
              <div className="suggestion-subtitle">{suggestion.category}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;
