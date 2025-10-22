/**
 * WF-COMP-XXX | audit/index.ts - Audit service
 * Purpose: Log API operations for auditing
 * Last Updated: 2025-10-22 | File Type: .ts
 */

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export type AuditResourceType = string;

export interface AuditLogEntry {
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  status: AuditStatus;
  timestamp?: number;
  userId?: string;
  details?: Record<string, unknown>;
  error?: string;
}

class AuditService {
  private logs: AuditLogEntry[] = [];
  private readonly maxLogs = 1000;
  private enabled = true;

  /**
   * Log an audit action
   */
  async logAction(entry: AuditLogEntry): Promise<void> {
    if (!this.enabled) return;

    const auditEntry: AuditLogEntry = {
      ...entry,
      timestamp: Date.now(),
    };

    this.logs.push(auditEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In production, you would send this to a backend audit service
    if (process.env['NODE_ENV'] === 'development') {
      console.log('[Audit]', auditEntry);
    }
  }

  /**
   * Get all audit logs
   */
  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs for a specific resource
   */
  getLogsForResource(resourceType: AuditResourceType, resourceId: string): AuditLogEntry[] {
    return this.logs.filter(
      log => log.resourceType === resourceType && log.resourceId === resourceId
    );
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Enable/disable audit logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Export singleton instance
export const auditService = new AuditService();
