/**
 * WF-COMP-013 | index.ts - Admin page exports
 * Purpose: Centralized exports for admin page module
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as AdminMain } from './AdminMain';
export { default as AdminDetail } from './AdminDetail';
export { default as AdminCreate } from './AdminCreate';
export { default as AdminEdit } from './AdminEdit';

// Route exports
export { default as AdminRoutes } from './routes';
