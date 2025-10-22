/**
 * WF-COMP-TBD | FamilyLawList.tsx - FamilyLaw List Component
 * Purpose: Reusable list view for family-law items
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FamilyLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface FamilyLawListProps {
  items: FamilyLawItem[];
  onDelete?: (id: string) => void;
}

const FamilyLawList: React.FC<FamilyLawListProps> = ({ items, onDelete }) => {
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/pages/family-law/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/pages/family-law/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (onDelete && window.confirm('Are you sure you want to delete this family-law item?')) {
      onDelete(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{item.description || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleView(item.id)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(item.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                {onDelete && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FamilyLawList;
