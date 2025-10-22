/**
 * WF-COMP-TBD | FinancialServicesFilters.tsx - FinancialServices Filters Component
 * Purpose: Filtering and search component
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';

interface FinancialServicesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
}

const FinancialServicesFilters: React.FC<FinancialServicesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search financial-services items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <svg className="text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FinancialServicesFilters;
