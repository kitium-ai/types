/**
 * API Error Types
 * Standardized error types for API responses
 */

/**
 * HTTP status codes
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  RATE_LIMITED = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Standard error codes for API responses
 */
export enum ApiErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Authentication/Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_EXISTS = 'RESOURCE_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',

  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

/**
 * Field validation error detail
 */
export interface FieldError {
  readonly field: string;
  readonly message: string;
  readonly code?: string;
  readonly value?: unknown;
}

/**
 * Error response metadata
 */
export interface ErrorMetadata {
  readonly timestamp: string;
  readonly path?: string;
  readonly method?: string;
  readonly requestId?: string;
  readonly traceId?: string;
  readonly version?: string;
}

/**
 * Consistent error response format
 * Compatible with APIResponse structure but with specific error details
 */
export interface ApiErrorResponse {
  readonly success: false;
  readonly status: number;
  readonly statusCode: HttpStatusCode;
  readonly message?: string;
  readonly data?: null;
  readonly error: {
    readonly code: ApiErrorCode;
    readonly message: string;
    readonly details?: Record<string, unknown> | readonly FieldError[];
    readonly field?: string;
    readonly value?: unknown;
    readonly suggestion?: string;
  };
  readonly metadata: ErrorMetadata;
  readonly timestamp: string;
}

/**
 * Success response format
 * Compatible with APIResponse structure
 */
export interface ApiSuccessResponse<T = unknown> {
  readonly success: true;
  readonly status: number;
  readonly statusCode: HttpStatusCode;
  readonly message?: string;
  readonly data: T;
  readonly error?: never;
  readonly metadata: ErrorMetadata & {
    readonly duration?: number;
    readonly pagination?: {
      readonly page: number;
      readonly pageSize: number;
      readonly totalItems: number;
      readonly totalPages: number;
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
    };
  };
  readonly timestamp: string;
}
