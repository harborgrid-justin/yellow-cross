/**
 * Example Component Using Case Management Hooks
 * This demonstrates how to use the hooks in a real component
 */

import React from 'react';
import { useCases, useCreateCase } from '../hooks';

const CaseListExample: React.FC = () => {
  const { data: cases, loading, error, refetch } = useCases({ page: 1, limit: 10 });
  const { mutate: createCase, loading: creating } = useCreateCase({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateCase = async () => {
    try {
      await createCase({
        title: 'New Case Example',
        description: 'This is a sample case',
        createdBy: 'current-user-id',
      });
    } catch (err) {
      console.error('Failed to create case:', err);
    }
  };

  if (loading) {
    return <div>Loading cases...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Case List</h2>
      <button onClick={handleCreateCase} disabled={creating}>
        {creating ? 'Creating...' : 'Create New Case'}
      </button>
      <button onClick={refetch}>Refresh</button>
      
      <ul>
        {cases?.data.map((caseItem) => (
          <li key={caseItem.id}>
            {caseItem.title} - Status: {caseItem.status}
          </li>
        ))}
      </ul>
      
      {cases && (
        <p>
          Showing {cases.data.length} of {cases.total} cases
        </p>
      )}
    </div>
  );
};

export default CaseListExample;
