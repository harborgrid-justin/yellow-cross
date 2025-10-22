/**
 * Redux Integration Example Component
 * Demonstrates how to use Redux store with hooks
 * This is an example file - can be removed in production
 */

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { authActions, caseManagementActions } from '../../store';

const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Select state from different slices
  const user = useAppSelector((state) => state.auth.user);
  const cases = useAppSelector((state) => state.caseManagement.cases);
  const selectedCaseId = useAppSelector((state) => state.caseManagement.selectedCaseId);
  
  // Example: Selecting a case
  const handleSelectCase = (caseId: string) => {
    dispatch(caseManagementActions.selectCase(caseId));
  };
  
  // Example: Adding a case
  const handleAddCase = () => {
    const newCase = {
      id: `case-${Date.now()}`,
      title: 'New Case',
      description: 'Case description',
      status: 'open',
      clientId: 'client-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(caseManagementActions.addCase(newCase));
  };
  
  // Example: Setting filters
  const handleFilterByStatus = (status: string) => {
    dispatch(caseManagementActions.setFilters({ status }));
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Redux Integration Example</h2>
      
      <section style={{ marginBottom: '20px' }}>
        <h3>Auth State</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify({ user: user ? { email: user.email, id: user.id } : null }, null, 2)}
        </pre>
      </section>
      
      <section style={{ marginBottom: '20px' }}>
        <h3>Case Management State</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify({ 
            totalCases: cases.length,
            selectedCaseId,
          }, null, 2)}
        </pre>
      </section>
      
      <section style={{ marginBottom: '20px' }}>
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleAddCase}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Add Case
          </button>
          <button 
            onClick={() => handleSelectCase(`case-${Date.now()}`)}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Select Random Case
          </button>
          <button 
            onClick={() => handleFilterByStatus('open')}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Filter by Open
          </button>
          <button 
            onClick={() => dispatch(caseManagementActions.clearFilters())}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      </section>
      
      <section>
        <h3>Cases List</h3>
        {cases.length === 0 ? (
          <p>No cases yet. Click "Add Case" to create one.</p>
        ) : (
          <ul>
            {cases.map((c) => (
              <li key={c.id} style={{ marginBottom: '8px' }}>
                {c.title} - {c.status}
                {selectedCaseId === c.id && ' (Selected)'}
                <button 
                  onClick={() => handleSelectCase(c.id)}
                  style={{ marginLeft: '10px', padding: '4px 8px' }}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ReduxExample;
