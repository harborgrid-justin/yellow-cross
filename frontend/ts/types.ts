// Yellow Cross - TypeScript Type Definitions

/**
 * Feature data structure
 */
export interface Feature {
    name: string;
    icon: string;
    endpoint: string;
    category: 'management' | 'legal' | 'compliance' | 'analytics';
    description: string;
    subFeatureCount: number;
}

/**
 * API response types
 */
export interface APIResponse<T = any> {
    [key: string]: T;
}

export interface PlatformInfo {
    name: string;
    version: string;
    description: string;
    features: Feature[];
}

export interface HealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
}

export interface FeatureAPIData {
    subFeatures?: string[];
    [key: string]: any;
}

/**
 * HTTP method types
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Debounced function type
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;
