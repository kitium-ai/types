/**
 * API Request/Response Types
 * Standard API communication types and patterns
 */

/**
 * Standard HTTP methods
 */
export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * Standard HTTP status codes
 */
export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  RATE_LIMITED = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Standard API response wrapper
 */
export interface APIResponse<T = unknown> {
  readonly success: boolean;
  readonly status: number;
  readonly message?: string;
  readonly data?: T;
  readonly error?: APIError;
  readonly metadata?: ResponseMetadata;
  readonly timestamp: string;
}

/**
 * Response metadata for pagination and tracking
 */
export interface ResponseMetadata {
  readonly requestId: string;
  readonly version: string;
  readonly timestamp: string;
  readonly duration: number; // milliseconds
  readonly pagination?: {
    readonly page: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
  };
}

/**
 * API Error details
 */
export interface APIError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly field?: string;
  readonly value?: unknown;
  readonly suggestion?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
  };
}

/**
 * List query parameters
 */
export interface ListQueryParams {
  readonly page?: number;
  readonly pageSize?: number;
  readonly offset?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
  readonly filter?: Record<string, unknown>;
  readonly include?: readonly string[]; // Relations to include
  readonly exclude?: readonly string[]; // Fields to exclude
}

/**
 * Request pagination
 */
export interface RequestPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly sortBy?: string;
  readonly sortOrder: 'asc' | 'desc';
}

/**
 * File upload metadata
 */
export interface FileUpload {
  readonly id: string;
  readonly name: string;
  readonly mimeType: string;
  readonly size: number;
  readonly url: string;
  readonly uploadedAt: Date;
  readonly uploadedBy: string; // User ID
  readonly metadata?: {
    readonly width?: number;
    readonly height?: number;
    readonly duration?: number;
  };
}

/**
 * Webhook event payload
 */
export interface WebhookPayload {
  readonly id: string;
  readonly event: string;
  readonly timestamp: Date;
  readonly data: Record<string, unknown>;
  readonly previousData?: Record<string, unknown>;
  readonly organizationId: string;
  readonly userId?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  readonly id: string;
  readonly organizationId: string;
  readonly url: string;
  readonly events: readonly string[];
  readonly secret: string;
  readonly headers?: Record<string, string>;
  readonly isActive: boolean;
  readonly retryPolicy?: {
    readonly maxRetries: number;
    readonly backoffMultiplier: number;
    readonly initialDelayMs: number;
  };
  readonly lastTriggeredAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Webhook delivery log
 */
export interface WebhookDelivery {
  readonly id: string;
  readonly webhookId: string;
  readonly event: string;
  readonly payload: WebhookPayload;
  readonly statusCode?: number;
  readonly response?: string;
  readonly error?: string;
  readonly retryCount: number;
  readonly nextRetryAt?: Date;
  readonly deliveredAt?: Date;
  readonly timestamp: Date;
}

/**
 * Request context information
 */
export interface RequestContext {
  readonly requestId: string;
  readonly userId?: string;
  readonly organizationId?: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly origin?: string;
  readonly timestamp: Date;
}

/**
 * Batch request for multiple operations
 */
export interface BatchRequest {
  readonly id: string;
  readonly requests: readonly BatchRequestItem[];
}

/**
 * Individual item in batch request
 */
export interface BatchRequestItem {
  readonly id: string;
  readonly method: HTTPMethod;
  readonly path: string;
  readonly body?: unknown;
  readonly headers?: Record<string, string>;
}

/**
 * Batch response containing multiple results
 */
export interface BatchResponse {
  readonly id: string;
  readonly responses: readonly BatchResponseItem[];
  readonly timestamp: Date;
}

/**
 * Individual item in batch response
 */
export interface BatchResponseItem {
  readonly id: string;
  readonly status: number;
  readonly body: unknown;
  readonly headers?: Record<string, string>;
}

/**
 * Query filter specification
 */
export interface FilterSpec {
  readonly field: string;
  readonly operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith' | 'exists' | 'regex';
  readonly value: unknown;
  readonly caseSensitive?: boolean;
}

/**
 * Sort specification
 */
export interface SortSpec {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}

/**
 * Health check response
 */
export interface HealthCheck {
  readonly status: 'healthy' | 'degraded' | 'unhealthy';
  readonly timestamp: Date;
  readonly uptime: number; // seconds
  readonly version: string;
  readonly services?: {
    readonly [key: string]: {
      readonly status: 'healthy' | 'unhealthy';
      readonly latency: number; // ms
      readonly message?: string;
    };
  };
}

/**
 * Rate limit headers information
 */
export interface RateLimitInfo {
  readonly limit: number;
  readonly remaining: number;
  readonly reset: Date;
  readonly retryAfter?: number;
}

/**
 * Cache control configuration
 */
export interface CacheControl {
  readonly public: boolean;
  readonly private: boolean;
  readonly maxAge?: number;
  readonly sMaxAge?: number;
  readonly noCache: boolean;
  readonly noStore: boolean;
  readonly mustRevalidate: boolean;
}

/**
 * CORS configuration
 */
export interface CORSConfig {
  readonly allowOrigins: readonly string[];
  readonly allowMethods: readonly HTTPMethod[];
  readonly allowHeaders: readonly string[];
  readonly exposeHeaders: readonly string[];
  readonly maxAge: number;
  readonly allowCredentials: boolean;
}

/**
 * API versioning information
 */
export interface APIVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease?: string;
  readonly metadata?: string;
}

/**
 * Feature flag for API features
 */
export interface FeatureFlag {
  readonly name: string;
  readonly enabled: boolean;
  readonly percentage?: number; // 0-100 for gradual rollout
  readonly targetAudience?: {
    readonly userIds?: readonly string[];
    readonly organizationIds?: readonly string[];
    readonly regions?: readonly string[];
  };
  readonly expiresAt?: Date;
}

/**
 * API rate limit policy
 */
export interface RateLimitPolicy {
  readonly requestsPerSecond?: number;
  readonly requestsPerMinute?: number;
  readonly requestsPerHour?: number;
  readonly requestsPerDay?: number;
  readonly concurrentRequests?: number;
  readonly burstLimit?: number;
  readonly whitelistedIps?: readonly string[];
}
