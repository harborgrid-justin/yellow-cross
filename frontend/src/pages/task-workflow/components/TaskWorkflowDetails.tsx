/**
 * WF-COMP-TBD | TaskWorkflowDetails.tsx - TaskWorkflow Details Component
 * Purpose: Detailed information display for task-workflow item
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';

interface TaskWorkflowItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface TaskWorkflowDetailsProps {
  item: TaskWorkflowItem;
}

const TaskWorkflowDetails: React.FC<TaskWorkflowDetailsProps> = ({ item }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{item.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{item.description || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                item.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Metadata */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{item.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(item.createdAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(item.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default TaskWorkflowDetails;
