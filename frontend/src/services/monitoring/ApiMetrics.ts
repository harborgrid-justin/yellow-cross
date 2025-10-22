/**
 * WF-COMP-XXX | ApiMetrics.ts - API performance metrics
 * Purpose: Track and report API performance metrics
 * Last Updated: 2025-10-22 | File Type: .ts
 */

interface RequestMetric {
  url: string;
  status: number;
  duration: number;
  timestamp: number;
}

interface ErrorMetric {
  message: string;
  url?: string;
  status?: number;
  timestamp: number;
}

class ApiMetrics {
  private requests: RequestMetric[] = [];
  private errors: ErrorMetric[] = [];
  private readonly maxEntries = 100; // Keep last 100 entries

  /**
   * Record a successful request
   */
  recordRequest(url: string, status: number, duration: number): void {
    this.requests.push({
      url,
      status,
      duration,
      timestamp: Date.now(),
    });

    // Keep only the last maxEntries
    if (this.requests.length > this.maxEntries) {
      this.requests = this.requests.slice(-this.maxEntries);
    }
  }

  /**
   * Record an error
   */
  recordError(error: unknown): void {
    const errorMetric: ErrorMetric = {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    };

    // Extract additional info from Axios errors
    if (error && typeof error === 'object' && 'config' in error) {
      const axiosError = error as { config?: { url?: string }; response?: { status?: number } };
      errorMetric.url = axiosError.config?.url;
      errorMetric.status = axiosError.response?.status;
    }

    this.errors.push(errorMetric);

    // Keep only the last maxEntries
    if (this.errors.length > this.maxEntries) {
      this.errors = this.errors.slice(-this.maxEntries);
    }
  }

  /**
   * Get average response time
   */
  getAverageResponseTime(): number {
    if (this.requests.length === 0) return 0;
    
    const total = this.requests.reduce((sum, req) => sum + req.duration, 0);
    return total / this.requests.length;
  }

  /**
   * Get error rate (errors / total requests)
   */
  getErrorRate(): number {
    const total = this.requests.length + this.errors.length;
    if (total === 0) return 0;
    
    return this.errors.length / total;
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    return {
      requests: this.requests,
      errors: this.errors,
      averageResponseTime: this.getAverageResponseTime(),
      errorRate: this.getErrorRate(),
      totalRequests: this.requests.length,
      totalErrors: this.errors.length,
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.requests = [];
    this.errors = [];
  }
}

// Export singleton instance
export const apiMetrics = new ApiMetrics();
