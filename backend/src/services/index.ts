/**
 * Services Index
 * Exports all service classes
 */

export { BaseService } from './BaseService';
export { CaseService } from './CaseService';
export { ClientService } from './ClientService';
export { DocumentService } from './DocumentService';
export { TaskService } from './TaskService';

// Re-export for convenience
export default {
  BaseService,
  CaseService,
  ClientService,
  DocumentService,
  TaskService
};
