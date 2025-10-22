/**
 * WF-COMP-TBD | DocumentManagementCard.tsx - DocumentManagement Card Component
 * Purpose: Compact card display for document-management items
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';

interface DocumentManagementItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
}

interface DocumentManagementCardProps {
  item: DocumentManagementItem;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DocumentManagementCard: React.FC<DocumentManagementCardProps> = ({ item, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          item.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      </div>
      
      {item.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
      )}
      
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        {onView && (
          <button
            onClick={() => onView(item.id)}
            className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(item.id)}
            className="flex-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentManagementCard;
