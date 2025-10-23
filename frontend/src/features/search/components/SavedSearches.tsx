/**
 * SavedSearches Component
 * Displays and manages saved search queries
 */

import React from 'react';
import './SavedSearches.css';

interface SavedSearch {
  id: number;
  name: string;
  description?: string;
  type: string;
  useCount: number;
  lastUsedAt?: string;
  createdAt: string;
}

interface SavedSearchesProps {
  searches: SavedSearch[];
  onLoad: (search: SavedSearch) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({
  searches,
  onLoad,
  onDelete,
  onClose,
}) => {
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved search?')) {
      onDelete(id);
    }
  };

  return (
    <div className="saved-searches-panel">
      <div className="saved-searches-header">
        <h4>Saved Searches</h4>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {searches.length === 0 ? (
        <div className="no-saved-searches">
          <p>No saved searches yet.</p>
          <p className="hint">Create a search and click "Save Search" to save it for later.</p>
        </div>
      ) : (
        <div className="saved-searches-list">
          {searches.map((search) => (
            <div
              key={search.id}
              className="saved-search-item"
              onClick={() => onLoad(search)}
            >
              <div className="saved-search-info">
                <div className="saved-search-name">{search.name}</div>
                {search.description && (
                  <div className="saved-search-description">{search.description}</div>
                )}
                <div className="saved-search-meta">
                  <span className="use-count">Used {search.useCount} times</span>
                  {search.lastUsedAt && (
                    <span className="last-used">
                      Last used: {new Date(search.lastUsedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="delete-saved-search-btn"
                onClick={(e) => handleDelete(e, search.id)}
                title="Delete saved search"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearches;
