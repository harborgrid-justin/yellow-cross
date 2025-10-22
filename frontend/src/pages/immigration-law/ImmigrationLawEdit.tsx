/**
 * WF-COMP-TBD | ImmigrationLawEdit.tsx - ImmigrationLaw Edit Page
 * Purpose: Edit existing immigration-law item
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchImmigrationLawItem,
  updateImmigrationLawItem,
  selectImmigrationLawItem,
  selectImmigrationLawLoading,
  selectImmigrationLawError
} from './store';

interface ImmigrationLawFormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

const ImmigrationLawEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const item = useAppSelector(selectImmigrationLawItem);
  const loading = useAppSelector(selectImmigrationLawLoading);
  const error = useAppSelector(selectImmigrationLawError);

  const [formData, setFormData] = useState<ImmigrationLawFormData>({
    name: '',
    description: '',
    status: 'active'
  });

  const [validationErrors, setValidationErrors] = useState<Partial<ImmigrationLawFormData>>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchImmigrationLawItem(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        status: item.status
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name as keyof ImmigrationLawFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<ImmigrationLawFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !id) {
      return;
    }

    try {
      await dispatch(updateImmigrationLawItem({ id, data: formData })).unwrap();
      navigate(`/pages/immigration-law/${id}`);
    } catch (err) {
      console.error('Failed to update immigration-law item:', err);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/pages/immigration-law/${id}`);
    } else {
      navigate('/pages/immigration-law');
    }
  };

  if (loading?.details) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading immigration-law item...</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">ImmigrationLaw item not found</p>
          <button 
            onClick={() => navigate('/pages/immigration-law')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit ImmigrationLaw Item</h1>
          <p className="text-gray-600 mt-1">Update immigration-law item information</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter immigration-law name"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading?.operations}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading?.operations}
            >
              {loading?.operations ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update ImmigrationLaw Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImmigrationLawEdit;
